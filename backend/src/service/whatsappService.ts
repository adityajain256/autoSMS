import { whatsAppCredentials } from "../config/whatsapp.ts";
import logger from "../utils/logger.ts";

export const sendWhatsAppMessage = async (
  to: string,
  message: string,
  lang: string,
  petrolPumpName?: string,
) => {
  const credentials = whatsAppCredentials();
  if (!credentials) {
    logger.error("WhatsApp credentials are missing. Cannot send message.");
    throw new Error("WhatsApp credentials are missing. Cannot send message.");
  }
  const apiKey = credentials.apiKey;
  const url = credentials.url;
  try {
    const response = await fetch(String(url), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: message,
          language: {
            code: lang,
            components: [
              {
                type: "header",
                parameters: [
                  {
                    type: "text",
                    text: petrolPumpName,
                  },
                ],
              },
            ],
          },
        },
      }),
    });
    logger.info(
      `WhatsApp message sent to ${to} with response ${response.status} and template ${response.json()}`,
    );
    return await response.json();
  } catch (error) {
    logger.error(`Error sending WhatsApp message to ${to}: ${error}`);
    return error;
  }
};

export const sendDueWhatsappMessage = async (
  to: string,
  message: string,
  lang: string,
  dueAmount: string,
  quantity: string,
  dueDate: string,
  petrolPumpName: string,
) => {
  const credentials = whatsAppCredentials();
  if (!credentials) {
    logger.error("WhatsApp credentials are missing. Cannot send message.");
    throw new Error("WhatsApp credentials are missing. Cannot send message.");
  }
  const apiKey = credentials.apiKey;
  const url = credentials.url;
  try {
    const response = await fetch(String(url), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: message,
          language: {
            code: lang,
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "text",
                  text: "Payment Due Reminder",
                },
                {
                  type: "text",
                  text: petrolPumpName,
                },
              ],
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: String(dueAmount),
                },
                {
                  type: "text",
                  text: String(quantity),
                },
                {
                  type: "text",
                  text: dueDate.slice(0, 10),
                },
              ],
            },
          ],
        },
      }),
    });
    logger.info(`Due WhatsApp message sent to ${to} with template ${message}`);
    return await response.json();
  } catch (error) {
    logger.error(`Error sending due WhatsApp message to ${to}: ${error}`);
    return error;
  }
};
