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
    await redisClient.incr(`ip:${ipAddress}`);

    const counter = await redisClient.get(`ip:${ipAddress}`);
    if (counter && parseInt(counter) >= 100) {
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

export const smsRateLimiter = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const authId = (req as any).user.id;
  try {
    const exists = await redisClient.exists(`sms:${authId}`);
    if (!exists) {
      await redisClient.set(`sms:${authId}`, 0, { EX: 60 });
    }
    await redisClient.incr(`sms:${authId}`);
    const counter = await redisClient.get(`sms:${authId}`);
    if (counter && parseInt(counter) > 1) {
      return res.status(429).json({
        message: "Too many SMS requests. Please try again later.",
      });
    }
    next();
  } catch (error) {
    res.status(403).json({
      message: "Forbidden: Invalid token.",
    });
  }
};
