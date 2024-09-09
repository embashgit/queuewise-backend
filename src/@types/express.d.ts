// src/@types/express.d.ts

import { JwtPayload } from 'jsonwebtoken';  // Import any specific types if needed


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}