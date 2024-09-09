import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'queueSecreteAppKey';  // Use a secure JWT secret stored in .env

// Middleware to authenticate JWT tokens
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;  // Get the token from Authorization header

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];  // Extract the token from the "Bearer <token>" format

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded token payload to the request object (this could include user info like id, role, etc.)
    (req as any).user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};
