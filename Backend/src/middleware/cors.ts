import { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import { env } from '../config/environment';
import logger from '../config/logger';

/**
 * Request Logger Middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel =
      res.statusCode >= 400 ? 'warn' : 'info';

    logger[logLevel as keyof typeof logger](
      `${req.method} ${req.path}`,
      {
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('user-agent')
      }
    );
  });

  next();
};

/**
 * CORS Configuration
 */
export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: ${origin} is not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  maxAge: 86400 // 24 hours
};

/**
 * CORS Middleware
 */
export const corsMiddleware = cors(corsOptions);

/**
 * Security Middleware
 */
export const securityMiddleware = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"]
    }
  }
});

/**
 * Request Size Limit Middleware
 */
export const requestSizeLimit = (req: Request, res: Response, next: NextFunction) => {
  const maxRequestSize = 10 * 1024 * 1024; // 10MB

  if (req.get('content-length') && parseInt(req.get('content-length')!) > maxRequestSize) {
    return res.status(413).json({
      success: false,
      statusCode: 413,
      message: 'Request entity too large'
    });
  }

  next();
};
