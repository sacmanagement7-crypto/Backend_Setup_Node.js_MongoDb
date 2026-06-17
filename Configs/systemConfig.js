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
