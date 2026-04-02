import express from "express";
import doenv from "dotenv";
import DBconnection from "./config/db.ts";
import authRouter from "./route/authRoute.ts";
import clientRouter from "./route/clientRouter.ts";
import entryRouter from "./route/entryRoute.ts";
import smsRouter from "./route/smsRoute.ts";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.ts";

doenv.config();
await DBconnection();


const app: express.Application = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/clients", clientRouter);
app.use("/api/entries", entryRouter);
app.use("/api/sms", smsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));



export default app;