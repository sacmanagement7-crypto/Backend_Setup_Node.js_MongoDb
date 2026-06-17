import { systemConfig } from "../Configs/systemConfig.js";

export const errorMiddleware = (err, req, res, next) => {
  let message = err.message || "Internal Server Error";
  let statusCode = err.statusCode || 500;

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already registered`;
    statusCode = 409;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map((e) => e.message).join(", ");
    statusCode = 400;
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    message = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  // Log only unexpected server errors
  if (statusCode === 500) {
    console.error("💥 Server Error:", err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(systemConfig.app.nodeEnv === "development" && { stack: err.stack }),
  });
};