import { Router } from 'express';
import { createNotification, getUserNotifications } from '../controllers/notificationController';
import { authenticateJWT } from '@src/middleware/authMiddleware'; 
const router = Router();

// POST: Create a new notification
router.post('/notifications',authenticateJWT, createNotification);

// GET: Get all notifications for a user
router.get('/users/:userId/notifications',authenticateJWT, getUserNotifications);

export default router;
