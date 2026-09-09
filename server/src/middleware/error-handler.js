import mongoose from 'mongoose';
import { AppError } from '../utils/app-error.js';
import { config } from '../config/env.js';

export function notFound(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} was not found.`, 404, 'ROUTE_NOT_FOUND'));
}

export function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  let normalized = error;
  if (error instanceof mongoose.Error.CastError) normalized = new AppError('The requested resource identifier is invalid.', 400, 'INVALID_ID');
  if (error?.code === 11000) normalized = new AppError('An account with this email already exists.', 409, 'DUPLICATE_RESOURCE');
  const statusCode = normalized instanceof AppError ? normalized.statusCode : 500;
  const message = normalized instanceof AppError || config.env !== 'production'
    ? normalized.message
    : 'Something went wrong. Please try again.';
  res.status(statusCode).json({ success: false, message, errorCode: normalized.errorCode || 'INTERNAL_ERROR' });
}

