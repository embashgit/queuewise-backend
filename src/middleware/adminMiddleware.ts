import { Request, Response, NextFunction } from 'express';

// Middleware to ensure the user is an admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;  // Assuming `req.user` is set by JWT authentication middleware
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  next();  // If the user is an admin, proceed
};
