import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
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

    sendContactNotification(config.emailFrom, parsed.data.name, parsed.data.email, parsed.data.subject, parsed.data.message).catch(() => {});

    res.status(201).json({ success: true, data: contact });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
}));

router.get('/', protect, authorize('admin'), asyncHandler(async (_req, res) => {
  try {
    const messages = await Contact.find().sort('-createdAt');
    res.json({ success: true, count: messages.length, data: messages });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
}));

router.put('/:id/read', protect, authorize('admin'), asyncHandler(async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: message });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update message' });
  }
}));

router.post('/:id/reply', protect, authorize('admin'), asyncHandler(async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });

    await sendEmail({
      to: contact.email,
      subject: `Re: ${contact.subject} — ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4a017;">IRONCORE Gym</h2>
          <p>Dear ${contact.name},</p>
          <div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;">
            <p>${message}</p>
          </div>
          <hr>
          <p style="color: #666; font-size: 12px;">Your original message:</p>
          <p style="color: #666; font-size: 12px;">${contact.message}</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Reply sent' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to send reply' });
  }
}));

export default router;
