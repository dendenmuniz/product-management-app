import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { createError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface DecodedToken {
  id: string;
  email: string;
  role: Role | string;
}


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(createError('Unauthorized - Missing or malformed token', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const normalizedRole = decoded.role.toLowerCase();

    if (normalizedRole !== 'admin' && normalizedRole !== 'seller') {
      return next(createError('Unauthorized - Invalid role in token', 403));
    }

    req.user = {
      id: decoded.id,
      role: normalizedRole as Role, // safely cast to Prisma's enum
    };

    next();
  } catch (error) {
    return next(createError('Unauthorized - Invalid token', 401));
  }
};
