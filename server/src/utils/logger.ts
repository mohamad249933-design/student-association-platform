/**
 * Logger Utility
 * نظام السجلات - منصة الرباطاب
 */

import winston from 'winston';
import path from 'path';
import config from '../config/environment';

// إنشاء مجلد السجلات إذا لم يكن موجوداً
import fs from 'fs';
if (!fs.existsSync(config.logging.dir)) {
  fs.mkdirSync(config.logging.dir, { recursive: true });
}

// تحديد مستويات السجلات
const logLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    trace: 'gray'
  }
};

// تنسيق السجلات
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  config.logging.format === 'json'
    ? winston.format.json()
    : winston.format.printf(({ level, message, timestamp, ...meta }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
      })
);

// إنشاء transports
const transports: winston.transport[] = [
  // Console transport (في بيئة التطوير)
  ...(config.nodeEnv === 'development'
    ? [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            logFormat
          )
        })
      ]
    : []),

  // Error file transport
  new winston.transports.File({
    filename: path.join(config.logging.dir, 'error.log'),
    level: 'error',
    format: logFormat,
    maxsize: parseInt(config.logging.maxSize) * 1024 * 1024,
    maxFiles: parseInt(config.logging.maxFiles)
  }),

  // Combined file transport
  new winston.transports.File({
    filename: path.join(config.logging.dir, 'combined.log'),
    format: logFormat,
    maxsize: parseInt(config.logging.maxSize) * 1024 * 1024,
    maxFiles: parseInt(config.logging.maxFiles)
  })
];

// إنشاء Logger
const logger = winston.createLogger({
  levels: logLevels.levels,
  format: logFormat,
  transports,
  exitOnError: false
});

winston.addColors(logLevels.colors);

export default logger;