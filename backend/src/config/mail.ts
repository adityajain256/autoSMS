import logger from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

// export const sendMail = async (
//   to: string,
//   subject: string,
//   template: string,
// ) => {
//   const transportOptions = {
//     host: process.env.SMTP_HOST!,
//     port: Number(process.env.SMTP_PORT),
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER!,
//       pass: process.env.SMTP_PASS!,
//     },
//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 15000,
//   };
//   console.log("SMTP CONFIG:", {
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT),
//     user: process.env.SMTP_USER,
//     passSet: !!process.env.SMTP_PASS, // don't log the actual key
//   });
//   const transporter = nodemailer.createTransport(transportOptions);
//   try {
//     await transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to: to,
//       subject: subject,
//       html: template,
//     });

//     logger.info(`mail sent to ${to}`);
//   } catch (error) {
//     logger.error(error);
//   }
// };

export const sendMail = async (
  to: string,
  subject: string,
  template: string,
) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: process.env.SMTP_USER },
        to: [{ email: to }],
        subject,
        htmlContent: template,
      }),
    });
    logger.info(`Status:, ${response.status}`);
    logger.info(`Status Text:, ${response.statusText}`);

    const rawText = await response.json();
    logger.info("Raw Response: " + rawText);
    if (!response.ok) {
      const err = await response.json();
      logger.error("Brevo API error:", err);
      return;
    }

    logger.info(`mail sent to ${to}`);
  } catch (error) {
    logger.error(error);
  }
};
