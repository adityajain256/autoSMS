import logger from "../utils/logger";
import {
  getClientsWithStatusRepo,
  updateClientStatusRepo,
} from "../reposatory/clientRepo";
import redisClient from "../config/redis";
import { createSMSRepo, getAllSMSRepo } from "../reposatory/smsRepo";
import {
  dueMessageTemplateForMail,
  welcomeMessageTemplateForMail,
} from "../utils/templates";
import { sendMail } from "../config/mail";

export const sendWelcomeSMSService = async (
  authId: string,
  lang: "eng" | "hin",
) => {
  try {
    const status = false;
    const clients = await getClientsWithStatusRepo(
      String(authId),
      status,
      "welcomeMessageSent",
    );
    if (!Array.isArray(clients) || clients.length === 0) {
      logger.error(`User not found with ID: ${authId}`);
      return {
        success: true,
        message: "Every client has already received the welcome message",
      };
    }

    const welcomeMessage = String(
      lang === "eng"
        ? process.env.WHATSAPP_WELCOME_MESSAGE_ENG
        : process.env.WHATSAPP_WELCOME_MESSAGE_HIN,
    );
    const petrolPumpName = String(
      await redisClient.get(`user:${authId}:petrolPumpName`),
    );
    const email = String(await redisClient.get(`user:${authId}:email`));
    const address = String(await redisClient.get(`user:${authId}:address`));

    clients.map((client) => {
      setTimeout(async () => {
        const mailBody = welcomeMessageTemplateForMail(
          petrolPumpName,
          String(client.username),
          email,
          address,
        );
        const res = await sendMail(
          String(client.email),
          "Welcome to " + petrolPumpName,
          mailBody,
        );
        await createSMSRepo({
          userId: authId,
          to: String(client.phoneNumber),
          body: "Welcome message sent.",
          status: "welcomeMessage",
        });
        logger.info(
          `Welcome SMS sent to client ID: ${client._id} with phone number: ${client.phoneNumber} response: ${String(res) || "mail sent"}`,
        );
        await updateClientStatusRepo(
          String(client._id),
          !status,
          "welcomeMessageSent",
        );
      }, 500);
    });
    logger.info(`Welcome SMS sending process initiated for user ID: ${authId}`);
    return { success: true, message: "Welcome SMS sent to all clients" };
  } catch (error) {
    logger.error(`Error occurred while sending welcome SMS: ${error}`);
    throw new Error("Failed to send welcome SMS");
  }
};

export const sendDueSMSService = async (
  authId: string,
  lang: "eng" | "hin",
) => {
  try {
    const status = false;
    const clients = await getClientsWithStatusRepo(
      authId,
      status,
      "paymentReminderSent",
    );
    if (!Array.isArray(clients) || clients.length === 0) {
      logger.info(`No clients with dues found for user ID: ${authId}`);
      return { success: true, message: "No clients with dues to send SMS" };
    }

    const dueMessageTemplate: string = String(
      lang === "eng"
        ? process.env.WHATSAPP_DUE_MESSAGE_ENG
        : process.env.WHATSAPP_DUE_MESSAGE_HIN,
    );
    const petrolPumpName = String(
      await redisClient.get(`user:${authId}:petrolPumpName`),
    );
    const address = String(await redisClient.get(`user:${authId}:address`));
    const email = String(await redisClient.get(`user:${authId}:email`));

    for (const client of clients) {
      setTimeout(async () => {
        const personalizedMessage = dueMessageTemplateForMail(
          petrolPumpName,
          String(client.nonPaidAmount),
          String(client.totalQuantity),
          String(client.createdAt?.toLocaleDateString() || ""),
          String(new Date().getFullYear()),
          email,
          address,
        );
        const res = await sendMail(
          String(client.email),
          "Due Amount Reminder from " + petrolPumpName,
          personalizedMessage,
        );
        await createSMSRepo({
          userId: authId,
          to: String(client.phoneNumber),
          body: "Due message send.",
          status: "dueMessage",
        });
        logger.info(
          `Due SMS sent to client ID: ${client._id} with phone number: ${client.phoneNumber} response: ${String(res) || "mail sent"}`,
        );
        await updateClientStatusRepo(
          String(client._id),
          !status,
          "paymentReminderSent",
        );
      }, 500);
    }
    logger.info(`Due SMS sending process initiated for user ID: ${authId}`);
    return { success: true, message: "Due SMS sent to all clients with dues" };
  } catch (error) {
    logger.error(`Error occurred while sending due SMS: ${error}`);
    return { success: false, message: "Failed to send due SMS" };
  }
};

export const getAllSMSService = async (authId: string) => {
  try {
    const sms = await getAllSMSRepo(authId);
    if (!Array.isArray(sms)) {
      logger.error(
        `Failed to retrieve SMS for user ID: ${authId} - ${sms.error}`,
      );
      return { success: false, error: sms.error || "Failed to retrieve SMS" };
    }
    logger.info(`SMS retrieved successfully for user ID: ${authId}`);
    return sms;
  } catch (error) {
    logger.error(`Error occurred while retrieving SMS: ${error}`);
    return { success: false, error: error };
  }
};
