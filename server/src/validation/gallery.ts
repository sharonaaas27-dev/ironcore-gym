import { z } from 'zod';

export const createGallerySchema = z.object({
  title: z.string().min(2).max(200),
  image: z.string().min(1, 'Image is required'),
  category: z.string().min(1),
});
