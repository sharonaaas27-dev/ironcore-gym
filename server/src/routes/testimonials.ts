import { Router } from 'express';
import { z } from 'zod';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import Testimonial from '../models/Testimonial';
import { asyncHandler } from '../middleware/asyncHandler';

const createTestimonialSchema = z.object({
  content: z.string().min(1, 'Content is required').max(500, 'Content must be at most 500 characters'),
  rating: z.number().int().min(1).max(5),
  transformation: z.object({ before: z.string().optional(), after: z.string().optional() }).optional(),
});

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  try {
    const testimonials = await Testimonial.find().populate('user', 'name email avatar').sort('-createdAt');
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
}));

router.post('/', protect, asyncHandler(async (req: AuthRequest, res) => {
  try {
    const parsed = createTestimonialSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    }
    const testimonial = await Testimonial.create({ ...parsed.data, user: req.user!._id });
    res.status(201).json({ success: true, data: testimonial });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create testimonial' });
  }
}));

router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete testimonial' });
  }
}));

export default router;
