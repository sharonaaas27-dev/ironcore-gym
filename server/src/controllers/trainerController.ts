import { Request, Response } from 'express';
import Trainer from '../models/Trainer';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { createTrainerSchema, updateTrainerSchema } from '../validation/trainer';
import { getPaginationParams, buildPaginationResponse } from '../utils/helpers';

export const getTrainers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const { skip } = getPaginationParams(page, limit);
  const filter: Record<string, unknown> = {};
  if (req.query.available !== 'false') filter.available = true;
  const total = await Trainer.countDocuments(filter);
  const trainers = await Trainer.find(filter).skip(skip).limit(limit);
  res.json({ success: true, count: trainers.length, data: trainers, pagination: buildPaginationResponse(total, page, limit) });
};

export const getTrainer = async (req: Request, res: Response) => {
  const trainer = await Trainer.findById(req.params.id);
  if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
  res.json({ success: true, data: trainer });
};

export const createTrainer = async (req: Request, res: Response) => {
  const parsed = createTrainerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  if (!parsed.data.userId) {
    const user = await User.findOne({ email: parsed.data.email });
    if (user) {
      (parsed.data as any).userId = user._id;
    }
  }

  const trainer = await Trainer.create(parsed.data);
  res.status(201).json({ success: true, data: trainer });
};

export const updateTrainer = async (req: Request, res: Response) => {
  const parsed = updateTrainerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }
  const trainer = await Trainer.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
  if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
  res.json({ success: true, data: trainer });
};

export const deleteTrainer = async (req: Request, res: Response) => {
  const trainer = await Trainer.findByIdAndDelete(req.params.id);
  if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
  res.json({ success: true, message: 'Trainer deleted' });
};

export const getMyTrainerProfile = async (req: AuthRequest, res: Response) => {
  const trainer = await Trainer.findOne({ userId: req.user!._id });
  if (!trainer) {
    return res.status(404).json({ success: false, message: 'Trainer profile not found. Please contact admin.' });
  }
  res.json({ success: true, data: trainer });
};

export const updateMyTrainerProfile = async (req: AuthRequest, res: Response) => {
  let trainer = await Trainer.findOne({ userId: req.user!._id });
  if (!trainer) {
    return res.status(404).json({ success: false, message: 'Trainer profile not found' });
  }

  const allowedFields = ['name', 'phone', 'avatar', 'bio', 'specialties', 'experience', 'certificates', 'socialLinks', 'available'];
  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  trainer = await Trainer.findByIdAndUpdate(trainer._id, updates, { new: true, runValidators: true });
  res.json({ success: true, data: trainer });
};
