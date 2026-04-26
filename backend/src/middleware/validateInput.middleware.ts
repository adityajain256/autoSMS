import express from "express";
import validators from "../utils/validators.ts";
import logger from "../utils/logger.ts";

export const varification = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const data = req.body;
    if (!data.email || !data.password || !data.phoneNumber) {
      logger.error(
        { phoneNumebr: data.phoneNumber, userMail: data.email },
        "Missing required fields.",
      );
      return res.status(400).json({ message: "invalid credentials" });
    }
    const re: string = validators.validatePassword(data.password);
    if (re !== "OK") {
      logger.error({ userMail: data.email }, "Not a valid Pass");
      return res.status(400).json({ message: "invalid credentials" });
    }
    if (validators.validatePhoneNumber(String(data.phoneNumber)) === false) {
      logger.error(
        { phoneNumebr: data.phoneNumber, userMail: data.email },
        "Invalid phone number format.",
      );
      return res.status(400).json({ message: "invalid credentials" });
    }
    if (validators.validateEmail(String(data.email)) == false) {
      logger.error(
        { phoneNumebr: data.phoneNumber, userMail: data.email },
        "Invalid email format.",
      );
      return res.status(400).json({ message: "invalid credentials" });
    }

    next();
  } catch (error) {
    logger.error({ message: "An error occurred during validation." });

    res.status(500).json({ message: "An error occurred during validation." });
  }
};
