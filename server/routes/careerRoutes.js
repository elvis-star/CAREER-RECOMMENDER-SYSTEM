import express from 'express';
import {
  getCareers,
  getCareer,
  createCareer,
  updateCareer,
  deleteCareer,
  getCareerStatistics,
  getCareerTrends,
  getJobMarketInsights,
  getRelatedCareers,
  addInstitutionToCareer,
  removeInstitutionFromCareer,
} from '../controllers/careerController.js';
import { protect, authorize } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.get('/', getCareers);
router.get('/statistics', getCareerStatistics);
router.get('/trends', getCareerTrends);
router.get('/job-market', getJobMarketInsights);
router.get('/:id', getCareer);
router.get('/:id/related', getRelatedCareers);

// Protected routes for admins
router.use(protect);
router.use(authorize('admin'));

router.route('/').post(createCareer);

router.route('/:id').put(updateCareer).delete(deleteCareer);

router.post('/:id/institutions', addInstitutionToCareer);
router.delete('/:id/institutions/:institutionId', removeInstitutionFromCareer);

export default router;
