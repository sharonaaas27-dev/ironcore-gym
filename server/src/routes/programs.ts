import { Router } from 'express';
import { getPrograms, getProgram, createProgram, updateProgram, deleteProgram, uploadProgramImage, enrollProgram } from '../controllers/programController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getPrograms));
router.get('/:slug', asyncHandler(getProgram));
router.post('/', protect, authorize('admin'), asyncHandler(createProgram));
router.post('/upload', protect, authorize('admin'), upload.single('image'), asyncHandler(uploadProgramImage));
router.post('/:slug/enroll', protect, asyncHandler(enrollProgram));
router.put('/:id', protect, authorize('admin'), asyncHandler(updateProgram));
router.delete('/:id', protect, authorize('admin'), asyncHandler(deleteProgram));

export default router;
