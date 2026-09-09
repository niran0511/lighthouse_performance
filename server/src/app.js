import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { config } from './config/env.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { authRouter } from './routes/auth-routes.js';
import { createScanRouter } from './routes/scan-routes.js';

export function createApp(dependencies = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || config.clientOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS origin is not allowed.'));
    },
  }));
  app.use(express.json({ limit: '25kb' }));
  app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));
  app.use('/api/auth', authRouter);
  app.use('/api/scans', createScanRouter(dependencies));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

