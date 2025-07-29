import express from 'express';
import {
  getCareers,
  getCareer,
  createCareer,
  updateCareer,
  deleteCareer,
  bulkDeleteCareers,
  bulkUpdateFeaturedStatus,
  importCareers,
  duplicateCareer,
  getCareerStatistics,
  getCareerTrends,
  getJobMarketInsights,
  getRelatedCareers,
  addInstitutionToCareer,
  removeInstitutionFromCareer,
  rateCareer,
  viewCareer,
} from '../controllers/careerController.js';
import { authorize, protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes - MUST come first before any middleware that affects all routes
router.get('/', getCareers);
router.get('/statistics', getCareerStatistics);
router.get('/trends', getCareerTrends);
router.get('/job-market', getJobMarketInsights);
router.get('/:id/related', getRelatedCareers);
router.get('/:id', optionalAuth, getCareer); // Optional auth for enhanced data

// User interaction routes (require authentication)
router.post('/:id/rate', protect, rateCareer);
router.post('/:id/view', optionalAuth, viewCareer); // Optional auth - works with or without

// Admin routes - each route individually protected
router.post('/', protect, authorize('admin'), createCareer);
router.put('/:id', protect, authorize('admin'), updateCareer);
router.delete('/:id', protect, authorize('admin'), deleteCareer);
router.post('/bulk-delete', protect, authorize('admin'), bulkDeleteCareers);
router.post(
  '/bulk-update-featured',
  protect,
  authorize('admin'),
  bulkUpdateFeaturedStatus
);
router.post('/import', protect, authorize('admin'), importCareers);
router.post('/:id/duplicate', protect, authorize('admin'), duplicateCareer);
router.post(
  '/:id/institutions',
  protect,
  authorize('admin'),
  addInstitutionToCareer
);
router.delete(
  '/:id/institutions/:institutionId',
  protect,
  authorize('admin'),
  removeInstitutionFromCareer
);

export default router;
