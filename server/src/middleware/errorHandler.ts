/**
 * Error Handler Middleware
 * معالج الأخطاء - منصة الرباطاب
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import responseHandler from '../utils/response';
import logger from '../utils/logger';
import config from '../config/environment';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // تسجيل الخطأ
  const errorData = {
    method: req.method,
    path: req.path,
    statusCode: err instanceof AppError ? err.statusCode : 500,
    message: err.message,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString()
  };

  if (err instanceof AppError) {
    logger.warn('Application Error:', errorData);
  } else {
    logger.error('Unexpected Error:', { ...errorData, stack: err.stack });
  }

  // معالجة الأخطاء المختلفة
  if (err instanceof AppError) {
    responseHandler.error(res, err.message, err.statusCode);
    return;
  }

  // خطأ غير معروف
  const isDevelopment = config.nodeEnv === 'development';
  const message = isDevelopment ? err.message : 'Internal server error';
  const details = isDevelopment ? { stack: err.stack } : undefined;

  responseHandler.error(res, message, 500);
};

// Middleware للتقاط الأخطاء غير المعالجة
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  logger.warn('Not Found Route', {
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString()
  });

  responseHandler.notFound(res, `Route ${req.path} not found`);
};