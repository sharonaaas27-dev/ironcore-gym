import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['user', 'trainer']).optional().default('user'),
  bio: z.string().max(1000).optional(),
  specialties: z.array(z.string()).optional(),
  experience: z.number().min(0).max(70).optional(),
  certificates: z.array(z.string()).optional(),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(1, 'Google credential is required'),
  role: z.enum(['user', 'trainer']).optional().default('user'),
  bio: z.string().max(1000).optional(),
  specialties: z.array(z.string()).optional(),
  experience: z.number().min(0).max(70).optional(),
  phone: z.string().optional(),
  certificates: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});
