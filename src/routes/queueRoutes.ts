import { Router } from 'express';

import { getAllQueues, createQueue, getQueueWithUserDetails } from '../controllers/queueController';
import {authenticateJWT} from '../../authMiddleware';
const router = Router();

// GET all queues
router.get('/queues', getAllQueues);

// POST a new queue
router.post('/queues', createQueue);

// GET specific queue and all users in the queue
router.get('/queues/:queueId/users', authenticateJWT, getQueueWithUserDetails);


export default router;
