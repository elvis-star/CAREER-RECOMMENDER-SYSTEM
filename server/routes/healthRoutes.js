import express from 'express';
import { getSystemHealth, getSystemMetrics } from '../utils/systemHealth.js';
import { protect, authorize } from '../controllers/authController.js';

const router = express.Router();

// Public basic health check
router.get('/health', async (req, res) => {
  try {
    // Simple check if server is running
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

// Protected detailed health check for admins
router.get(
  '/health/detailed',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const healthData = await getSystemHealth();
      res.status(200).json(healthData);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Could not retrieve system health information',
        error: error.message,
      });
    }
  }
);

// System metrics for admins
router.get('/metrics', protect, authorize('admin'), async (req, res) => {
  try {
    const metrics = getSystemMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Could not retrieve system metrics',
      error: error.message,
    });
  }
});

export default router;
