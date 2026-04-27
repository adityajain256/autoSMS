export const whatsAppCredentials = () => {
  const apiKey = process.env.WHATSAPP_API_KEY;
  const senderId = process.env.WHATSAPP_SENDER_ID;
  const version = process.env.WHATSAPP_API_VERSION || "v25.0"; // Facebook Graph API version
  if (!apiKey || !senderId) {
    console.error("WhatsApp API key or sender ID is not set.");
    return;
  }
  const url = `https://graph.facebook.com/${version}/${senderId}/messages`;
  return { url, apiKey };
};
