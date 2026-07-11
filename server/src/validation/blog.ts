import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(5).max(200),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(50),
  image: z.string().min(1, 'Image is required'),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  readTime: z.number().int().positive().optional(),
  publishedAt: z.string().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();
