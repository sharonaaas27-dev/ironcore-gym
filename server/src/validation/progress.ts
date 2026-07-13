import { z } from 'zod';

export const assignProgramSchema = z.object({
  userId: z.string().min(1),
  programId: z.string().min(1),
});

export const advanceStageSchema = z.object({
  stageIndex: z.number().int().min(0),
});
