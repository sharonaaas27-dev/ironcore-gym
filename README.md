# Ash2 Fitness - Premium Gym Management System

<div align="center">

![Ash2 Fitness](https://img.shields.io/badge/Ash2-Fitness-ff6b6b?style=for-the-badge)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-5469D4?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)

**Production-grade SaaS platform for fitness centers** | [Live Demo](https://ironcore-gym-smoky.vercel.app)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

**Ash2 Fitness** is a comprehensive gym management SaaS platform that streamlines gym operations, member management, and billing. Built with cutting-edge technologies, it provides real-time notifications, secure payment processing, and a stunning modern UI with 3D animations.

### Why This Project?

✅ **Production-Ready Architecture** - Scalable, maintainable, professional codebase  
✅ **Full Authentication** - JWT-based security with role management  
✅ **Payment Integration** - Stripe for secure transactions  
✅ **Real-time Features** - WebSocket-powered notifications  
✅ **Modern UI** - React 19 with Framer Motion & Three.js  
✅ **Cloud-Ready** - Docker containerization for easy deployment  

---

## ✨ Key Features

### 🔐 **Member Management**
- Member registration & profile management
- Membership plans (Basic, Premium, Elite)
- Auto-renewal with Stripe
- Attendance tracking
- Member dashboard

### 💰 **Billing & Payments**
- Stripe payment processing
- Subscription management
- Invoice generation
- Payment history
- Automated billing cycles

### 📧 **Real-time Notifications**
- Email notifications (SendGrid)
- In-app real-time alerts (Socket.IO)
- Payment confirmations
- Membership expiry alerts
- Class reminders

### 📊 **Admin Dashboard**
- Revenue analytics
- Member statistics
- Class management
- Trainer management
- Payment tracking

### 🏋️ **Class Management**
- Class scheduling
- Trainer assignment
- Capacity management
- Member enrollment
- Attendance tracking

### 🎨 **Premium UI/UX**
- Responsive design (Mobile, Tablet, Desktop)
- 3D animations with Three.js
- Smooth transitions with Framer Motion
- GSAP animations
- Dark/Light theme support

---

## 🛠️ Tech Stack

### **Frontend**
```
React 19 - UI library
TypeScript - Type safety
Vite - Build tool
TailwindCSS - Styling
Framer Motion - Advanced animations
GSAP - Timeline animations
Three.js & React Three Fiber - 3D graphics
Socket.IO Client - Real-time communication
Stripe.js - Payment UI
```

### **Backend**
```
Node.js - Runtime
Express.js - Web framework
TypeScript - Type safety
MongoDB - NoSQL database
Mongoose - ODM
Socket.IO - WebSocket server
JWT - Authentication
Zod - Validation
Cloudinary - Image storage
SendGrid - Email service
Stripe - Payment processing
```

### **DevOps & Deployment**
```
Docker - Containerization
Docker Compose - Multi-container orchestration
GitHub Actions - CI/CD
Vercel - Frontend hosting
Render/Railway - Backend hosting
MongoDB Atlas - Cloud database
```

---

## 🏗️ Architecture

### **System Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    Client (React 19)                    │
│  Components │ Pages │ Hooks │ Context │ Services       │
└──────────────────────┬──────────────────────────────────┘
                       │ (HTTPS/WebSocket)
                       ▼
┌─────────────────────────────────────────────────────────┐
│              API Gateway (Express.js)                   │
│  Routes │ Controllers │ Middleware │ Validation        │
└──────────────────────┬──────────────────────────────────┘
                       │
    ┌──────────────────┼──────────────────┐
    ▼                  ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌──────────────┐
│  MongoDB    │  │ Socket.IO   │  │ External     │
│  Atlas      │  │ Server      │  │ Services     │
│  Database   │  │ (Real-time) │  │ (Stripe...)  │
└─────────────┘  └─────────────┘  └──────────────┘
```

### **Data Flow**

1. **Client Request** → REST API / WebSocket
2. **Express Middleware** → Authentication, Validation, Error Handling
3. **Controllers** → Business Logic
4. **Services** → Database Operations, External APIs
5. **Database** → Data Persistence
6. **Response** → JSON / Real-time Events

---

## 📁 Project Structure

```
gym-management-system/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── ui/                 # Basic elements (Button, Card, etc.)
│   │   │   ├── layout/             # Layout components (Header, Sidebar)
│   │   │   ├── 3d/                 # Three.js 3D components
│   │   │   ├── forms/              # Form components
│   │   │   └── cards/              # Card variations
│   │   ├── sections/               # Page sections (Hero, Features)
│   │   ├── pages/                  # Route pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Members.tsx
│   │   │   ├── Billing.tsx
│   │   │   └── ...
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useMembers.ts
│   │   │   └── useNotifications.ts
│   │   ├── context/                # Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   ├── NotificationContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── services/               # API client
│   │   │   ├── api.ts              # Base API setup
│   │   │   ├── auth.service.ts
│   │   │   ├── member.service.ts
│   │   │   └── ...
│   │   ├── types/                  # TypeScript types
│   │   │   ├── auth.types.ts
│   │   │   ├── member.types.ts
│   │   │   └── ...
│   │   ├── utils/                  # Helper functions
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── storage.ts
│   │   ├── animations/             # Animation helpers
│   │   │   ├── gsapAnimations.ts
│   │   │   └── framerVariants.ts
│   │   ├── styles/                 # Global styles
│   │   │   └── globals.css
│   │   ├── App.tsx                 # Main App component
│   │   └── main.tsx                # Entry point
│   ├── public/                     # Static assets
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── controllers/            # Route handlers
│   │   │   ├── authController.ts
│   │   │   ├── memberController.ts
│   │   │   ├── billingController.ts
│   │   │   └── ...
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Member.ts
│   │   │   ├── Class.ts
│   │   │   ├── Payment.ts
│   │   │   └── ...
│   │   ├── routes/                 # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── member.routes.ts
│   │   │   ├── billing.routes.ts
│   │   │   └── index.ts
│   │   ├── middleware/             # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── errorHandler.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   └── cors.middleware.ts
│   │   ├── services/               # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── member.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── stripe.service.ts
│   │   │   ├── cloudinary.service.ts
│   │   │   └── ...
│   │   ├── validation/             # Zod schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── member.schema.ts
│   │   │   └── ...
│   │   ├── socket/                 # WebSocket setup
│   │   │   └── socketHandler.ts
│   │   ├── utils/                  # Helper functions
│   │   │   ├── logger.ts
│   │   │   ├── errors.ts
│   │   │   └── jwt.ts
│   │   ├── config/                 # Configuration
│   │   │   └── environment.ts
│   │   ├── app.ts                  # Express app setup
│   │   └── index.ts                # Server entry point
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── docker-compose.yml              # Multi-container orchestration
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 18+
- **MongoDB** 7+ (or MongoDB Atlas account)
- **npm** or **yarn**
- **Git**

### **Environment Variables**

Create `.env` files in both `client/` and `server/` directories:

#### `server/.env`
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/gym-db

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Email (SendGrid)
SENDGRID_API_KEY=SG....

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client URL
CLIENT_URL=http://localhost:5173
```

#### `client/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### **Installation**

```bash
# Clone repository
git clone https://github.com/sharonaaas27-dev/Gym-Management-System.git
cd Gym-Management-System

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Return to root
cd ..
```

---

## 💻 Development

### **Start Development Servers**

**Option 1: Separate Terminals**

```bash
# Terminal 1 - Backend
cd server
npm run dev
# Server runs on http://localhost:5000

# Terminal 2 - Frontend
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

**Option 2: Using Docker Compose**

```bash
docker-compose up -d
# Both services run with hot-reload
```

### **Development Tools**

```bash
# Backend
npm run dev       # Development with auto-reload
npm run build     # TypeScript compilation
npm run start     # Run compiled code
npm run lint      # ESLint check

# Frontend
npm run dev       # Development with Vite
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint check
```

---

## 📚 API Documentation

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication Endpoints**

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "role": "member"
}

Response: 201
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "token": "jwt_token"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response: 200
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "token": "jwt_token"
  }
}
```

### **Member Endpoints**

#### Get All Members (Admin)
```http
GET /api/members
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "data": [
    {
      "id": "member_id",
      "name": "John Doe",
      "email": "john@example.com",
      "membershipPlan": "premium",
      "joinDate": "2024-01-15",
      "status": "active"
    }
  ]
}
```

#### Get Member Profile
```http
GET /api/members/:id
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "data": { /* member data */ }
}
```

#### Update Member
```http
PATCH /api/members/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+1234567890",
  "address": "123 Main St"
}

Response: 200
{
  "success": true,
  "message": "Member updated successfully",
  "data": { /* updated member */ }
}
```

### **Billing Endpoints**

#### Create Payment
```http
POST /api/billing/create-payment-intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "memberId": "member_id",
  "amount": 9999,
  "currency": "usd"
}

Response: 200
{
  "success": true,
  "data": {
    "clientSecret": "pi_...",
    "paymentIntentId": "pi_..."
  }
}
```

#### Get Billing History
```http
GET /api/billing/history
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "data": [
    {
      "id": "payment_id",
      "amount": 9999,
      "currency": "usd",
      "status": "succeeded",
      "date": "2024-01-15",
      "membershipPlan": "premium"
    }
  ]
}
```

---

## 🐳 Docker Deployment

### **Local Docker Compose**

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Production Deployment**

#### **Vercel (Frontend)**
```bash
# Connect repository
vercel link

# Deploy
vercel deploy --prod

# Environment variables
vercel env add VITE_API_BASE_URL
```

#### **Railway/Render (Backend)**
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push to main

#### **MongoDB Atlas**
1. Create cluster
2. Create database user
3. Get connection string
4. Add to `.env`

---

## 🧪 Testing

### **Backend Tests** (Setup TODO)
```bash
npm run test
npm run test:watch
npm run test:coverage
```

### **API Testing with Postman**
- Import Postman collection from `/docs/postman_collection.json`
- Set environment variables
- Test all endpoints

---

## 📦 Build & Production

### **Frontend Build**
```bash
cd client
npm run build
# Output: dist/

# Preview production build
npm run preview
```

### **Backend Build**
```bash
cd server
npm run build
# Output: dist/

npm start
```

---

## 🌟 Features Roadmap

### **Phase 1 (Done)** ✅
- ✅ Authentication & Authorization
- ✅ Member Management
- ✅ Billing & Payments (Stripe)
- ✅ Real-time Notifications

### **Phase 2 (In Progress)** 🔄
- 🔄 Class Management
- 🔄 Trainer Dashboard
- 🔄 Attendance Tracking
- 🔄 Analytics & Reports

### **Phase 3 (Planned)** 📋
- 📋 Mobile App (React Native)
- 📋 Advanced Analytics
- 📋 Gym Packages & Promotions
- 📋 Appointment Scheduling
- 📋 QR Code Check-in

---

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### **Coding Standards**
- Use TypeScript with strict mode
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Keep functions small and focused

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sharon** - Full Stack Developer & AI Engineer

- 🌐 [GitHub](https://github.com/sharonaaas27-dev)
- 💼 [LinkedIn](https://linkedin.com)
- 📧 [Email](mailto:sharon@email.com)

---

## 📝 Acknowledgments

- React & TypeScript community
- Express.js documentation
- Stripe API docs
- MongoDB Atlas
- Vercel hosting

---

<div align="center">

**Made with ❤️ by Sharon**

Give a ⭐ if this project helped you!

</div>
