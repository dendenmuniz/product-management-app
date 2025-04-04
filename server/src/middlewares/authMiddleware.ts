import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

//extend the Express Request type to include a user property
declare module 'express' {
  interface Request {
    user?: DecodedToken;
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(createError('Unauthorized - Missing or malformed token', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    req.user = {
      ...decoded,
      role: decoded.role.toLowerCase(), //normalize the role
    };

    next();
  } catch (error) {
    return next(createError('Unauthorized - Invalid token', 401));
  }
};
