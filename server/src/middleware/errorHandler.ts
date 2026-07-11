import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function badRequest(message: string) {
  return new AppError(message, 400);
}

export function unauthorized(message = 'Not authorized') {
  return new AppError(message, 401);
}

export function forbidden(message = 'Forbidden') {
  return new AppError(message, 403);
}

export function notFound(message = 'Resource not found') {
  return new AppError(message, 404);
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource identifier',
    });
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate resource already exists',
    });
  }

  // JWT errors
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
