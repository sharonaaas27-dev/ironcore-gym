import { Router } from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost, uploadBlogImage } from '../controllers/blogController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getPosts));
router.get('/:slug', asyncHandler(getPost));
router.post('/', protect, authorize('admin'), upload.single('image'), asyncHandler(createPost));
router.put('/:id', protect, authorize('admin'), asyncHandler(updatePost));
router.delete('/:id', protect, authorize('admin'), asyncHandler(deletePost));
router.post('/upload', protect, authorize('admin'), upload.single('image'), asyncHandler(uploadBlogImage));

export default router;
