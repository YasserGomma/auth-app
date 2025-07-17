# 🔒 AuthFlow - Secure Authentication System

A **production-ready, full-stack authentication system** built with modern security practices and a complete TypeScript setup.


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

📸 Screenshots

<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/2ca75d27-76a4-4da2-b919-4c85ee744694" />

<img width="1919" height="943" alt="image" src="https://github.com/user-attachments/assets/07a68df1-acbc-496e-84d8-628c4efb322e" />

<img width="1919" height="945" alt="image" src="https://github.com/user-attachments/assets/2ede6cca-f12a-4e2f-8b19-6c0d50e7358b" />



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

#### Signup

```json
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "Password123!"
}

```

#### Signin

```json
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}

```

### Example Response 

#### Signup

```json
{
  "message": "User created successfully",
  "userId": "abc123"
}

```

#### Signin

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR."
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
