import express from "express";
import doenv from "dotenv";
import authRouter from "./route/userRoute";
import clientRouter from "./route/clientRouter";
import entryRouter from "./route/entryRoute";
import smsRouter from "./route/smsRoute";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
import cors from "cors";
import dashboardRouter from "./route/dashboard";
import { envSchema } from "./config/env";
import { pinoHttp } from "pino-http";
import logger from "./utils/logger";

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
