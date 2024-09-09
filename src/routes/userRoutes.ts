import { Router } from 'express';
import { signup, login } from '../controllers/userController';

const router = Router();

// POST /api/signup - Register a new user
router.post('/signup', signup);

// POST /api/login - Login an existing user
router.post('/login', login);

export default router;
