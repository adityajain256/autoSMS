import express from "express";
import validators from "../utils/validators";
import logger from "../utils/logger";

export const varification = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const data = req.body;
    if (!data.email || !data.password || !data.phoneNumber) {
      logger.warn(
        { phoneNumebr: data.phoneNumber, userMail: data.email },
        "Missing required fields.",
      );
      return res.status(400).json({ message: "invalid credentials" });
    }
    const re: string = validators.validatePassword(data.password);
    if (re !== "OK") {
      logger.warn({ userMail: data.email }, "Not a valid Pass");
      return res.status(400).json({ message: "invalid credentials" });
    }
    if (validators.validatePhoneNumber(String(data.phoneNumber)) === false) {
      logger.warn(
        { phoneNumebr: data.phoneNumber, userMail: data.email },
        "Invalid phone number format.",
      );
      return res.status(400).json({ message: "invalid credentials" });
    }
    if (validators.validateEmail(String(data.email)) == false) {
      logger.warn(
        { phoneNumebr: data.phoneNumber, userMail: data.email },
        "Invalid email format.",
      );
      return res.status(400).json({ message: "invalid credentials" });
    }

    next();
  } catch (error) {
    logger.warn({ message: "An error occurred during validation." });

    res.status(500).json({ message: "An error occurred during validation." });
  }
};
