import express from 'express';
import {
  generateRecommendations,
  getUserRecommendations,
  getRecommendationHistory,
  getRecommendation,
  updateSavedStatus,
} from '../controllers/recommendationController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

// Public route for generating recommendations
router.post('/', generateRecommendations);

// Protected routes
router.use(protect);
router.get('/', getUserRecommendations);
router.get('/history', getRecommendationHistory);
router.get('/:id', getRecommendation);
router.put('/:id/careers/:careerId', updateSavedStatus);

export default router;
