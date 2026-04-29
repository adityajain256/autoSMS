import express from "express";
import doenv from "dotenv";
import authRouter from "./route/userRoute.js";
import clientRouter from "./route/clientRouter.js";
import entryRouter from "./route/entryRoute.js";
import smsRouter from "./route/smsRoute.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.js";
import cors from "cors";
import dashboardRouter from "./route/dashboard.js";
import { envSchema } from "./config/env.js";
import { pinoHttp } from "pino-http";
import logger from "./utils/logger.js";

doenv.config();
envSchema.parse(process.env);
const app: express.Application = express();

// Middleware
app.use(pinoHttp({ logger: logger }));
app.use(
  cors({
    methods: ["GET", "POST", "PATCH", "DELETE"],
    origin: [
      "https://lightleaf.vercel.app",
      "https://autosms.onrender.com",
    ],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/clients", clientRouter);
app.use("/api/entries", entryRouter);
app.use("/api/sms", smsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// app.get("/", (req, res) => {
//   res.status(404).send({ success: false, error: "Endpoint not found" });
// });
export default app;
