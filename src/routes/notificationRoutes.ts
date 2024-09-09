import { Router } from 'express';
import { createNotification, getUserNotifications } from '../controllers/notificationController';

const router = Router();

// POST: Create a new notification
router.post('/notifications', createNotification);

// GET: Get all notifications for a user
router.get('/users/:userId/notifications', getUserNotifications);

export default router;
