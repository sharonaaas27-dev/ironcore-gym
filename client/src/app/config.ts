export const APP_CONFIG = {
  name: 'IRONCORE',
  tagline: 'Forge Your Iron Body',
  description: 'Premium gym & fitness center dedicated to transforming lives.',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  analyticsId: import.meta.env.VITE_GA_ID || '',
  contact: {
    email: 'info@ironcore-gym.com',
    phone: '+1 (555) 123-4567',
    address: '123 Fitness Blvd, New York, NY 10001',
  },
  hours: {
    weekday: '5:00 AM - 11:00 PM',
    weekend: '7:00 AM - 9:00 PM',
  },
  social: {
    instagram: 'https://instagram.com/ironcore',
    facebook: 'https://facebook.com/ironcore',
    twitter: 'https://twitter.com/ironcore',
    youtube: 'https://youtube.com/@ironcore',
  },
} as const;
