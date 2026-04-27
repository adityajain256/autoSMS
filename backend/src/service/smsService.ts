import logger from "../utils/logger.ts";
import { sendWhatsAppMessage } from "./whatsappService.ts";
import {
  getAllClientsRepo,
  getClientsWithDuesRepo,
} from "../reposatory/clientRepo.ts";
import redisClient from "../config/redis.ts";
import { createSMSRepo } from "../reposatory/smsRepo.ts";

export const sendWelcomeSMSService = async (
  authId: string,
  lang: "eng" | "hin",
) => {
  try {
    const clients = await getAllClientsRepo(authId);
    if (!Array.isArray(clients) || clients.length === 0) {
      logger.error(`User not found with ID: ${authId}`);
      return;
    }

    const welcomeMessage = String(
      lang === "eng"
        ? process.env.WHATSAPP_WELCOME_MESSAGE_ENG
        : process.env.WHATSAPP_WELCOME_MESSAGE_HIN,
    );
    const petrolPumpName = String(
      await redisClient.get(`user:${authId}:petrolPumpName`),
    );
    for (const client of clients) {
      setTimeout(async () => {
        const res = await sendWhatsAppMessage(
          String(client.phoneNumber),
          welcomeMessage,
          lang === "eng" ? "en_US" : "hi",
          petrolPumpName,
        );
        await createSMSRepo({
          userId: client._id!,
          to: String(client.phoneNumber),
          body: "Welcome message sent.",
          status: "welcomeMessage",
          whatsappMessageId: res.id,
        });
      }, 500);
    }
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
    const clients = await getClientsWithDuesRepo(authId);
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

    for (const client of clients) {
      setTimeout(async () => {
        const res = await sendWhatsAppMessage(
          String(client.phoneNumber),
          dueMessageTemplate,
          lang === "eng" ? "en_US" : "hi",
          petrolPumpName,
        );
        await createSMSRepo({
          userId: client._id!,
          to: String(client.phoneNumber),
          body: "Due message send.",
          status: "dueMessage",
          whatsappMessageId: res.id,
        });
      }, 500);
    }
    return { success: true, message: "Due SMS sent to all clients with dues" };
  } catch (error) {
    logger.error(`Error occurred while sending due SMS: ${error}`);
    return { success: false, message: "Failed to send due SMS" };
  }
};
