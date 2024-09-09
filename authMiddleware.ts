import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'queueSecreteAppKey';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;  // Attach the decoded user info to the request object
    next();  // Proceed to the next middleware or controller
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
