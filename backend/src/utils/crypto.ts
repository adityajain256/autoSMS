import bcrypt from "bcryptjs";
import logger from "./logger.ts";
import redisClient from "../config/redis.ts";

export const hash = async (data: string) => {
  try {
    const hashedData = await bcrypt.hash(data, 5);
    return hashedData;
  } catch (error) {
    logger.error(`Hashing data error ${error}`);
  }
};

export const compare = async (email: string, otp: string) => {
  try {
    const hashedOtp = await redisClient.get(email);
    if (!hashedOtp) {
      logger.error({ email: email }, "no Hashed otp in redis");
    }
    const isMatch: boolean = await bcrypt.compare(otp, String(hashedOtp));
    return isMatch;
  } catch (error) {
    logger.error({ email: email }, `error in comparing ${error}`);
  }
};
