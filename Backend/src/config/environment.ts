import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  // Server
  NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  PORT: parseInt(process.env.PORT || '5000', 10),

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/bedaya',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'bedaya',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || './logs/app.log',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // API
  API_PREFIX: process.env.API_PREFIX || '/api',
  API_VERSION: process.env.API_VERSION || 'v1',

  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10),
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),

  // Validation
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

export default env;
