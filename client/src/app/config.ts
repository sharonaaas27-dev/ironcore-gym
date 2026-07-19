export const APP_CONFIG = {
  name: 'Ash2 Fitness',
  tagline: 'Train With Purpose',
  description: 'CrossFit & fitness center in Kanjiramkulam, Kerala dedicated to transforming lives through expert training and well-maintained equipment.',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  analyticsId: import.meta.env.VITE_GA_ID || '',
  contact: {
    email: 'info@ash2fitness.com',
    phone: '+91 98461 51551',
    address: 'Thadathilkulam, Kanjiramkulam, Kerala 695524',
  },
  hours: {
    weekday: '5:30 AM - 10:00 PM',
    weekend: 'Closed on Sundays',
  },
  social: {
    instagram: 'https://instagram.com/ash2fitness',
    facebook: 'https://facebook.com/ash2fitness',
    twitter: '',
    youtube: '',
  },
} as const;
