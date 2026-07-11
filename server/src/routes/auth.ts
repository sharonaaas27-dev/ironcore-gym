import { Router } from 'express';
import { register, login, getMe, updateProfile, logout, forgotPassword, resetPassword } from '../controllers/authController';
import { googleLogin } from '../controllers/googleAuthController';
import { protect } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/google', asyncHandler(googleLogin));
router.get('/me', protect, asyncHandler(getMe));
router.put('/update-profile', protect, asyncHandler(updateProfile));
router.post('/logout', asyncHandler(logout));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password/:token', asyncHandler(resetPassword));

export default router;
