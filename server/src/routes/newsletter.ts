import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import Newsletter from '../models/Newsletter';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', protect, authorize('admin'), asyncHandler(async (_req, res) => {
  try {
    const subscribers = await Newsletter.find().sort('-subscribedAt');
    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers' });
  }
}));

router.post('/subscribe', asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }

    await Newsletter.create({ email: email.toLowerCase() });
    res.status(201).json({ success: true, message: 'Successfully subscribed' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to subscribe' });
  }
}));

router.post('/unsubscribe', asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }
    const deleted = await Newsletter.findOneAndDelete({ email: email.toLowerCase() });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    res.json({ success: true, message: 'Successfully unsubscribed' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to unsubscribe' });
  }
}));

export default router;
