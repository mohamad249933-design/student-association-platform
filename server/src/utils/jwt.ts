/**
 * JWT Utility
 * أداة JWT للمصادقة - منصة الرباطاب
 */

import jwt from 'jsonwebtoken';
import config from '../config/environment';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

class JWTService {
  /**
   * إنشاء Access Token
   */
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiration,
      algorithm: config.jwt.algorithm as jwt.Algorithm
    });
  }

  /**
   * إنشاء Refresh Token
   */
  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiration,
      algorithm: config.jwt.algorithm as jwt.Algorithm
    });
  }

  /**
   * التحقق من Access Token
   */
  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(
        token,
        config.jwt.secret,
        { algorithms: [config.jwt.algorithm as jwt.Algorithm] }
      ) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * التحقق من Refresh Token
   */
  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(
        token,
        config.jwt.refreshSecret,
        { algorithms: [config.jwt.algorithm as jwt.Algorithm] }
      ) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * فك التشفير بدون التحقق
   */
  decode(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * إنشاء tokens (Access + Refresh)
   */
  generateTokenPair(payload: TokenPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      expiresIn: config.jwt.expiration
    };
  }
}

export default new JWTService();