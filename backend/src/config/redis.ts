// src/config/redis.ts
import logger from "../utils/logger.ts";
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL as string,
});

redisClient.on("error", (err: Error) => {
  logger.error(`redis error: ${err}`);
  throw err;
});

export default redisClient;
