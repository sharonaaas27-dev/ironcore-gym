import { Router, Request } from 'express';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Trainer from '../models/Trainer';
import TrainerApplication from '../models/TrainerApplication';
import Booking from '../models/Booking';
import Payment from '../models/Payment';
import Membership from '../models/Membership';
import Program from '../models/Program';
import { asyncHandler } from '../middleware/asyncHandler';
import { getPaginationParams, buildPaginationResponse } from '../utils/helpers';
import { sendTrainerApprovalEmail, sendTrainerRejectionEmail } from '../services/emailService';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/users', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const { skip } = getPaginationParams(page, limit);
  const total = await User.countDocuments();
  const users = await User.find().select('-password').sort('-createdAt').skip(skip).limit(limit);
  res.json({ success: true, count: users.length, data: users, pagination: buildPaginationResponse(total, page, limit) });
}));

router.get('/members', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const { skip } = getPaginationParams(page, limit);
  const total = await User.countDocuments({ membership: { $ne: null } });
  const members = await User.find({ membership: { $ne: null } })
    .populate('membership').select('-password').skip(skip).limit(limit);
  res.json({ success: true, count: members.length, data: members, pagination: buildPaginationResponse(total, page, limit) });
}));

router.get('/analytics', asyncHandler(async (_req, res) => {
  const [totalMembers, totalBookings, totalRevenue, memberships] = await Promise.all([
    User.countDocuments({ membership: { $ne: null } }),
    Booking.countDocuments(),
    Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Membership.countDocuments(),
  ]);
  res.json({
    success: true,
    data: {
      totalMembers,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeMemberships: memberships,
    },
  });
}));

router.get('/payments', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const { skip } = getPaginationParams(page, limit);
  const total = await Payment.countDocuments();
  const payments = await Payment.find().populate('user', 'name email').sort('-createdAt').skip(skip).limit(limit);
  res.json({ success: true, count: payments.length, data: payments, pagination: buildPaginationResponse(total, page, limit) });
}));

router.get('/bookings', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const { skip } = getPaginationParams(page, limit);
  const total = await Booking.countDocuments();
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('trainer', 'name')
    .populate('program', 'title slug')
    .sort('-date')
    .skip(skip)
    .limit(limit);
  res.json({ success: true, count: bookings.length, data: bookings, pagination: buildPaginationResponse(total, page, limit) });
}));

router.put('/bookings/:id', asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, data: booking });
}));

router.get('/program-enrollments', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const { skip } = getPaginationParams(page, limit);
  const [programs, total, enrollments] = await Promise.all([
    Program.find().select('title slug enrolledCount'),
    Booking.countDocuments({ program: { $ne: null }, status: { $nin: ['cancelled'] } }),
    Booking.find({ program: { $ne: null }, status: { $nin: ['cancelled'] } })
      .populate('user', 'name email')
      .populate('program', 'title slug')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
  ]);
  res.json({
    success: true,
    data: { programs, enrollments },
    pagination: buildPaginationResponse(total, page, limit),
  });
}));

router.get('/trainer-requests', asyncHandler(async (_req, res) => {
  const trainers = await User.find({ role: 'trainer', isApproved: false })
    .select('-password')
    .sort('-createdAt')
    .lean();

  const userIds = trainers.map((t) => t._id);
  const applications = await TrainerApplication.find({ user: { $in: userIds } }).lean();
  const appMap = new Map(applications.map((a) => [a.user.toString(), a]));

  const data = trainers.map((t) => ({
    ...t,
    application: appMap.get(t._id.toString()) || null,
  }));

  res.json({ success: true, count: data.length, data });
}));

router.put('/trainer-requests/:id/approve', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const application = await TrainerApplication.findOne({ user: user._id });

  let trainer = await Trainer.findOne({ $or: [{ userId: user._id }, { email: user.email }] });
  if (!trainer) {
    trainer = await Trainer.create({
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      bio: application?.bio || 'Trainer at IRONCORE Gym',
      experience: application?.experience || 0,
      specialties: application?.specialties || [],
      phone: application?.phone || user.phone,
      certificates: application?.certificates || [],
      socialLinks: application?.socialLinks || {},
      available: true,
      userId: user._id,
    });
  }

  user.isApproved = true;
  await user.save();

  if (application) {
    application.status = 'approved';
    application.reviewedBy = (req as AuthRequest).user?._id;
    application.reviewedAt = new Date();
    await application.save();
  }

  sendTrainerApprovalEmail(user.email, user.name).catch(() => {});

  res.json({ success: true, data: user, trainer });
}));

router.put('/trainer-requests/:id/reject', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const application = await TrainerApplication.findOne({ user: user._id });
  if (application) {
    application.status = 'rejected';
    application.reviewedBy = (req as AuthRequest).user?._id;
    application.reviewedAt = new Date();
    await application.save();
  }

  sendTrainerRejectionEmail(user.email, user.name).catch(() => {});

  res.json({ success: true, message: 'Trainer request rejected' });
}));

router.put('/users/:id', asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  const update: Record<string, unknown> = {};
  if (name) update.name = name;
  if (email) update.email = email;
  if (role) update.role = role;

  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
}));

router.delete('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: 'User deleted' });
}));

export default router;
