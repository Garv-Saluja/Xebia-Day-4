# LearnHub LMS — Full Stack Application

A complete Learning Management System built with **React + Node.js + Express + MongoDB**.

---

## 📁 Project Structure

```
lms/
├── backend/                  # Node.js + Express + MongoDB API
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   └── jwt.js            # JWT utilities
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── course.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT protect + role authorize
│   │   ├── errorHandler.js         # Global error handler
│   │   └── validation.middleware.js # express-validator rules
│   ├── models/
│   │   ├── User.model.js
│   │   └── Course.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── course.routes.js
│   │   └── dashboard.routes.js
│   ├── .env
│   ├── package.json
│   └── server.js             # Express entry point
│
└── frontend/                 # React SPA
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── DashboardLayout.js  # Sidebar wrapper
    │   │   ├── ProtectedRoute.js   # Auth guard
    │   │   └── Sidebar.js
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   └── DashboardPage.js    # Student / Admin / Instructor views
    │   ├── styles/
    │   │   ├── auth.css
    │   │   ├── global.css
    │   │   ├── layout.css
    │   │   └── sidebar.css
    │   ├── utils/
    │   │   ├── api.js              # Axios instance + API functions
    │   │   └── AuthContext.js      # Global auth state
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js >= 18
- MongoDB (local or MongoDB Atlas)

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env → set MONGO_URI and JWT_SECRET
npm install
npm run dev          # Starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start            # Starts on http://localhost:3000
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| POST | `/api/auth/logout` | Private |
| PUT | `/api/auth/change-password` | Private |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users/profile` | Private |
| PUT | `/api/users/profile` | Private |
| DELETE | `/api/users/profile` | Private |
| GET | `/api/users` | Admin |

### Courses
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/courses` | Public |
| GET | `/api/courses/:id` | Public |
| POST | `/api/courses` | Instructor/Admin |
| PUT | `/api/courses/:id` | Instructor/Admin |
| POST | `/api/courses/:id/enroll` | Student |
| DELETE | `/api/courses/:id` | Admin |

### Dashboard
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/dashboard/student` | Student |
| GET | `/api/dashboard/instructor` | Instructor |
| GET | `/api/dashboard/admin` | Admin |

---

## 🛡️ Security Features
- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT-based authentication (7-day expiry)
- Rate limiting (100 req/15min global, 10/15min on auth)
- Helmet.js security headers
- Input validation via express-validator
- CORS restricted to frontend origin
- Sensitive fields excluded from DB queries

---

## 👤 User Roles
| Role | Permissions |
|------|------------|
| `student` | Browse courses, enroll, view student dashboard |
| `instructor` | Create/edit own courses, view instructor dashboard |
| `admin` | Full access to all users, courses, admin dashboard |
