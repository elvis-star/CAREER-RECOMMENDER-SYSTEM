import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  resendVerificationEmail,
  checkResetToken,
  checkVerificationToken,
  getSession,
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/check-reset-token/:token', checkResetToken);
router.get('/check-verification-token/:token', checkVerificationToken);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.get('/session', getSession);
router.put('/update-password', updatePassword);

export default router;
