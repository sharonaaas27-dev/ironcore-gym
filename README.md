# IRONCORE Gym

Premium gym & fitness center web application built with React, TypeScript, Node.js, and MongoDB.

## Tech Stack

**Frontend**: React 19, TypeScript, Vite, TailwindCSS, Framer Motion, GSAP, Three.js, React Three Fiber

**Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), Socket.IO

**Features**: JWT Auth, Stripe Payments, Cloudinary Media, Real-time Notifications, RESTful API

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI, layout, 3D, buttons, cards, forms
│   │   ├── sections/       # Homepage sections (Hero, About, etc.)
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context providers
│   │   ├── services/       # API client
│   │   ├── animations/     # Animation helpers
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global CSS and animations
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, upload, error handling
│   │   ├── services/       # Email, Stripe, Cloudinary
│   │   ├── validation/     # Zod schemas
│   │   └── socket/         # WebSocket setup
│   └── ...
├── docker-compose.yml
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 7+
- npm or yarn

### Installation

```bash
# Install dependencies
cd client && npm install
cd ../server && npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Development

```bash
# Start backend (from server/)
npm run dev

# Start frontend (from client/)
npm run dev
```

### Docker

```bash
docker-compose up -d
```

### Build

```bash
# Build backend
cd server && npm run build

# Build frontend
cd client && npm run build
```
