import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  membershipId: z.string().min(1, 'Membership ID is required'),
  duration: z.enum(['monthly', 'yearly']).default('monthly'),
});
