# Task Management System

A full-stack task management application with real-time updates using Socket.io, built with React, TypeScript, Express, and MongoDB.

## ✨ Features

- **User Authentication**: Secure login/register with JWT
- **Task Management**: Create, update, delete, and filter tasks
- **Real-time Updates**: Socket.io for live task notifications
- **Role-based Access**: Admin, Manager, and User roles
- **User Profiles**: View and update user profile with name editing
- **Task Statistics**: Dashboard with real-time stats and progress tracking
- **Task Filtering**: Filter by status, priority, assignee, and search
- **Responsive Design**: Mobile-friendly UI with Material-UI

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Hook Form** - Form management
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
task-management-system/
├── frontend/
│   ├── src/
│   │   ├── api/              # API calls
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts (Auth, Socket)
│   │   ├── hooks/            # Custom hooks
│   │   ├── layouts/          # Layout components
│   │   ├── pages/            # Page components
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   ├── constants/        # Constants
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
|   |── .env
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── api/              # API routes
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Mongoose models
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   ├── constants/        # Constants
│   │   ├── config/           # Configuration
│   │   └── server.ts         # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── README.md
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v7 or higher) - Comes with Node.js
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud): [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MustajabShaikh/task-management-system.git
cd task-management-system
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file if needed
# Environment variables will use defaults if not set
```

## ⚙️ Configuration

### Backend (.env file)

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/task-management

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE_TIME=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Optional: MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management?retryWrites=true&w=majority
```

### Frontend (.env file - Optional)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## ▶️ Running the Application

### Option 1: Run Both Services (Recommended for Development)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

The backend will start at `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The frontend will start at `http://localhost:5173`

### Option 2: Build for Production

**Backend:**

```bash
cd backend
npm run build
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm preview
```

### Available Scripts

#### Backend

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm run lint     # Run ESLint
```

#### Frontend

```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### User Endpoints

- `GET /api/users` - Get all users (Admin/Manager only)
- `GET /api/users/:id` - Get user profile by ID
- `PUT /api/users/:id` - Update user profile (name only)

### Task Endpoints

- `GET /api/tasks` - Get all tasks with filters
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

### Socket.io Events

Real-time events for task updates:

- `task_created` - New task created
- `task_updated` - Task updated
- `task_deleted` - Task deleted
- `task_status_changed` - Task status changed
- `task_assigned` - Task assigned to user

## 🔐 User Roles

### Admin
### Manager
### User

## 👤 Author

**Mustajab Shaikh**

- GitHub: [@MustajabShaikh](https://github.com/MustajabShaikh)

---
