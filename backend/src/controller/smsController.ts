import express from "express";
import {
  sendDueSMSService,
  sendWelcomeSMSService,
} from "../service/smsService";
import logger from "../utils/logger";

export const sendWelcomeSMS = async (
  req: express.Request,
  res: express.Response,
) => {
  const { eng, hindi } = req.body;
  const authId = (req as any).user.id;
  try {
    const result = await sendWelcomeSMSService(authId, eng ? "eng" : "hin");
    if (result?.success || result?.message) {
      return res.status(200).json({
        message:
          result?.message ||
          "Every client has alreday received the welcome message",
      });
    }
    if (!result?.success) {
      return res
        .status(501)
        .json({ message: result?.message || "Failed to send welcome SMS" });
    }
    logger.info(`Welcome SMS sent successfully for user ID: ${authId}`);
    return res.status(200).json({ message: "Welcome SMS sent to all clients" });
  } catch (error) {
    logger.error(`Error sending welcome SMS to all clients: ${error}`);
    return res
      .status(500)
      .json({ message: "Error sending welcome SMS to all clients", error });
  }
};

export const sendDueSMS = async (
  req: express.Request,
  res: express.Response,
) => {
  const { eng, hindi } = req.body;
  const authId = (req as any).user.id;

  try {
    const result = await sendDueSMSService(authId, eng ? "eng" : "hin");
    if (!result?.success) {
      return res
        .status(501)
        .json({ message: result?.message || "Failed to send due SMS" });
    }
    if (result?.success || result?.message) {
      logger.info(`Due SMS sent successfully for user ID: ${authId}`);
      return res.status(200).json({
        message:
          result?.message ||
          "Due SMS have been already sent to all clients with dues",
      });
    }
    logger.info(`Due SMS sent successfully for user ID: ${authId}`);
    return res
      .status(200)
      .json({ message: "Due SMS sent to all clients with dues" });
  } catch (error) {
    logger.error(`Error sending due SMS to all clients with dues: ${error}`);
    return res.status(500).json({
      message: `Failed to send due SMS to all clients with dues`,
      error,
    });
  }
};

// export const sendMonthlySMS = async (
//   req: express.Request,
//   res: express.Response,
// ) => {
//   try {
//     const authId = (req as any).user.id;
//     new CronJob(
//       "0 0 1 * *",
//       async () => {
//         try {
//           const result = await sendDueSMSService(authId, "eng");
//           if (!result?.success) {
//             logger.error(
//               `Failed to send monthly summary SMS for user ID: ${authId} - ${result?.message} `,
//             );
//           } else {
//             logger.info(
//               `Monthly summary SMS sent successfully for user ID: ${authId}`,
//             );
//           }
//         } catch (error) {
//           logger.error(
//             `Error sending monthly summary SMS for user ID: ${authId} - ${error}`,
//           );
//         }
//       },
//       null,
//       true,
//     );
//     return res
//       .status(200)
//       .json({ message: "Monthly summary SMS sent to all clients with dues" });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error sending monthly summary SMS to all clients",
//       error,
//     });
//   }
// };
