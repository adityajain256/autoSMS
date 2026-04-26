import nodemailer from "nodemailer";
import logger from "../utils/logger.ts";

export const sendMail = async (
  to: string,
  subject: string,
  template: string,
) => {
  const transportOptions = {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  };

  const transporter = nodemailer.createTransport(transportOptions);
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
      html: template,
    });

    logger.info(`mail sent to ${to}`);
  } catch (error) {
    logger.error(error);
  }
};
