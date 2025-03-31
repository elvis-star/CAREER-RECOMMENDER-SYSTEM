import express from 'express';
import {
  getInstitutions,
  getInstitution,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  addProgram,
  updateProgram,
  deleteProgram,
  getInstitutionsByLocation,
  getInstitutionsByProgram,
} from '../controllers/institutionController.js';
import { protect, authorize } from '../controllers/authController.js';
import { uploadMiddleware } from '../utils/fileUpload.js';

const router = express.Router();

// Public routes
router.get('/', getInstitutions);
router.get('/location/:city', getInstitutionsByLocation);
router.get('/programs/:program', getInstitutionsByProgram);
router.get('/:id', getInstitution);

// Protected routes for admins
router.use(protect);
router.use(authorize('admin'));

// File upload middleware for institution routes
const institutionUpload = uploadMiddleware.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

router.route('/').post(institutionUpload, createInstitution);

router
  .route('/:id')
  .put(institutionUpload, updateInstitution)
  .delete(deleteInstitution);

router.post('/:id/programs', addProgram);
router.put('/:id/programs/:programId', updateProgram);
router.delete('/:id/programs/:programId', deleteProgram);

export default router;
