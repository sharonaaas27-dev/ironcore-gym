import { Response } from 'express';
import Booking from '../models/Booking';
import Trainer from '../models/Trainer';
import Notification from '../models/Notification';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { createBookingSchema } from '../validation/booking';
import { sendBookingConfirmation } from '../services/emailService';
import { sendNotification } from '../socket';
import { getPaginationParams, buildPaginationResponse } from '../utils/helpers';

export const getTrainerSessions = async (req: AuthRequest, res: Response) => {
  let trainer = await Trainer.findOne({ userId: req.user?._id });
  if (!trainer) {
    trainer = await Trainer.findOne({ email: req.user?.email });
  }
  if (!trainer) {
    return res.status(404).json({ success: false, message: 'Trainer profile not found' });
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const { skip } = getPaginationParams(page, limit);
  const total = await Booking.countDocuments({ trainer: trainer._id });
  const sessions = await Booking.find({ trainer: trainer._id })
    .populate('user', 'name email phone avatar')
    .populate('program', 'title slug')
    .sort('-date')
    .skip(skip)
    .limit(limit);
  res.json({ success: true, count: sessions.length, data: sessions, pagination: buildPaginationResponse(total, page, limit) });
};

export const getBookings = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const { skip } = getPaginationParams(page, limit);
  const total = await Booking.countDocuments();
  const bookings = await Booking.find().populate('user trainer').skip(skip).limit(limit);
  res.json({ success: true, count: bookings.length, data: bookings, pagination: buildPaginationResponse(total, page, limit) });
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const { skip } = getPaginationParams(page, limit);
  const total = await Booking.countDocuments({ user: req.user?._id });
  const bookings = await Booking.find({ user: req.user?._id })
    .populate('trainer')
    .skip(skip)
    .limit(limit);
  res.json({ success: true, count: bookings.length, data: bookings, pagination: buildPaginationResponse(total, page, limit) });
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const { trainer: trainerId, date, time, type } = parsed.data;

  if (trainerId) {
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    if (!trainer.available) {
      return res.status(400).json({ success: false, message: 'Trainer is not available' });
    }

    const bookingDate = new Date(date);
    const conflict = await Booking.findOne({
      trainer: trainerId,
      date: bookingDate,
      time,
      status: { $nin: ['cancelled'] },
    });
    if (conflict) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked' });
    }
  }

  const booking = await Booking.create({
    user: req.user?._id,
    trainer: trainerId,
    date,
    time,
    type,
  });

  const user = await User.findById(req.user?._id);
  if (user) {
    sendBookingConfirmation(user.email, user.name, date, time);
  }

  const notification = await Notification.create({
    user: req.user?._id,
    title: 'Booking Confirmed',
    message: `Your ${type} session on ${new Date(date).toLocaleDateString()} at ${time} has been booked.`,
    type: 'success',
  });
  sendNotification(req.user!._id.toString(), notification);

  res.status(201).json({ success: true, data: booking });
};

export const getBooking = async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id).populate('user trainer');
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, data: booking });
};

export const updateBooking = async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  const isOwner = booking.user.toString() === req.user!._id.toString();
  const isAdmin = req.user!.role === 'admin';
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
  }

  const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, data: updated });
};

export const deleteBooking = async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  const isOwner = booking.user.toString() === req.user!._id.toString();
  const isAdmin = req.user!.role === 'admin';
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this booking' });
  }

  await Booking.findByIdAndDelete(req.params.id);

  const bookingDate = booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A';
  const notification = await Notification.create({
    user: req.user?._id,
    title: 'Booking Cancelled',
    message: `Your ${booking.type} session on ${bookingDate} at ${booking.time} has been cancelled.`,
    type: 'warning',
  });
  sendNotification(req.user!._id.toString(), notification);

  res.json({ success: true, message: 'Booking cancelled' });
};
