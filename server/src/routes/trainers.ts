import { Router } from 'express';
import { getTrainers, getTrainer, createTrainer, updateTrainer, deleteTrainer } from '../controllers/trainerController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getTrainers));
router.get('/:id', asyncHandler(getTrainer));
router.post('/', protect, authorize('admin'), upload.single('avatar'), asyncHandler(createTrainer));
router.put('/:id', protect, authorize('admin'), asyncHandler(updateTrainer));
router.delete('/:id', protect, authorize('admin'), asyncHandler(deleteTrainer));

export default router;
