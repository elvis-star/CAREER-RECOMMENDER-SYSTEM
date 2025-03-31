import express from 'express';
import {
  getAdminOverview,
  getAdminStats,
  getUserGrowth,
  getCareerPopularity,
  createAdminInvitation,
  acceptAdminInvitation,
  getActivityLogs,
  performBackup,
  getSystemHealthInfo,
  getUserStatsByType,
  getRecommendationStats,
  updateSystemSettings,
} from '../controllers/adminController.js';
import { getAnalyticsData } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/overview', getAdminOverview);
router.get('/stats', getAdminStats);
router.get('/user-growth', getUserGrowth);
router.get('/career-popularity', getCareerPopularity);

// Analytics routes
router.get('/analytics', getAnalyticsData);
router.get('/user-stats', getUserStatsByType);
router.get('/recommendation-stats', getRecommendationStats);

// System routes
router.get('/system-health', getSystemHealthInfo);
router.put('/settings', updateSystemSettings);
router.post('/backup', performBackup);

// Activity logs
router.get('/activity', getActivityLogs);

// Admin invitation
router.post('/invite', createAdminInvitation);
router.post('/accept-invitation/:token', acceptAdminInvitation);

export default router;
