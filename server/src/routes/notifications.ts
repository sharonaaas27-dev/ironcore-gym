import { Router } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import Notification from '../models/Notification';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', protect, asyncHandler(async (req: AuthRequest, res) => {
  try {
    const notifications = await Notification.find({ user: req.user!._id }).sort('-createdAt');
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
}));

router.put('/:id/read', protect, asyncHandler(async (req: AuthRequest, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, data: notification });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
}));

router.put('/read-all', protect, asyncHandler(async (req: AuthRequest, res) => {
  try {
    await Notification.updateMany({ user: req.user!._id, read: false }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update notifications' });
  }
}));

export default router;
