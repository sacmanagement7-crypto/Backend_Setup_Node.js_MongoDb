import swaggerJsdoc from "swagger-jsdoc";
import { systemConfig } from "./systemConfig.js";

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: systemConfig.swagger.title,
            version: systemConfig.swagger.version,
            description: systemConfig.swagger.description,
        },
        servers: [
            {
                url: systemConfig.swagger.serverUrl,
            },
        ],
    },
    apis: ["./Routers/*.js"],
});