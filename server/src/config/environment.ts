/**
 * Environment Configuration
 * منصة رابطة أبناء أبوحمد - الرباطاب
 */

import dotenv from 'dotenv';
import path from 'path';

// تحميل متغيرات البيئة
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  dialect: 'postgres';
  pool: {
    min: number;
    max: number;
    acquire: number;
    idle: number;
  };
}

interface JWTConfig {
  secret: string;
  refreshSecret: string;
  expiration: string;
  refreshExpiration: string;
  algorithm: string;
}

interface SecurityConfig {
  bcryptRounds: number;
  argon2Time: number;
  argon2Memory: number;
  argon2Parallelism: number;
  maxLoginAttempts: number;
  lockTimeMinutes: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EnvironmentConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  clientUrl: string;
  serverUrl: string;
  apiPrefix: string;
  database: DatabaseConfig;
  jwt: JWTConfig;
  security: SecurityConfig;
  rateLimit: RateLimitConfig;
  cors: {
    origin: string;
    credentials: boolean;
  };
  email: SMTPConfig & {
    from: string;
    fromName: string;
  };
  fileUpload: {
    maxFileSize: number;
    allowedFileTypes: string[];
    uploadPath: string;
    uploadDirTimeoutHours: number;
  };
  encryption: {
    key: string;
    algorithm: string;
    iv: string;
  };
  redis: {
    enabled: boolean;
    host: string;
    port: number;
    password: string;
    db: number;
    ttl: number;
  };
  socket: {
    enabled: boolean;
    corsOrigin: string;
    corsCredentials: boolean;
    pingInterval: number;
    pingTimeout: number;
  };
  logging: {
    level: string;
    dir: string;
    maxSize: string;
    maxFiles: string;
    format: string;
  };
  mfa: {
    enabled: boolean;
    totpWindow: number;
    emailTimeoutMinutes: number;
    smsTimeoutMinutes: number;
    recoveryCodes: number;
  };
  backup: {
    enabled: boolean;
    schedule: string;
    retentionDays: number;
    path: string;
    encrypt: boolean;
  };
  features: {
    social: boolean;
    academic: boolean;
    financial: boolean;
    media: boolean;
    events: boolean;
    mfa: boolean;
    apiDocs: boolean;
  };
  debug: {
    enabled: boolean;
    verboseLogging: boolean;
    debugRequests: boolean;
    debugDatabase: boolean;
  };
}

// دالة التحقق من المتغيرات المطلوبة
const validateRequiredEnvVars = (): void => {
  const required = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'ENCRYPTION_KEY',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME'
  ];

  const missing = required.filter(variable => !process.env[variable]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

// التحقق من المتغيرات
validateRequiredEnvVars();

// إنشاء كائن الإعدادات
const config: EnvironmentConfig = {
  nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  serverUrl: process.env.SERVER_URL || 'http://localhost:5000',
  apiPrefix: process.env.API_PREFIX || '/api/v1',

  // قاعدة البيانات
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'al_raba7ab',
    dialect: 'postgres',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      acquire: 30000,
      idle: 10000
    }
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    expiration: process.env.JWT_EXPIRATION || '1h',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
    algorithm: process.env.JWT_ALGORITHM || 'HS256'
  },

  // الأمان
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    argon2Time: parseInt(process.env.ARGON2_TIME || '3', 10),
    argon2Memory: parseInt(process.env.ARGON2_MEMORY || '65536', 10),
    argon2Parallelism: parseInt(process.env.ARGON2_PARALLELISM || '4', 10),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    lockTimeMinutes: parseInt(process.env.LOCK_TIME_MINUTES || '30', 10)
  },

  // معدل التحديد
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: process.env.CORS_CREDENTIALS === 'true'
  },

  // البريد الإلكتروني
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || ''
    },
    from: process.env.EMAIL_FROM || 'noreply@alraba7ab.com',
    fromName: process.env.EMAIL_FROM_NAME || 'الرباطاب'
  },

  // رفع الملفات
  fileUpload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10),
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || '').split(','),
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    uploadDirTimeoutHours: parseInt(process.env.UPLOAD_DIR_TIMEOUT_HOURS || '24', 10)
  },

  // التشفير
  encryption: {
    key: process.env.ENCRYPTION_KEY!,
    algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc',
    iv: process.env.ENCRYPTION_IV || ''
  },

  // Redis
  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0', 10),
    ttl: parseInt(process.env.REDIS_TTL || '3600', 10)
  },

  // Socket.io
  socket: {
    enabled: process.env.SOCKET_ENABLED === 'true',
    corsOrigin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
    corsCredentials: process.env.SOCKET_CORS_CREDENTIALS === 'true',
    pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL || '25000', 10),
    pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT || '60000', 10)
  },

  // السجلات
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    dir: process.env.LOG_DIR || './logs',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    format: process.env.LOG_FORMAT || 'json'
  },

  // MFA
  mfa: {
    enabled: process.env.MFA_ENABLED === 'true',
    totpWindow: parseInt(process.env.TOTP_WINDOW || '2', 10),
    emailTimeoutMinutes: parseInt(process.env.MFA_EMAIL_TIMEOUT_MINUTES || '15', 10),
    smsTimeoutMinutes: parseInt(process.env.MFA_SMS_TIMEOUT_MINUTES || '10', 10),
    recoveryCodes: parseInt(process.env.MFA_RECOVERY_CODES_COUNT || '10', 10)
  },

  // النسخ الاحتياطية
  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
    path: process.env.BACKUP_PATH || './backups',
    encrypt: process.env.BACKUP_ENCRYPT === 'true'
  },

  // الميزات
  features: {
    social: process.env.FEATURE_SOCIAL_ENABLED !== 'false',
    academic: process.env.FEATURE_ACADEMIC_ENABLED !== 'false',
    financial: process.env.FEATURE_FINANCIAL_ENABLED !== 'false',
    media: process.env.FEATURE_MEDIA_ENABLED !== 'false',
    events: process.env.FEATURE_EVENTS_ENABLED !== 'false',
    mfa: process.env.FEATURE_MFA_ENABLED === 'true',
    apiDocs: process.env.FEATURE_API_DOCS_ENABLED !== 'false'
  },

  // تصحيح الأخطاء
  debug: {
    enabled: process.env.DEBUG === 'true',
    verboseLogging: process.env.VERBOSE_LOGGING === 'true',
    debugRequests: process.env.DEBUG_REQUESTS === 'true',
    debugDatabase: process.env.DEBUG_DATABASE === 'true'
  }
};

// التحقق من الإعدادات في بيئة الإنتاج
if (config.nodeEnv === 'production') {
  if (config.jwt.secret.length < 32 || config.jwt.refreshSecret.length < 32) {
    throw new Error('JWT secrets must be at least 32 characters long in production');
  }
  if (config.encryption.key.length < 32) {
    throw new Error('Encryption key must be at least 32 characters long in production');
  }
}

export default config;