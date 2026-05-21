/**
 * Response Helper
 * مساعد الاستجابة - منصة الرباطاب
 */

import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp: string;
}

class ResponseHandler {
  /**
   * استجابة النجاح
   */
  success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString()
    } as ApiResponse<T>);
  }

  /**
   * استجابة النجاح مع الترقيم
   */
  successWithPagination<T>(
    res: Response,
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
    },
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const pages = Math.ceil(pagination.total / pagination.limit);
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages
      },
      timestamp: new Date().toISOString()
    } as ApiResponse<T[]>);
  }

  /**
   * استجابة الخطأ
   */
  error(
    res: Response,
    message: string = 'Error',
    statusCode: number = 500,
    errors?: Array<{ field: string; message: string }>
  ): Response {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString()
    } as ApiResponse);
  }

  /**
   * استجابة الخطأ 400
   */
  badRequest(
    res: Response,
    message: string = 'Bad request',
    errors?: Array<{ field: string; message: string }>
  ): Response {
    return this.error(res, message, 400, errors);
  }

  /**
   * استجابة الخطأ 401
   */
  unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 401);
  }

  /**
   * استجابة الخطأ 403
   */
  forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }

  /**
   * استجابة الخطأ 404
   */
  notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }

  /**
   * استجابة الخطأ 409
   */
  conflict(res: Response, message: string = 'Conflict'): Response {
    return this.error(res, message, 409);
  }

  /**
   * استجابة الخطأ 429
   */
  tooManyRequests(res: Response, message: string = 'Too many requests'): Response {
    return this.error(res, message, 429);
  }

  /**
   * استجابة الخطأ 500
   */
  internalServerError(res: Response, message: string = 'Internal server error'): Response {
    return this.error(res, message, 500);
  }
}

export default new ResponseHandler();