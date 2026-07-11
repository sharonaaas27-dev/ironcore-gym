import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { asyncHandler } from '../middleware/asyncHandler';
import { requestTrainer, getReceivedRequests, getMyClients, approveRequest, rejectRequest } from '../controllers/trainerRequestController';
import { getMyTrainerProfile, updateMyTrainerProfile } from '../controllers/trainerController';

const router = Router();

router.post('/request', protect, asyncHandler(requestTrainer));
router.get('/requests', protect, authorize('trainer', 'admin'), asyncHandler(getReceivedRequests));
router.get('/clients', protect, authorize('trainer', 'admin'), asyncHandler(getMyClients));
router.put('/requests/:id/approve', protect, authorize('trainer', 'admin'), asyncHandler(approveRequest));
router.put('/requests/:id/reject', protect, authorize('trainer', 'admin'), asyncHandler(rejectRequest));
router.get('/profile', protect, authorize('trainer'), asyncHandler(getMyTrainerProfile));
router.put('/profile', protect, authorize('trainer'), upload.single('avatar'), asyncHandler(updateMyTrainerProfile));

export default router;
