import cron from "cron";
import DBconnection from "../config/db.js";
import Client from "../model/Client.js";
import logger from "../utils/logger.js";
import redisClient from "../config/redis.js";

// Connect to DB
DBconnection()
  .then(() => {
    logger.info("Connected to DB while running updateClientFlags script.");

    // Schedule: Every Monday at 00:00
    const clientFlagJob = new cron.CronJob("0 0 * * 1", async () => {
      try {
        const result = await Client.updateMany(
          {},
          {
            $set: {
              paymentReminderSent: false,
              welcomeMessageSent: false,
            },
          },
        );
        logger.info(`Updated ${result.modifiedCount} clients.`);
      } catch (err) {
        logger.error(`Error updating clients: ${err}`);
      }
    });
    clientFlagJob.start();
    logger.info("Cron job scheduled: Every Monday at 00:00");

    // Schedule: Ping Redis every 15 minutes
    const redisPingJob = new cron.CronJob("*/15 * * * *", async () => {
      try {
        await redisClient.ping();
        logger.info("Redis ping successful.");
      } catch (err) {
        logger.error(`Redis ping failed: ${err}`);
      }
    });
    redisPingJob.start();
    logger.info("Cron job scheduled: Redis ping every 15 minutes");
  })
  .catch((err) => {
    logger.error("DB connection error:", err);
  });
