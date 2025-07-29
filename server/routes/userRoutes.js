import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  getUserActivity,
  updatePreferences,
  saveCareer,
  removeSavedCareer,
  getSavedCareers,
  saveKcseResults,
  getKcseResults,
  // New functions we'll add
  pinCareer,
  unpinCareer,
  getPinnedCareers,
  getUserProfile,
} from '../controllers/userController.js';
import { protect, authorize } from '../controllers/authController.js';
import { uploadMiddleware } from '../utils/fileUpload.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', uploadMiddleware.single('avatar'), updateProfile);
router.get('/activity', getUserActivity);
router.put('/preferences', updatePreferences);
router.post('/saved-careers/:careerId', saveCareer);
router.delete('/saved-careers/:careerId', removeSavedCareer);
router.get('/saved-careers', getSavedCareers);

// New pinned careers routes
router.post('/pinned-careers/:careerId', pinCareer);
router.delete('/pinned-careers/:careerId', unpinCareer);
router.get('/pinned-careers', getPinnedCareers);

router.post('/kcse-results', saveKcseResults);
router.get('/kcse-results', getKcseResults);

router.get('/:id', protect, getUser);

// Admin only routes
router.use(authorize('admin'));
router.route('/').get(getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export default router;
