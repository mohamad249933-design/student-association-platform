/**
 * Validators Utility
 * أدوات التحقق من البيانات - منصة الرباطاب
 */

import { z } from 'zod';

// نماذج التحقق من البيانات
export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phoneNumber: z.string().optional(),
  studentId: z.string().optional(),
  major: z.string().optional()
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  major: z.string().optional()
});

export const createPostSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty'),
  images: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'private', 'friends']).default('public')
});

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
  postId: z.string().uuid('Invalid post ID')
});

export const createGroupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters'),
  description: z.string().optional(),
  category: z.string(),
  image: z.string().url().optional(),
  isPrivate: z.boolean().default(false)
});

export const createAcademicResourceSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  category: z.enum(['notes', 'past_exams', 'books', 'videos']),
  courseId: z.string().uuid('Invalid course ID'),
  fileUrl: z.string().url('Invalid file URL')
});

export const createDonationSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  method: z.enum(['card', 'bank_transfer', 'cash']),
  notes: z.string().optional(),
  isAnonymous: z.boolean().default(false)
});

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string(),
  startDate: z.string().datetime('Invalid date format'),
  endDate: z.string().datetime('Invalid date format'),
  location: z.string(),
  capacity: z.number().int().positive().optional(),
  isOnline: z.boolean().default(false),
  imageUrl: z.string().url().optional()
});

// دالة التحقق العام
export function validateData<T>(schema: z.ZodSchema, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      throw new Error(messages.join(', '));
    }
    throw error;
  }
}

// دوال التحقق من الصيغ الشائعة
export const validators = {
  isValidEmail: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  isValidPhoneNumber: (phone: string): boolean => {
    const regex = /^\+?[\d\s\-()]{10,}$/;
    return regex.test(phone);
  },

  isValidPassword: (password: string): boolean => {
    // يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  },

  isValidUUID: (uuid: string): boolean => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  },

  isValidURL: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidImageFile: (filename: string): boolean => {
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext ? validExtensions.includes(ext) : false;
  },

  isValidVideoFile: (filename: string): boolean => {
    const validExtensions = ['mp4', 'avi', 'mkv', 'mov', 'webm'];
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext ? validExtensions.includes(ext) : false;
  }
};

export default validators;