import { Router } from 'express';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import Contact from '../models/Contact';
import { contactSchema } from '../validation/contact';
import { sendContactNotification, sendEmail } from '../services/emailService';
import { config } from '../config';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.post('/', asyncHandler(async (req, res) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    }

    const contact = await Contact.create(parsed.data);

    sendContactNotification(config.adminEmail, parsed.data.name, parsed.data.email, parsed.data.subject, parsed.data.message).catch(() => {});

    res.status(201).json({ success: true, data: contact });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
}));

router.get('/', protect, authorize('admin', 'trainer'), asyncHandler(async (_req, res) => {
  try {
    const messages = await Contact.find().sort('-createdAt').populate('replies.repliedBy', 'name');
    res.json({ success: true, count: messages.length, data: messages });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
}));

router.get('/my', protect, asyncHandler(async (req: AuthRequest, res) => {
  try {
    const messages = await Contact.find({ email: req.user!.email }).sort('-createdAt').populate('replies.repliedBy', 'name');
    res.json({ success: true, count: messages.length, data: messages });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch your messages' });
  }
}));

router.put('/:id/read', protect, authorize('admin', 'trainer'), asyncHandler(async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: message });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update message' });
  }
}));

router.post('/:id/reply', protect, authorize('admin', 'trainer'), asyncHandler(async (req: AuthRequest, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message is required' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });

    const reply = {
      message: message.trim(),
      repliedBy: req.user!._id,
      createdAt: new Date(),
    };

    contact.replies.push(reply);
    contact.status = 'replied';
    await contact.save();

    const populated = await Contact.findById(contact._id).populate('replies.repliedBy', 'name');

    let emailSent = true;
    try {
      await sendEmail({
        to: contact.email,
        subject: `Re: ${contact.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d4a017;">Ash2 Fitness</h2>
            <p>Dear ${contact.name},</p>
            <p>${req.user!.name} has replied to your message:</p>
            <div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;">
              <p>${message.trim()}</p>
            </div>
            <hr>
            <p style="color: #666; font-size: 12px;">Your original message:</p>
            <p style="color: #666; font-size: 12px;">${contact.message}</p>
          </div>
        `,
      });
    } catch {
      emailSent = false;
    }

    res.json({ success: true, data: populated, emailSent });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to send reply' });
  }
}));

export default router;
