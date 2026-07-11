import { Router } from 'express';
import { getMemberships, getMembership, createMembership, updateMembership, deleteMembership } from '../controllers/membershipController';
import { protect, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getMemberships));
router.get('/:id', asyncHandler(getMembership));
router.post('/', protect, authorize('admin'), asyncHandler(createMembership));
router.put('/:id', protect, authorize('admin'), asyncHandler(updateMembership));
router.delete('/:id', protect, authorize('admin'), asyncHandler(deleteMembership));

export default router;
