import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { systemConfig } from "./Configs/systemConfig.js";
import { connectingDb } from "./Configs/dbConfig.js";

import { errorMiddleware } from "./Middlewares/errorMiddleware.js";

import basicAuth from "express-basic-auth";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./Configs/swaggerConfig.js";


const app = express();

app.use(
    cors({
        origin: systemConfig.cors.origin,
        credentials: true,
    })
)

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Expense Tracker API Running"
    })
})

if (systemConfig.swagger.enabled) {
    app.use(
        "/api-docs",
        basicAuth({
            users: {
                admin: process.env.SWAGGER_PASSWORD,
            },
            challenge: true,
        }),
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec)
    );
}

// all routes here

app.use(errorMiddleware);

const startServer = async () => {
    try {
        await connectingDb();

        app.listen(systemConfig.app.port, () => {
            console.log(
                `Server running on port ${systemConfig.app.port}`
            );
        })

    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}

startServer();

