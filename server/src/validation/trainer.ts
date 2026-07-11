import { z } from 'zod';

export const createTrainerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().min(10),
  specialties: z.array(z.string()).optional(),
  experience: z.number().int().positive(),
  certificates: z.array(z.string()).optional(),
  socialLinks: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
  rating: z.number().min(0).max(5).optional(),
  available: z.boolean().optional(),
  userId: z.string().optional(),
});

export const updateTrainerSchema = createTrainerSchema.partial();
