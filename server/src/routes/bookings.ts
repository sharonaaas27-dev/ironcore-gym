import { Router } from 'express';
import { getBookings, getMyBookings, getTrainerSessions, createBooking, getBooking, updateBooking, deleteBooking } from '../controllers/bookingController';
import { protect, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', protect, authorize('admin'), asyncHandler(getBookings));
router.get('/my', protect, asyncHandler(getMyBookings));
router.get('/trainer-sessions', protect, authorize('trainer', 'admin'), asyncHandler(getTrainerSessions));
router.post('/', protect, asyncHandler(createBooking));
router.get('/:id', protect, asyncHandler(getBooking));
router.put('/:id', protect, asyncHandler(updateBooking));
router.delete('/:id', protect, asyncHandler(deleteBooking));

export default router;
