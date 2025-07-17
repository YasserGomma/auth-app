# 🔒 AuthFlow - Secure Authentication System

A **production-ready, full-stack authentication system** built with modern security practices and a complete TypeScript setup.

---

## 📋 Table of Contents

* [Features](#-features)
* [Quick Start](#-quick-start)
* [Development Setup](#-development-setup)
* [API Documentation](#-api-documentation)
* [Architecture Diagram](#-architecture-diagram)
* [Security Features](#️-security-features)
* [Testing](#-testing)
* [License](#license)

---

## ✨ Features

### 🖥️ Frontend (React + TypeScript)

* ⚡ Vite-powered fast development environment
* 🔐 JWT-based authentication flow
* 📱 Responsive, accessible UI with clean form components
* 🛠️ Real-time validation feedback
* 🔒 Protected routes with automatic token management

### 🧠 Backend (NestJS)

* 🔑 JWT authentication via Passport.js
* 🔐 Password hashing using Bcrypt (10 salt rounds)
* 📄 Auto-generated API docs with Swagger
* 🚦 Rate limiting (100 requests/minute)
* 🧾 Detailed request logging
* ✅ Robust validation using `class-validator`

### 🧱 Infrastructure

* 🐳 Fully containerized using Docker & Docker Compose
* 🧩 Modular multi-service architecture
* 🔄 Hot-reload enabled for development
* 🛡️ Secure HTTP headers via Helmet

---

## 🚀 Quick Start

### ⚙️ Prerequisites

* **Docker** v20.10+
* **Docker Compose** v2.0+

### 🏁 Launch with Docker

```bash
# Clone the repository
git clone https://github.com/your-repo/auth-app.git
cd auth-app

# Build and run the services
docker-compose up --build
```

### 🖥️ Access URLs

* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)
* **API Docs**: [http://localhost:5000/api](http://localhost:5000/api)
* **MongoDB**: `mongodb://root:example@localhost:27017`

---

## 🛠️ Development Setup

### Backend

```bash
cd backend
npm install
npm run start:dev     # Run with hot-reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev           # Vite dev server
```

---

## 📚 API Documentation

Available at: [http://localhost:5000/api](http://localhost:5000/api)

### Endpoints

| Endpoint        | Method | Description                 |
| --------------- | ------ | --------------------------- |
| `/auth/signup`  | POST   | Register a new user         |
| `/auth/signin`  | POST   | Authenticate and return JWT |
| `/auth/profile` | GET    | Get current user profile    |

### Example Request

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

---

## 🗺️ Architecture Diagram

![Architecture Diagram](./docs/architecture.png.png)

### Services

* `auth-frontend-dev`: React development server
* `auth-backend`: NestJS API server
* `mongo`: MongoDB database

---

## 🛡️ Security Features

* ✅ Password strength validation (min 8 chars, special characters)
* ✅ HTTPS-ready configuration
* ✅ CSRF protection
* ✅ Rate limiting
* ✅ Secure HTTP headers (via Helmet)
* ✅ Request payload sanitization
* ✅ Short-lived JWTs (1 hour expiration)

---

## 🧪 Testing

### Backend

```bash
cd backend
npm test
```

###  Run tests with coverage
```bash
cd backend
 npm run test:cov
```
