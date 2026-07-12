import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import mongoose from 'mongoose';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import membershipRoutes from './routes/memberships';
import bookingRoutes from './routes/bookings';
import programRoutes from './routes/programs';
import trainerRoutes from './routes/trainers';
import galleryRoutes from './routes/gallery';
import blogRoutes from './routes/blog';
import testimonialRoutes from './routes/testimonials';
import faqRoutes from './routes/faq';
import contactRoutes from './routes/contact';
import paymentRoutes, { handleStripeWebhook } from './routes/payments';
import newsletterRoutes from './routes/newsletter';
import productRoutes from './routes/products';
import notificationRoutes from './routes/notifications';
import trainerRequestRoutes from './routes/trainerRequests';
import adminRoutes from './routes/admin';

const app = express();

app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = config.clientUrl.split(',').map((u) => u.trim()).filter(Boolean);
    allowed.push('http://localhost:5173');
    if (!origin || allowed.some((a) => origin.startsWith(a))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(cookieParser());

// Login rate limiter — brute force protection
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

// Auth endpoints — register, google, forgot-password
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, please try again later.' },
});

// Contact form — prevent spam
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many contact submissions. Please try again later.' },
});

// Newsletter — prevent subscription spam
const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many subscription attempts.' },
});

// Uploads — prevent disk fill
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many uploads. Please slow down.' },
});

// Webhooks bypass the global /api rate limiter
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMax,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Apply limiters BEFORE routes so they actually apply
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/google', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth', authRoutes);

app.use('/api/memberships', membershipRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/programs/upload', uploadLimiter);
app.use('/api/programs', programRoutes);
app.use('/api/trainers', trainerRequestRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/gallery', uploadLimiter);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/contact', contactLimiter);
app.use('/api/contact', contactRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/newsletter', newsletterLimiter);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/products', productRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'IRONCORE API is running', timestamp: new Date().toISOString() });
});

app.get('/api/debug-config', (_req, res) => {
  res.json({
    nodeEnv: config.nodeEnv,
    clientUrl: config.clientUrl,
    googleClientId: config.googleClientId,
    googleClientIdLength: config.googleClientId.length,
    adminEmail: config.adminEmail,
    mongoConnected: mongoose.connection.readyState === 1,
    port: config.port,
  });
});

app.use(errorHandler);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export default app;
