import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

export const errorHandler = (
  err: AppError | any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(`[ERROR] ${err.message || 'Unknown error'}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const details = err.details || undefined;

  if (details?._errors && Array.isArray(details._errors) && details._errors.length === 0) {
    delete details._errors; // remove empty _errors array
  }

  res.status(statusCode).json({ message, details });
};

export const createError = (message: string, statusCode: number = 500, details?: any) => {
  return { message, statusCode, details };
};
