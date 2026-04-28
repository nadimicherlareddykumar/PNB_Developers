import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

import pool, { query, ready } from './db/database.js';
import logger from './utils/logger.js';
import authRoutes from './routes/auth.js';
import layoutRoutes from './routes/layouts.js';
import plotRoutes from './routes/plots.js';
import bookingRoutes from './routes/bookings.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('HTTP request', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip
    });
  });
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed'));
  },
  credentials: true,
  exposedHeaders: ['x-csrf-token']
}));

app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '100kb' }));


const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
});
app.use((req, res, next) => {
  const exemptPaths = ['/api/auth/login', '/api/auth/signup', '/api/health', '/api/live'];
  if (exemptPaths.includes(req.path)) {
    return next();
  }
  return csrfProtection(req, res, next);
});
app.use((req, res, next) => {
  if (req.method === 'GET' && typeof req.csrfToken === 'function') {
    res.set('x-csrf-token', req.csrfToken());
  }
  next();
});

app.use((req, res, next) => {
  const isSecure = req.secure || req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https';
  if (process.env.NODE_ENV === 'production' && !isSecure) {
    return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  }
  return next();
});


const parsePositiveIntOrDefault = (value, fallback) => {
  const parsed = parseInt(value ?? '', 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const environment = process.env.NODE_ENV || 'development';
const rateLimitWindowMinutes = parsePositiveIntOrDefault(process.env.RATE_LIMIT_WINDOW_MINUTES, 15);
const defaultAuthMax = environment === 'production' ? 8 : environment === 'staging' ? 20 : 100;
const defaultApiMax = environment === 'production' ? 200 : environment === 'staging' ? 500 : 1000;

const authLimiter = rateLimit({
  windowMs: rateLimitWindowMinutes * 60 * 1000,
  max: parsePositiveIntOrDefault(process.env.RATE_LIMIT_AUTH_MAX, defaultAuthMax),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Try again later.' }
});
const apiLimiter = rateLimit({
  windowMs: rateLimitWindowMinutes * 60 * 1000,
  max: parsePositiveIntOrDefault(process.env.RATE_LIMIT_API_MAX, defaultApiMax),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again later.' }
});


app.get('/api/live', (req, res) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});
app.use('/api/auth', authRoutes);
app.use('/api/layouts', layoutRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/bookings', bookingRoutes);

const readinessHandler = async (req, res, next) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) throw new Error('Database not connected');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
};

app.get('/api/health', readinessHandler);
app.get('/api/ready', readinessHandler);

app.use((error, req, res, next) => {
  if (error.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  return next(error);
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

pool.on('connect', () => {
  logger.info('Database pool connected');
});

if (process.env.NODE_ENV !== 'production') {
  ready.then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  });
}

export default app;
