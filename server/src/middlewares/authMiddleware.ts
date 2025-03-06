import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized - Token missing or invalid format' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized - Invalid token' });
        return;
    }
};