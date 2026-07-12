import crypto from 'crypto';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import TrainerApplication from '../models/TrainerApplication';
import { config } from '../config';
import { googleAuthSchema } from '../validation/auth';

const googleClient = new OAuth2Client(config.googleClientId);

const setCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'strict',
    maxAge: config.jwtCookieExpiresIn * 24 * 60 * 60 * 1000,
  });
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const parsed = googleAuthSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    }

    const { credential, role, bio, specialties, experience, phone, certificates } = parsed.data;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, message: 'Invalid Google token' });
    }

    const { email, name, picture } = payload;

    // Admin check — if email matches configured admin email, force admin role
    const isAdminEmail = config.adminEmail && email.toLowerCase() === config.adminEmail.toLowerCase();
    if (isAdminEmail) {
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          password: crypto.randomUUID(),
          avatar: picture,
          role: 'admin',
          isApproved: true,
        });
      } else if (user.role !== 'admin') {
        user.role = 'admin';
        user.isApproved = true;
        await user.save();
      }
      const token = user.generateAuthToken();
      setCookie(res, token);
      return res.json({
        success: true,
        data: {
          user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone },
          token,
        },
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      // Existing user — check approval for trainers
      if (user.role === 'trainer' && !user.isApproved) {
        return res.status(403).json({ success: false, message: 'Your trainer account is pending admin approval. Please try again later.' });
      }
      const token = user.generateAuthToken();
      setCookie(res, token);
      return res.json({
        success: true,
        data: {
          user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone },
          token,
        },
      });
    }

    // New user
    if (role === 'trainer') {
      // Trainer application — require profile fields
      if (!bio || !specialties || specialties.length === 0 || experience === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Trainer profile details are required: bio, specialties, and experience.',
        });
      }

      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: crypto.randomUUID(),
        avatar: picture,
        role: 'trainer',
        isApproved: false,
        phone,
      });

      await TrainerApplication.create({
        user: user._id,
        bio,
        specialties,
        experience,
        phone,
        certificates: certificates || [],
      });

      return res.status(201).json({
        success: true,
        data: {
          user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone, isApproved: user.isApproved },
          token: null,
          message: 'Your trainer account has been created and is pending admin approval.',
        },
      });
    }

    // Regular user
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      password: crypto.randomUUID(),
      avatar: picture,
      role: 'user',
      isApproved: true,
    });

    const token = user.generateAuthToken();
    setCookie(res, token);

    res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone },
        token,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};
