import { Router } from 'express';

import { getAllQueues, createQueue,updateQueue,callFirstPersonInQueue, getQueueWithUserDetails,joinQueue, deleteQueue } from '../controllers/queueController';
import { authenticateJWT } from '@src/middleware/authMiddleware'; 
import { isAdmin } from '@src/middleware/adminMiddleware';
const router = Router();

// GET all queues
router.get('/queues',authenticateJWT, getAllQueues);

// POST a new queue
router.post('/queues',authenticateJWT, isAdmin, createQueue);


// DELETE /queues/:queueId - Admins only
router.delete('/queues/:queueId', authenticateJWT, isAdmin, deleteQueue);

// Joining queue
router.post('/queues/:queueId/join',authenticateJWT, joinQueue);

router.delete('/queues/:queueId/call',authenticateJWT, isAdmin, callFirstPersonInQueue); //Only for admin


// PUT /queues/:queueId - Update an existing queue (authentication required, admin optional)
router.put('/queues/:queueId', authenticateJWT, isAdmin, updateQueue);

// GET specific queue and all users in the queue
router.get('/queues/:queueId/users', authenticateJWT, getQueueWithUserDetails);


export default router;
