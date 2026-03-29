import express from "express";
import doenv from "dotenv";
import DBconnection from "./config/db.ts";
import authRouter from "./route/authRoute.ts";

doenv.config();
await DBconnection();


const app: express.Application = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);



export default app;