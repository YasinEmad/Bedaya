import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique patient code
 */
export const generatePatientCode = (prefix: string = 'P'): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${randomStr}`;
};

/**
 * Generate a unique ID
 */
export const generateUniqueId = (prefix: string = ''): string => {
  const uuid = uuidv4().substring(0, 8).toUpperCase();
  return prefix ? `${prefix}-${uuid}` : uuid;
};

/**
 * Sanitize search query
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Calculate BMI from weight (kg) and height (cm)
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
};

/**
 * Paginate results
 */
export const getPaginationParams = (
  page?: string | number,
  limit?: string | number,
  maxLimit?: number
): { page: number; limit: number; skip: number } => {
  const pageNum = Math.max(1, parseInt(String(page || 1), 10));
  let limitNum = Math.min(
    Math.max(1, parseInt(String(limit || 20), 10)),
    maxLimit || 100
  );

  return {
    page: pageNum,
    limit: limitNum,
    skip: (pageNum - 1) * limitNum
  };
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date?: Date): string => {
  if (!date) return new Date().toISOString().split('T')[0];
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Check if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if phone number is valid
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Truncate string
 */
export const truncateString = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};
