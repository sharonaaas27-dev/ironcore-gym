import { z } from 'zod';

const productBaseSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  images: z.array(z.string()).optional(),
  category: z.string().min(1),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  stock: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
});

export const createProductSchema = productBaseSchema.superRefine((data, ctx) => {
  if (data.salePrice !== undefined && data.salePrice >= data.price) {
    ctx.addIssue({ code: 'custom', path: ['salePrice'], message: 'Sale price must be less than regular price' });
  }
});

export const updateProductSchema = productBaseSchema.partial();
