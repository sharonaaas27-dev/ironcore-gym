import { Router } from 'express';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../controllers/galleryController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getGallery));
router.post('/', protect, authorize('admin'), upload.single('image'), asyncHandler(createGalleryItem));
router.delete('/:id', protect, authorize('admin'), asyncHandler(deleteGalleryItem));

export default router;
