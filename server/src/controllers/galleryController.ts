import { Request, Response } from 'express';
import Gallery from '../models/Gallery';
import { createGallerySchema } from '../validation/gallery';
import { uploadImage } from '../services/cloudinaryService';
import { getPaginationParams, buildPaginationResponse } from '../utils/helpers';

export const getGallery = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 30;
  const { skip } = getPaginationParams(page, limit);
  const total = await Gallery.countDocuments();
  const items = await Gallery.find().sort('-createdAt').skip(skip).limit(limit);
  res.json({ success: true, count: items.length, data: items, pagination: buildPaginationResponse(total, page, limit) });
};

export const createGalleryItem = async (req: Request, res: Response) => {
  const parsed = createGallerySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const file = (req as any).file as Express.Multer.File | undefined;
  if (file) {
    const result = await uploadImage(file.path, 'ash2-fitness/gallery');
    parsed.data.image = result.url;
  }

  const item = await Gallery.create(parsed.data);
  res.status(201).json({ success: true, data: item });
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, message: 'Item deleted' });
};
