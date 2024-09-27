import { Router } from 'express';

import { getAllQueues, createQueue,updateQueue,callNextUser, getQueueWithUserDetails,joinQueue, deleteQueue, getJoinedQueues, leaveQueue, removeFromAttendace, getQueueEvents } from '../controllers/queueController';
import { authenticateJWT } from '@src/middleware/authMiddleware'; 
import { isAdmin } from '@src/middleware/adminMiddleware';
const router = Router();

// GET all queues
router.get('/queues',authenticateJWT, getAllQueues);

// POST a new queue
router.post('/queues',authenticateJWT, isAdmin, createQueue);

router.get('/queues/joined',authenticateJWT, getJoinedQueues);

// DELETE /queues/:queueId - Admins only
router.delete('/queues/:queueId', authenticateJWT, isAdmin, deleteQueue);

// DELETE /queues/:queueId - Admins only
router.get('/queues/:queueId/events', authenticateJWT, isAdmin, getQueueEvents);

//  Leave Queues/:queueId - Admins only
router.delete('/queues/:queueId/leave', authenticateJWT, leaveQueue);

// Joining queue
router.post('/queues/:queueId/join',authenticateJWT, joinQueue);

router.put('/queues/:queueId/call-next',authenticateJWT, isAdmin, callNextUser); //Only for admin

router.delete('/queues/:queueId/complete',authenticateJWT, isAdmin, removeFromAttendace); //Only for admin


// PUT /queues/:queueId - Update an existing queue (authentication required, admin optional)
router.put('/queues/:queueId', authenticateJWT, isAdmin, updateQueue);

// GET specific queue and all users in the queue
router.get('/queues/:queueId/users', authenticateJWT, getQueueWithUserDetails);


export default router;
