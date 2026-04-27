// src/config/redis.ts
import logger from "../utils/logger.ts";
import { createClient } from "redis";
import doenv from "dotenv";
doenv.config();

const userName = process.env.REDIS_USERNAME;
const password: string = String(process.env.REDIS_PASSWORD);
const host: string = String(process.env.REDIS_HOST);
const port: number = Number(process.env.REDIS_PORT);

if (!userName || !password || !host || !port) {
  logger.error(
    "Redis configuration is incomplete. Please check environment variables.",
  );
  throw new Error(
    "Redis configuration is incomplete. Please check environment variables.",
  );
}

const redisClient = createClient({
  username: userName,
  password: password,
  socket: {
    host: host,
    port: port,
  },
});

redisClient.on("error", (err: Error) => {
  logger.error(`redis error: ${err}`);
  throw err;
  process.exit(1);
});

export default redisClient;
