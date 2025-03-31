import express from 'express';
import { protect } from '../middleware/auth.js';
import { getSignature } from '../controllers/cloudinaryController.js';

const router = express.Router();

router.get('/signature', protect, getSignature);

export default router;
