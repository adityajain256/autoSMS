import express from "express";
import doenv from "dotenv";
import authRouter from "./route/authRoute.ts";
import clientRouter from "./route/clientRouter.ts";
import entryRouter from "./route/entryRoute.ts";
import smsRouter from "./route/smsRoute.ts";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.ts";
import cors from "cors";
import dashboardRouter from "./route/dashboard.ts";
import { envSchema } from "./config/env.ts";
import { pinoHttp } from "pino-http";
import logger from "./utils/logger.ts";

doenv.config();
envSchema.parse(process.env);
const app: express.Application = express();
// Middleware
app.use(pinoHttp({ logger: logger }));
app.use(cors({ methods: ["GET", "POST", "PATCH", "DELETE"], origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/clients", clientRouter);
app.use("/api/entries", entryRouter);
app.use("/api/sms", smsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

export default app;
