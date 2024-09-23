import { Router } from 'express';
import { signup, login, updateUserProfile } from '../controllers/userController';
import { authenticateJWT } from '@src/middleware/authMiddleware'; 

const router = Router();

// POST /api/signup - Register a new user
router.post('/signup', signup);

// POST /api/login - Login an existing user
router.post('/login', login);

router.put('/profile', authenticateJWT, updateUserProfile);

export default router;
