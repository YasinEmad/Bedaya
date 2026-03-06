import express, { Express, Request, Response } from 'express';
import { env } from './config/environment';
import { corsMiddleware, requestSizeLimit, securityMiddleware, requestLogger } from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import apiRoutes from './routes';
import { ApiResponse } from './utils/response';

export const app: Express = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(securityMiddleware);

// CORS
app.use(corsMiddleware);

// Request Logging
app.use(requestLogger);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request Size Limit
app.use(requestSizeLimit);

// ============================================
// ROUTES
// ============================================

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  ApiResponse.success(res, { status: 'OK' }, 'Server is running');
});

// API Routes
app.use(env.API_PREFIX, apiRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// Not Found Handler
app.use(notFoundHandler);

// Global Error Handler (must be last)
app.use(errorHandler);

export default app;
