import app from "./src/app.ts";
import DBconnection from "./src/config/db.ts";
import { envSchema } from "./src/config/env.ts";
import logger from "./src/utils/logger.ts";

const startServer = async () => {
  envSchema.parse(process.env);
  try {
    await DBconnection();
    logger.info(
      { userName: "aditya" },
      "Database connected successfully. Starting server...",
    );

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
    process.exit(1);
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
    process.exit(1);
  });
