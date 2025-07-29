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
  updateFeaturedStatus,
  getInstitutionStats,
  bulkDeleteInstitutions,
  bulkUpdateFeatured,
  importInstitutions,
  duplicateInstitution,
} from '../controllers/institutionController.js';
import { uploadMiddleware } from '../utils/fileUpload.js';
import { authorize, protect } from '../middleware/auth.js';

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

// FIXED: Stats route (must be before /:id routes to avoid conflicts)
router.get('/stats', getInstitutionStats);

// Bulk operations
router.post('/bulk-delete', bulkDeleteInstitutions);
router.post('/bulk-update-featured', bulkUpdateFeatured);
router.post('/import', importInstitutions);

// Institution CRUD
router.post('/', institutionUpload, createInstitution);
router.put('/:id', institutionUpload, updateInstitution);
router.delete('/:id', deleteInstitution);

// Program management
router.post('/:id/programs', addProgram);
router.put('/:id/programs/:programId', updateProgram);
router.delete('/:id/programs/:programId', deleteProgram);

// FIXED: Featured status update route (specific endpoint)
router.patch('/:id/featured', updateFeaturedStatus);

// Duplicate institution
router.post('/:id/duplicate', duplicateInstitution);

export default router;
