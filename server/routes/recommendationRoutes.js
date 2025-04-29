import express from 'express';
import {
  generateRecommendations,
  getUserRecommendations,
  getRecommendationHistory,
  getRecommendation,
  updateSavedStatus,
  updateUserRecommendations,
} from '../controllers/recommendationController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Public route for generating recommendations
router.post('/', generateRecommendations);

router.get('/', getUserRecommendations);
router.get('/history', getRecommendationHistory);
router.get('/:id', getRecommendation);
router.put('/:id/careers/:careerId', updateSavedStatus);
router.put('/update/:id', updateUserRecommendations);

export default router;
