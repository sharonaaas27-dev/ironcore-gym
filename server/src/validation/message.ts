import { z } from 'zod';

export const sendMessageSchema = z.object({
  receiverId: z.string().min(1),
  body: z.string().min(1).max(5000),
});
