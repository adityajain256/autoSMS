export const sendWhatsAppMessage = async (
  to: string,
  message: string,
  lang: string,
  petrolPumpName?: string,
) => {
  const apiKey = process.env.WHATSAPP_API_KEY;
  const senderId = process.env.WHATSAPP_SENDER_ID;
  const version = process.env.WHATSAPP_API_VERSION || "v20.0"; // Facebook Graph API version
  if (!apiKey || !senderId) {
    console.error("WhatsApp API key or sender ID is not set.");
    return;
  }
  const url = `https://graph.facebook.com/${version}/${senderId}/messages`;
  try {
    const response = await fetch(url, {
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
    return await response.json();
  } catch (error) {
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
  const apiKey = process.env.WHATSAPP_API_KEY;
  const senderId = process.env.WHATSAPP_SENDER_ID;
  const version = process.env.WHATSAPP_API_VERSION || "v20.0"; // Facebook Graph API version
  if (!apiKey || !senderId) {
    console.error("WhatsApp API key or sender ID is not set.");
    return;
  }
  const url = `https://graph.facebook.com/${version}/${senderId}/messages`;
  try {
    const response = await fetch(url, {
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
    return await response.json();
  } catch (error) {
    return error;
  }
};
