# Expense Tracker Backend API

A scalable and production-ready Node.js + Express.js backend architecture using:

- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Swagger Documentation
- Centralized Configuration
- Global Error Handling
- Async Handler Pattern
- Service Layer Architecture
- Validation Layer
- Environment Based Configuration

---

# Project Structure

```bash
BACK_SETUP/
│
├── Configs/
│   ├── dbConfig.js
│   ├── swaggerConfig.js
│   └── systemConfig.js
│
├── Controllers/
│
├── Middlewares/
│   └── errorMiddleware.js
│
├── Models/
│
├── Routers/
│
├── Services/
│
├── Utils/
│   ├── asyncHandler.js
│   └── jwtUtils.js
│
├── Validations/
│
├── .env
├── Sample.env
├── index.js
└── package.json
```

---

# Architecture Flow

```text
Request
   ↓
Router
   ↓
Validation
   ↓
Controller
   ↓
Service
   ↓
Model (MongoDB)
   ↓
Response
```

Error Flow:

```text
Any Error
   ↓
asyncHandler
   ↓
errorMiddleware
   ↓
JSON Response
```

---

# Core Rules

## 1. Always Use asyncHandler in Controllers

Never write:

```js
export const login = async (req, res) => {
   const user = await User.findOne();
   res.json(user);
};
```

Use:

```js
import { asyncHandler } from "../Utils/asyncHandler.js";

export const login = asyncHandler(async (req, res) => {
    const user = await User.findOne();

    res.status(200).json({
        success: true,
        data: user,
    });
});
```

Reason:

- Eliminates repetitive try-catch blocks.
- Automatically forwards errors to errorMiddleware.
- Keeps controllers clean.

---

## 2. Business Logic Must Stay Inside Services

❌ Bad

```js
export const login = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user) {
        throw new Error("User not found");
    }

    res.json(user);
});
```

✅ Good

Controller:

```js
export const login = asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);

    res.status(200).json({
        success: true,
        data,
    });
});
```

Service:

```js
export const login = async (payload) => {
    const user = await User.findOne({
        email: payload.email,
    });

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};
```

---

## 3. Controllers Should Stay Thin

Controllers should only:

- Receive request
- Call service
- Return response

Avoid:

- Database queries
- Complex calculations
- Business logic

---

## 4. Validate Request Before Controller

Every route should have validation middleware.

Example:

```js
router.post(
    "/register",
    registerValidation,
    register
);
```

Folder:

```bash
Validations/
```

---

## 5. Use Centralized Configuration

Never access environment variables directly.

❌ Bad

```js
process.env.JWT_SECRET
```

✅ Good

```js
systemConfig.jwt.secret
```

Example:

```js
import { systemConfig } from "../Configs/systemConfig.js";
```

---

# Configuration

## systemConfig.js

All application settings are maintained in a single place.

```js
import dotenv from "dotenv";
dotenv.config();

export const systemConfig = {
    app: {
        port: process.env.PORT || 5434,
        nodeEnv: process.env.NODE_ENV || "development",
    },

    mongo: {
        uri: process.env.MONGODB_URI,
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },

    cors: {
        origin: process.env.CORS_ORIGIN || "*",
    },

    swagger: {
        enabled: process.env.SWAGGER_ENABLED === "true",
        route: process.env.SWAGGER_ROUTE || "/api-docs",
        title: process.env.SWAGGER_TITLE || "Expense Tracker API",
        version: process.env.SWAGGER_VERSION || "1.0.0",
        description:
            process.env.SWAGGER_DESCRIPTION ||
            "API Documentation for Expense Tracker",
        serverUrl:
            process.env.SWAGGER_SERVER_URL ||
            `http://localhost:${process.env.PORT || 5434}/api`,
    },
};
```

---

# Database Connection

Location:

```bash
Configs/dbConfig.js
```

```js
import mongoose from "mongoose";
import { systemConfig } from "./systemConfig.js";

export const connectingDb = async () => {
    try {
        await mongoose.connect(systemConfig.mongo.uri);

        console.log("MongoDB Connected...");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
```

---

# Async Handler

Location:

```bash
Utils/asyncHandler.js
```

```js
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };
};
```

Usage:

```js
export const createExpense = asyncHandler(
    async (req, res) => {
        const expense =
            await expenseService.create(req.body);

        res.status(201).json({
            success: true,
            data: expense,
        });
    }
);
```

---

# Global Error Middleware

Location:

```bash
Middlewares/errorMiddleware.js
```

Features:

- Duplicate Key Handling
- Validation Error Handling
- Invalid ObjectId Handling
- Development Stack Trace
- Centralized Error Response

Response Format:

```json
{
    "success": false,
    "message": "Email already registered"
}
```

---

# JWT Utilities

Location:

```bash
Utils/jwtUtils.js
```

Generate Token:

```js
const token = generateToken(user._id);
```

Verify Token:

```js
const decoded = verifyToken(token);
```

---

# Swagger Documentation

Enable Swagger:

```env
SWAGGER_ENABLED=true
```

Access:

```bash
http://localhost:5434/api-docs
```

Swagger is protected using Basic Authentication.

---

# Standard API Response

## Success Response

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {}
}
```

---

## Error Response

```json
{
    "success": false,
    "message": "Something went wrong"
}
```

---

# Route Example

```js
router.post(
    "/expense",
    createExpenseValidation,
    createExpense
);
```

---

# Controller Example

```js
export const createExpense = asyncHandler(
    async (req, res) => {
        const expense =
            await expenseService.createExpense(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Expense created",
            data: expense,
        });
    }
);
```

---

# Service Example

```js
export const createExpense = async (
    payload
) => {
    const expense =
        await Expense.create(payload);

    return expense;
};
```

---

# Environment Variables

## Sample.env

```env
PORT=5434

NODE_ENV=development

MONGODB_URI=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CORS_ORIGIN=*

SWAGGER_ENABLED=true
SWAGGER_PASSWORD=admin123

SWAGGER_ROUTE=/api-docs
SWAGGER_TITLE=Expense Tracker API
SWAGGER_VERSION=1.0.0

SWAGGER_DESCRIPTION=Expense Tracker API Documentation

SWAGGER_SERVER_URL=http://localhost:5434/api
```

---

# Development Guidelines

### DO

✅ Use asyncHandler in every controller

✅ Keep controllers thin

✅ Put business logic in services

✅ Use validation before controller

✅ Use centralized configs

✅ Throw proper errors with statusCode

✅ Use Swagger documentation

✅ Follow folder structure

---

### DON'T

❌ Don't use try-catch in every controller

❌ Don't access process.env directly

❌ Don't write business logic in controllers

❌ Don't query database directly from routes

❌ Don't return inconsistent response formats

❌ Don't skip validations

---

# Startup Commands

Install Dependencies

```bash
npm install
```

Run Development Server

```bash
npm run dev
```

Run Production

```bash
npm start
```

---

# Backend Coding Standard

For every new API:

```text
1. Create Validation
2. Create Service
3. Create Controller
4. Wrap Controller with asyncHandler
5. Create Route
6. Add Swagger Documentation
7. Test API
```

Always follow:

```text
Router
 → Validation
 → Controller
 → Service
 → Model
```

This architecture keeps the codebase scalable, maintainable, testable, and production-ready.