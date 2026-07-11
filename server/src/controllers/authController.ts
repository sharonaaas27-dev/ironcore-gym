import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import TrainerApplication from '../models/TrainerApplication';
import PasswordResetToken from '../models/PasswordResetToken';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth';
import { registerSchema, loginSchema, updateProfileSchema } from '../validation/auth';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService';

const generateToken = (user: InstanceType<typeof User>) => {
  return user.generateAuthToken();
};

const setCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: config.jwtCookieExpiresIn * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const { name, email, password, role, bio, specialties, experience, phone, certificates } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const isTrainer = role === 'trainer';

  if (isTrainer && (!bio || !specialties || specialties.length === 0 || experience === undefined)) {
    return res.status(400).json({
      success: false,
      message: 'Trainer profile details are required: bio, specialties, and experience.',
    });
  }

  const user = await User.create({ name, email, password, role, isApproved: !isTrainer, phone });

  if (isTrainer) {
    await TrainerApplication.create({
      user: user._id,
      bio: bio!,
      specialties: specialties!,
      experience: experience!,
      phone: phone || undefined,
      certificates: certificates || [],
    });

    const userObj = { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone, isApproved: user.isApproved };
    return res.status(201).json({
      success: true,
      data: { user: userObj, token: null, message: 'Your trainer account has been created and is pending admin approval.' },
    });
  }

  const token = generateToken(user);
  setCookie(res, token);

  sendWelcomeEmail(user.email, user.name).catch(() => {});

  const userObj = { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone };

  res.status(201).json({
    success: true,
    data: { user: userObj, token },
  });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (user.role === 'trainer' && !user.isApproved) {
    return res.status(403).json({ success: false, message: 'Your trainer account is pending admin approval. Please try again later.' });
  }

  const token = generateToken(user);
  setCookie(res, token);

  const userObj = { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone };

  res.json({
    success: true,
    data: { user: userObj, token },
  });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id).populate('trainer');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: user });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const { name, phone, avatar } = parsed.data;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { name, phone, avatar },
    { new: true, runValidators: true }
  );
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: user });
};

export const logout = async (_req: Request, res: Response) => {
  res.cookie('token', 'none', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out successfully' });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  await PasswordResetToken.create({
    email: user.email,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  const resetLink = `${config.clientUrl}/reset-password/${resetToken}`;
  sendPasswordResetEmail(user.email, user.name, resetLink).catch(() => {});

  res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const hashedToken = crypto.createHash('sha256').update(String(token)).digest('hex');

  const resetTokenDoc = await PasswordResetToken.findOne({
    token: hashedToken,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!resetTokenDoc) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
  }

  const user = await User.findOne({ email: resetTokenDoc.email });
  if (!user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }

  user.password = password;
  await user.save();

  resetTokenDoc.used = true;
  await resetTokenDoc.save();

  res.json({ success: true, message: 'Password has been reset successfully' });
};
