import { z } from 'zod';

export const createBookingSchema = z.object({
  trainer: z.string().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  time: z.string().regex(/^\d{2}:\d{2}( AM| PM)?$/, 'Invalid time format'),
  type: z.enum(['training', 'class']),
});
