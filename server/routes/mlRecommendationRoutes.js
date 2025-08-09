import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  generateMLEnhancedRecommendations,
  updateMLEnhancedRecommendations, // Added this line
  getSimilarCareers,
  getCareerTrends,
  getMLSystemHealth,
} from '../controllers/mlEnhancedRecommendationController.js';

const router = express.Router();

// ML-enhanced recommendations
router.post('/ml-enhanced', protect, generateMLEnhancedRecommendations);
router.put('/ml-enhanced/:id', protect, updateMLEnhancedRecommendations); // Added this route

// Get similar careers
router.get('/similar/:careerId', getSimilarCareers);

// Get career trends
router.get('/trends', getCareerTrends);

// ML system health check
router.get('/ml-health', getMLSystemHealth);

export default router;
