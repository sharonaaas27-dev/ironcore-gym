import { Response } from 'express';
import Trainer from '../models/Trainer';
import TrainerRequest from '../models/TrainerRequest';
import User from '../models/User';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';
import { sendNotification } from '../socket';

async function getTrainerUserId(trainer: { userId?: import('mongoose').Types.ObjectId | null; email?: string }): Promise<import('mongoose').Types.ObjectId | null> {
  if (trainer.userId) return trainer.userId;
  if (trainer.email) {
    const user = await User.findOne({ email: trainer.email }).select('_id');
    if (user) return user._id;
  }
  return null;
}

export const requestTrainer = async (req: AuthRequest, res: Response) => {
  const { trainerId } = req.body;
  if (!trainerId) {
    return res.status(400).json({ success: false, message: 'Trainer ID is required' });
  }

  const trainer = await Trainer.findById(trainerId);
  if (!trainer) {
    return res.status(404).json({ success: false, message: 'Trainer not found' });
  }

  const existing = await TrainerRequest.findOne({ user: req.user!._id, trainer: trainerId });
  if (existing) {
    if (existing.status === 'pending') {
      return res.status(409).json({ success: false, message: 'You already have a pending request with this trainer' });
    }
    if (existing.status === 'approved') {
      return res.status(409).json({ success: false, message: 'This trainer is already your trainer' });
    }
    existing.status = 'pending';
    await existing.save();
    const trainerUserId = await getTrainerUserId(trainer);
    if (trainerUserId) {
      const notification = await Notification.create({
        user: trainerUserId,
        title: 'New Client Request',
        message: `${req.user!.name} has requested you as their trainer.`,
        type: 'info',
      });
      sendNotification(trainerUserId.toString(), notification);
    }
    return res.json({ success: true, data: existing });
  }

  const request = await TrainerRequest.create({ user: req.user!._id, trainer: trainerId });

  const trainerUserId = await getTrainerUserId(trainer);
  if (trainerUserId) {
    const notification = await Notification.create({
      user: trainerUserId,
      title: 'New Client Request',
      message: `${req.user!.name} has requested you as their trainer.`,
      type: 'info',
    });
    sendNotification(trainerUserId.toString(), notification);
  }

  res.status(201).json({ success: true, data: request });
};

export const getReceivedRequests = async (req: AuthRequest, res: Response) => {
  const trainer = await Trainer.findOne({ userId: req.user!._id });
  if (!trainer) {
    return res.status(404).json({ success: false, message: 'Trainer profile not found' });
  }

  const requests = await TrainerRequest.find({ trainer: trainer._id, status: 'pending' })
    .populate('user', 'name email phone avatar')
    .sort('-createdAt');
  res.json({ success: true, count: requests.length, data: requests });
};

export const getMyClients = async (req: AuthRequest, res: Response) => {
  const trainer = await Trainer.findOne({ userId: req.user!._id });
  if (!trainer) {
    return res.status(404).json({ success: false, message: 'Trainer profile not found' });
  }

  const approved = await TrainerRequest.find({ trainer: trainer._id, status: 'approved' })
    .populate('user', 'name email phone avatar')
    .sort('-createdAt');
  res.json({ success: true, count: approved.length, data: approved });
};

export const approveRequest = async (req: AuthRequest, res: Response) => {
  const request = await TrainerRequest.findById(req.params.id).populate('trainer');
  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  const trainer = await Trainer.findOne({ userId: req.user!._id });
  if (!trainer || request.trainer._id.toString() !== trainer._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  request.status = 'approved';
  await request.save();

  await User.findByIdAndUpdate(request.user, { trainer: trainer._id });

  const notification = await Notification.create({
    user: request.user,
    title: 'Trainer Request Approved',
    message: `${trainer.name} has accepted your request and is now your trainer!`,
    type: 'success',
  });
  sendNotification(request.user.toString(), notification);

  res.json({ success: true, data: request });
};

export const rejectRequest = async (req: AuthRequest, res: Response) => {
  const request = await TrainerRequest.findById(req.params.id).populate('trainer');
  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  const trainer = await Trainer.findOne({ userId: req.user!._id });
  if (!trainer || request.trainer._id.toString() !== trainer._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  request.status = 'rejected';
  await request.save();

  const notification = await Notification.create({
    user: request.user,
    title: 'Trainer Request Declined',
    message: `${trainer.name} has declined your request.`,
    type: 'warning',
  });
  sendNotification(request.user.toString(), notification);

  res.json({ success: true, data: request });
};
