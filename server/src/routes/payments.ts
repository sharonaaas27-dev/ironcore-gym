import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth';
import Payment from '../models/Payment';
import Membership from '../models/Membership';
import User from '../models/User';
import Notification from '../models/Notification';
import { createPaymentIntent as createStripePaymentIntent, constructWebhookEvent } from '../services/stripeService';
import { createPaymentIntentSchema } from '../validation/payment';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendNotification } from '../socket';

const router = Router();

router.get('/', protect, asyncHandler(async (req, res) => {
  try {
    const filter = (req as any).user.role === 'admin' ? {} : { user: (req as any).user._id };
    const payments = await Payment.find(filter).populate('user', 'name email').sort('-createdAt');
    res.json({ success: true, count: payments.length, data: payments });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
}));

router.get('/:id', protect, asyncHandler(async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('user', 'name email');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    if ((req as any).user.role !== 'admin' && payment.user.toString() !== (req as any).user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: payment });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch payment' });
  }
}));

/**
 * POST /api/payments/create-payment-intent
 * Creates a Stripe PaymentIntent using the membership price from MongoDB.
 * The frontend never sends the price — it is always read from the database.
 */
router.post('/create-payment-intent', protect, asyncHandler(async (req: Request, res: Response) => {
  try {
    // Validate request body using Zod schema
    const parsed = createPaymentIntentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0].message,
      });
    }

    const { membershipId, duration } = parsed.data;
    const userId = (req as any).user._id;

    // Validate membershipId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(membershipId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid membership ID format',
      });
    }

    // Find the membership and read its price from MongoDB (source of truth)
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found',
      });
    }

    // Calculate price based on duration: yearly gets 15% discount
    const finalAmount =
      duration === 'yearly'
        ? Math.round(membership.price * 12 * 0.85)
        : membership.price;

    // Create a Payment document in "pending" status before contacting Stripe
    const payment = await Payment.create({
      user: userId,
      amount: finalAmount,
      currency: 'usd',
      status: 'pending',
      method: 'unknown',
      membership: membership._id,
      duration,
    });

    // Create a Stripe PaymentIntent with the calculated price from MongoDB
    // Amount is multiplied by 100 because Stripe expects amounts in cents
    const paymentIntent = await createStripePaymentIntent(
      finalAmount,
      'usd',
      {
        paymentId: payment._id.toString(),
        userId: userId.toString(),
      }
    );

    // Save the Stripe PaymentIntent ID on the Payment document
    payment.stripePaymentId = paymentIntent.id;
    await payment.save();

    return res.status(201).json({
      success: true,
      message: 'Payment intent created',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id,
      },
    });
  } catch (error: any) {
    console.error('Create payment intent error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment intent',
    });
  }
}));

/**
 * Stripe webhook handler — exported so app.ts can register it with raw body parsing.
 * This function must receive the raw body buffer (not JSON-parsed).
 *
 * Handles:
 *   - payment_intent.succeeded  → marks payment as completed, links membership to user
 *   - payment_intent.payment_failed → marks payment as failed
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    return res.status(400).json({ success: false, message: 'Missing stripe-signature header' });
  }

  let event: any;
  try {
    event = constructWebhookEvent(req.body as Buffer, sig);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const stripePaymentId = paymentIntent.id;

        // Find the corresponding Payment document in MongoDB
        const payment = await Payment.findOne({ stripePaymentId });
        if (!payment) {
          // This webhook event is not for a payment we initiated — silently acknowledge
          return res.json({ received: true });
        }

        // Idempotency check: skip if already processed
        if (payment.status === 'completed') {
          return res.json({ received: true });
        }

        // Extract the payment method from the Stripe response
        const paymentMethod =
          paymentIntent.charges?.data?.[0]?.payment_method_details?.type || 'card';

        // Update Payment with successful details
        payment.status = 'completed';
        payment.method = paymentMethod;
        await payment.save();

        // Activate membership for the user if this payment was linked to a membership
        if (payment.membership) {
          await User.findByIdAndUpdate(payment.user, { membership: payment.membership });
        }

        // Create a notification for the user and emit via socket
        const successNotif = await Notification.create({
          user: payment.user,
          title: 'Payment Successful',
          message: `Your payment of $${(payment.amount).toFixed(2)} has been completed successfully.`,
          type: 'success',
        });
        sendNotification(payment.user.toString(), successNotif);

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const stripePaymentId = paymentIntent.id;

        // Find the corresponding Payment document
        const payment = await Payment.findOne({ stripePaymentId });
        if (!payment) {
          return res.json({ received: true });
        }

        // Update Payment status to failed
        payment.status = 'failed';
        await payment.save();

        // Notify user about failed payment
        const failedNotif = await Notification.create({
          user: payment.user,
          title: 'Payment Failed',
          message: `Your payment of $${(payment.amount).toFixed(2)} has failed. Please try again.`,
          type: 'error',
        });
        sendNotification(payment.user.toString(), failedNotif);

        break;
      }

      default:
        // Other event types are not handled but acknowledged
        break;
    }

    return res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
}

export default router;
