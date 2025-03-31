import express from 'express';
import {
  getSessions,
  terminateSession,
  terminateAllSessions,
  createSession,
} from '../controllers/sessionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getSessions)
  .delete(terminateAllSessions)
  .post(createSession);

router.route('/:sessionId').delete(terminateSession);

export default router;
