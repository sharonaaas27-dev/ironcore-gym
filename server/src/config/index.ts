import dotenv from 'dotenv';
dotenv.config();

function validateEnv() {
  const required = [
    { key: 'MONGODB_URI', name: 'MONGODB_URI' },
  ];
  const missing = required.filter((r) => !process.env[r.key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.map((m) => m.name).join(', ')}`);
    console.error('Please set them in your .env file or environment.');
    process.exit(1);
  }
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 16) {
    console.warn('[WARN] JWT_SECRET is weak — use a longer key (32+ chars) in production.');
  }
  if (!process.env.JWT_SECRET) {
    console.warn('[WARN] JWT_SECRET not set — using dev fallback. Set a strong secret in production.');
  }
}

validateEnv();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ironcore-gym',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production-123',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtCookieExpiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7', 10),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  emailFrom: process.env.EMAIL_FROM || 'noreply@ironcore-gym.com',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
};
