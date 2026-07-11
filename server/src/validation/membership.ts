import { z } from 'zod';

export const createMembershipSchema = z.object({
  type: z.enum(['silver', 'gold', 'platinum']),
  name: z.string().min(2).max(50),
  description: z.string().min(10),
  price: z.number().positive(),
  duration: z.enum(['monthly', 'yearly']).default('monthly'),
  benefits: z.array(z.string()),
  features: z.array(z.object({ name: z.string(), included: z.boolean() })),
  popular: z.boolean().default(false),
});

export const updateMembershipSchema = createMembershipSchema.partial();
