import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import FAQ from '../models/FAQ';
import { createFaqSchema, updateFaqSchema } from '../validation/faq';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  try {
    const faqs = await FAQ.find().sort('order');
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch FAQs' });
  }
}));

router.post('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  try {
    const parsed = createFaqSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    }
    const faq = await FAQ.create(parsed.data);
    res.status(201).json({ success: true, data: faq });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create FAQ' });
  }
}));

router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  try {
    const parsed = updateFaqSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    }
    const faq = await FAQ.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, data: faq });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update FAQ' });
  }
}));

router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete FAQ' });
  }
}));

export default router;
