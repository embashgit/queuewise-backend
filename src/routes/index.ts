// src/routes/index.ts

import { Router } from 'express';
import queueRoutes from './queueRoutes';
import notificationRoutes from './notificationRoutes';
import userRoutes from './userRoutes'
const router = Router();

// Combine all routes
router.use(queueRoutes);
router.use(notificationRoutes);
router.use(userRoutes);

export default router;
