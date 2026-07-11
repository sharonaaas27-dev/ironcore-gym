import { z } from 'zod';

export const createProgramSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  longDescription: z.string().min(20).optional().or(z.literal('')),
  category: z.string().min(1),
  image: z.string().min(1),
  video: z.string().optional().or(z.literal('')),
  duration: z.string().min(1),
  intensity: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number().min(0),
  benefits: z.array(z.string()).optional(),
  trainer: z.string().optional().nullable(),
  schedule: z.array(z.object({
    day: z.string(),
    time: z.string(),
    trainer: z.string(),
  })).optional(),
});

export const updateProgramSchema = createProgramSchema.partial();
