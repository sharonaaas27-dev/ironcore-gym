import { Request, Response } from 'express';
import path from 'path';
import Program from '../models/Program';
import Booking from '../models/Booking';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';
import { createProgramSchema, updateProgramSchema } from '../validation/program';
import { getPaginationParams, buildPaginationResponse } from '../utils/helpers';
import { sendNotification } from '../socket';

export const getPrograms = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const { skip } = getPaginationParams(page, limit);
  const total = await Program.countDocuments();
  const programs = await Program.find().populate('trainer').skip(skip).limit(limit);
  res.json({ success: true, count: programs.length, data: programs, pagination: buildPaginationResponse(total, page, limit) });
};

export const getProgram = async (req: Request, res: Response) => {
  const program = await Program.findOne({ slug: req.params.slug }).populate('trainer');
  if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
  res.json({ success: true, data: program });
};

export const createProgram = async (req: Request, res: Response) => {
  const parsed = createProgramSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }
  const program = await Program.create(parsed.data);
  res.status(201).json({ success: true, data: program });
};

export const updateProgram = async (req: Request, res: Response) => {
  const parsed = updateProgramSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }
  const program = await Program.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
  if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
  res.json({ success: true, data: program });
};

export const deleteProgram = async (req: Request, res: Response) => {
  const program = await Program.findByIdAndDelete(req.params.id);
  if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
  res.json({ success: true, message: 'Program deleted' });
};

export const uploadProgramImage = async (req: Request, res: Response) => {
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(file.path)}`;
  res.status(200).json({ success: true, data: { image: imageUrl } });
};

export const enrollProgram = async (req: AuthRequest, res: Response) => {
  const program = await Program.findOne({ slug: req.params.slug });
  if (!program) return res.status(404).json({ success: false, message: 'Program not found' });

  const existing = await Booking.findOne({ user: req.user?._id, program: program._id, status: { $nin: ['cancelled'] } });
  if (existing) return res.status(409).json({ success: false, message: 'Already enrolled in this program' });

  const booking = await Booking.create({
    user: req.user?._id,
    program: program._id,
    type: 'class',
    status: 'confirmed',
  });

  await Program.findByIdAndUpdate(program._id, { $inc: { enrolledCount: 1 } });

  const notification = await Notification.create({
    user: req.user?._id,
    title: 'Enrolled in Program',
    message: `You have successfully enrolled in ${program.title}.`,
    type: 'success',
  });
  sendNotification(req.user!._id.toString(), notification);

  res.status(201).json({ success: true, data: booking });
};
