import express from "express";
import redisClient from "../config/redis.ts";
import logger from "../utils/logger.ts";

export const rateLimiter = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const ipAddress = req.ip;
  try {
    const exists = await redisClient.exists(`ip:${ipAddress}`);
    if (!exists) {
      await redisClient.set(`ip:${ipAddress}`, 0, { EX: 60 });
    }

    const counter = await redisClient.get(`ip:${ipAddress}`);
    if (counter && parseInt(counter) >= 5) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
      });
    }
    next();
  } catch (error) {
    res.status(403).json({
      message: "Forbidden: Invalid token.",
    });
  }
};
