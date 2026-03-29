import express from "express";
import doenv from "dotenv";

doenv.config();

const app: express.Application = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Server is running 🚀");
});

// Start server
export default app;