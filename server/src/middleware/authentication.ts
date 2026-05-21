/**
 * Authentication Middleware
 * مصادقة المستخدم - منصة الرباطاب
 */

import { Request, Response, NextFunction } from 'express';
import jwtService, { TokenPayload } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';

// توسيع كائن Request لإضافة معلومات المستخدم
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      token?: string;
    }
  }
}

/**
 * Middleware للتحقق من التوكن
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // استخراج التوكن من headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);
    req.token = token;

    // التحقق من التوكن
    const decoded = jwtService.verifyAccessToken(token);
    if (!decoded) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Authentication failed');
  }
};

/**
 * Middleware للتحقق من الدور
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new UnauthorizedError('Insufficient permissions');
    }

    next();
  };
};

/**
 * Middleware للتحقق من الصلاحيات
 */
export const checkPermission = (...permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = permissions.some(perm => userPermissions.includes(perm));

    if (!hasPermission) {
      throw new UnauthorizedError('Insufficient permissions');
    }

    next();
  };
};

/**
 * Middleware اختيارية للمصادقة
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwtService.verifyAccessToken(token);
      if (decoded) {
        req.user = decoded;
        req.token = token;
      }
    }
  } catch (error) {
    // تجاهل أخطاء المصادقة في هذه الحالة
  }
  next();
};