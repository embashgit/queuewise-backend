import { Router } from 'express';

import { getAllQueues, createQueue, getQueueWithUserDetails } from '../controllers/queueController';
import { authenticateJWT } from '@src/middleware/authMiddleware'; 
const router = Router();

// GET all queues
router.get('/queues',authenticateJWT, getAllQueues);

// POST a new queue
router.post('/queues',authenticateJWT, createQueue);

// GET specific queue and all users in the queue
router.get('/queues/:queueId/users', authenticateJWT, getQueueWithUserDetails);


export default router;
