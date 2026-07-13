import Stripe from 'stripe';
import { config } from '../config';

export const stripe = new Stripe(config.stripeSecretKey);

export async function createCheckoutSession({
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function createPaymentIntent(
  amount: number,
  currency = 'usd',
  metadata?: Stripe.MetadataParam
) {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  });
}

export async function constructWebhookEvent(payload: Buffer, signature: string) {
  return stripe.webhooks.constructEvent(payload, signature, config.stripeWebhookSecret);
}
