import app from "./src/app.js";
import DBconnection from "./src/config/db.js";
import { envSchema } from "./src/config/env.js";
import logger from "./src/utils/logger.js";
import redisClient from "./src/config/redis.js";

const startServer = async () => {
  envSchema.parse(process.env);
  try {
    await DBconnection();
    logger.info(
      { userName: "aditya" },
      "Database connected successfully. Starting server...",
    );
    await redisClient.connect();
    logger.info("redis db connected.");

    app.listen(process.env.PORT || 3000, () => {
      logger.debug(
        { userName: "aditya" },
        `Server is running on port ${process.env.PORT || 3000}`,
      );
    });
  } catch (error) {
    logger.error(
      { userName: "aditya" },
      "Failed to connect to the database. Server will not start.",
      (error as Error).message,
    );
    throw error;
  }
};

startServer()
  .then(() => {
    logger.debug(
      { userName: "aditya" },
      "Database connected successfully. Starting server...",
    );
  })
  .catch((error) => {
    logger.error(
      { userName: "aditya" },
      "Error during server startup:",
      (error as Error).message,
    );
    throw error;
  });
