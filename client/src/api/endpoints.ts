export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    UPDATE_PROFILE: '/auth/update-profile',
  },
  MEMBERSHIPS: {
    ALL: '/memberships',
    DETAIL: (id: string) => `/memberships/${id}`,
    CHECKOUT: '/memberships/checkout',
  },
  BOOKINGS: {
    ALL: '/bookings',
    CREATE: '/bookings',
    MY: '/bookings/my',
    DETAIL: (id: string) => `/bookings/${id}`,
    TRAINER_SESSIONS: '/bookings/trainer-sessions',
  },
  PROGRAMS: {
    ALL: '/programs',
    DETAIL: (slug: string) => `/programs/${slug}`,
    ENROLL: (slug: string) => `/programs/${slug}/enroll`,
  },
  TRAINERS: {
    ALL: '/trainers',
    DETAIL: (id: string) => `/trainers/${id}`,
    BOOK: (id: string) => `/trainers/${id}/book`,
    PROFILE: '/trainers/profile',
    REQUESTS: '/trainers/requests',
    CLIENTS: '/trainers/clients',
    APPROVE_REQUEST: (id: string) => `/trainers/requests/${id}/approve`,
    REJECT_REQUEST: (id: string) => `/trainers/requests/${id}/reject`,
  },
  GALLERY: {
    ALL: '/gallery',
    UPLOAD: '/gallery/upload',
  },
  BLOG: {
    ALL: '/blog',
    DETAIL: (slug: string) => `/blog/${slug}`,
    BY_ID: (id: string) => `/blog/${id}`,
  },
  TESTIMONIALS: {
    ALL: '/testimonials',
    CREATE: '/testimonials',
  },
  FAQ: {
    ALL: '/faq',
  },
  CONTACT: {
    SEND: '/contact',
  },
  PAYMENTS: {
    ALL: '/payments',
    CREATE: '/payments',
    CREATE_PAYMENT_INTENT: '/payments/create-payment-intent',
  },
  NEWSLETTER: {
    SUBSCRIBE: '/newsletter/subscribe',
  },
  SHOP: {
    ALL: '/products',
    DETAIL: (id: string) => `/products/${id}`,
  },
  ADMIN: {
    USERS: '/admin/users',
    USER: (id: string) => `/admin/users/${id}`,
    ANALYTICS: '/admin/analytics',
    MEMBERS: '/admin/members',
    PAYMENTS: '/admin/payments',
    BOOKINGS: '/admin/bookings',
    BOOKING: (id: string) => `/admin/bookings/${id}`,
    TRAINER_REQUESTS: '/admin/trainer-requests',
    APPROVE_TRAINER: (id: string) => `/admin/trainer-requests/${id}/approve`,
    REJECT_TRAINER: (id: string) => `/admin/trainer-requests/${id}/reject`,
    PROGRAM_ENROLLMENTS: '/admin/program-enrollments',
  },
  NOTIFICATIONS: {
    ALL: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
} as const;
