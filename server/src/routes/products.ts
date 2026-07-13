import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import Product from '../models/Product';
import { createProductSchema, updateProductSchema } from '../validation/product';
import { upload } from '../middleware/upload';
import { uploadImage } from '../services/cloudinaryService';
import { asyncHandler } from '../middleware/asyncHandler';
import { slugify } from '../utils/helpers';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured) filter.featured = req.query.featured === 'true';
    const products = await Product.find(filter).sort('-createdAt');
    res.json({ success: true, count: products.length, data: products });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
}));

router.get('/:id', asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
}));

router.post('/', protect, authorize('admin'), upload.array('images', 5), asyncHandler(async (req, res) => {
  try {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    }

    // Upload images to Cloudinary if files were provided
    const files = (req as any).files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      const uploadedUrls = await Promise.all(
        files.map((file) => uploadImage(file.path, 'ironcore-gym/products').then((r) => r.url))
      );
      parsed.data.images = uploadedUrls;
    }

    let slug = slugify(parsed.data.name);
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      let counter = 1;
      while (await Product.findOne({ slug: `${slug}-${counter}` })) {
        counter++;
      }
      slug = `${slug}-${counter}`;
    }
    const product = await Product.create({ ...parsed.data, slug });
    res.status(201).json({ success: true, data: product });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
}));

router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  try {
    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
}));

router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
}));

export default router;
