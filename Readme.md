# Node.js Backend Boilerplate

A scalable, maintainable, and production-ready Node.js + Express.js backend boilerplate following a clean layered architecture.

---

# Features

* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Swagger Documentation
* Async Handler Pattern
* Service Layer Architecture
* Validation Layer
* Centralized Configuration
* Global Error Handling
* Environment-Based Configuration
* Clean Folder Structure
* Production Ready Setup

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
├── package.json
└── package-lock.json
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
Model
   ↓
Database
   ↓
Response
```

Error Flow:

```text
Application Error
      ↓
asyncHandler
      ↓
errorMiddleware
      ↓
JSON Response
```

---

# Mandatory Development Rules

## Every API Must Follow

```text
Router
 → Validation
 → Controller
 → Service
 → Model
```

Never skip any layer.

---

# Controller Rules

Controllers should only:

* Receive request data
* Call service methods
* Return responses

Controllers should NOT:

* Contain business logic
* Perform database operations
* Handle complex calculations
* Access external services directly

Example:

```js
export const create = asyncHandler(async (req, res) => {
    const data = await exampleService.create(req.body);

    return res.status(201).json({
        success: true,
        data,
    });
});
```

---

# Service Rules

Services are responsible for:

* Business logic
* Database operations
* Data transformation
* External service integration
* Throwing application errors

Example:

```js
export const create = async (payload) => {
    const record = await Model.create(payload);

    return record;
};
```

---

# Validation Rules

Every request should be validated before reaching the controller.

Example:

```js
router.post(
    "/",
    createValidation,
    create
);
```

Validation responsibilities:

* Required fields
* Data types
* Input sanitization
* Request schema validation

---

# Async Handler Pattern

## Mandatory

Every controller must be wrapped with asyncHandler.

Never write:

```js
export const create = async (req, res) => {
    const data = await service.create();

    res.json(data);
};
```

Always write:

```js
export const create = asyncHandler(
    async (req, res) => {
        const data = await service.create();

        res.status(200).json({
            success: true,
            data,
        });
    }
);
```

Benefits:

* No repetitive try-catch blocks
* Cleaner controllers
* Automatic error forwarding
* Centralized error handling

---

# Error Handling

All errors must be handled through the global error middleware.

Never send custom error responses directly from controllers.

Instead:

```js
const error = new Error("Resource not found");
error.statusCode = 404;

throw error;
```

The middleware will handle the response.

---

# Standard Error Response

```json
{
    "success": false,
    "message": "Something went wrong"
}
```

---

# Standard Success Response

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {}
}
```

---

# Configuration Rules

All application settings should be managed through:

```bash
Configs/systemConfig.js
```

Never use:

```js
process.env.JWT_SECRET
process.env.PORT
process.env.MONGODB_URI
```

Always use:

```js
systemConfig.jwt.secret
systemConfig.app.port
systemConfig.mongo.uri
```

Benefits:

* Single source of truth
* Easier maintenance
* Better scalability
* Environment consistency

---

# Database Connection

Database connection should be initialized before starting the server.

Responsibilities:

* Establish connection
* Handle connection failures
* Exit application if connection fails

---

# JWT Utilities

JWT utility functions should be centralized.

Responsibilities:

* Token generation
* Token verification
* Authentication helpers

Location:

```bash
Utils/jwtUtils.js
```

---

# Swagger Documentation

Swagger documentation should be maintained for all routes.

Responsibilities:

* Endpoint documentation
* Request schemas
* Response schemas
* Authentication documentation

Access Route:

```bash
/api-docs
```

Swagger should be protected using Basic Authentication in non-public environments.

---

# Middleware Rules

Middlewares should be responsible for:

* Authentication
* Authorization
* Validation
* Error handling
* Request processing

Avoid business logic inside middleware.

---

# Model Rules

Models should contain:

* Schema definitions
* Indexes
* Virtuals
* Model-level hooks

Models should NOT contain:

* Business logic
* Controller logic
* Route logic

---

# Route Rules

Routes should only map requests to controllers.

Example:

```js
router.post(
    "/",
    validationMiddleware,
    controllerMethod
);
```

Routes should NOT:

* Query databases
* Handle business logic
* Format responses

---

# Folder Responsibilities

## Configs

Application configurations.

```text
Database
JWT
Swagger
Application Settings
```

---

## Controllers

Request and response handling.

```text
Receive Request
Call Service
Return Response
```

---

## Services

Business logic layer.

```text
Database Operations
Business Rules
External Services
Data Processing
```

---

## Models

Database schemas and models.

---

## Routers

Endpoint definitions.

---

## Middlewares

Reusable request processing logic.

---

## Validations

Request validation schemas and rules.

---

## Utils

Reusable helper functions.

Examples:

```text
Async Handler
JWT Helpers
Response Helpers
File Helpers
Date Helpers
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
SWAGGER_TITLE=Backend API
SWAGGER_VERSION=1.0.0
SWAGGER_DESCRIPTION=Backend API Documentation

SWAGGER_SERVER_URL=http://localhost:5434/api
```

---

# Coding Standards

### Use ES Modules

```js
import express from "express";
```

---

### Use Named Exports

```js
export const create = () => {};
```

Avoid:

```js
export default create;
```

---

### Use Async/Await

Preferred:

```js
const data = await service.get();
```

Avoid:

```js
service.get().then();
```

---

### Keep Functions Small

Each function should have a single responsibility.

---

### Maintain Consistent Response Structure

Success:

```json
{
    "success": true,
    "message": "Success",
    "data": {}
}
```

Error:

```json
{
    "success": false,
    "message": "Error message"
}
```

---

# Development Checklist

Before creating any new endpoint:

* Create validation
* Create service method
* Create controller method
* Wrap controller with asyncHandler
* Create route
* Add Swagger documentation
* Test endpoint
* Verify error handling

---

# Startup Commands

Install Dependencies

```bash
npm install
```

Development Mode

```bash
npm run dev
```

Production Mode

```bash
npm start
```

---

# Summary

This boilerplate follows a layered architecture that promotes:

* Scalability
* Maintainability
* Reusability
* Clean Code Practices
* Separation of Concerns
* Production Readiness

Always follow:

```text
Router
 → Validation
 → Controller
 → Service
 → Model
```

And always use:

```text
asyncHandler
+
Global Error Middleware
+
Centralized Configuration
```

for every new feature and endpoint.
