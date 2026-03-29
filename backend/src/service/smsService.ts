import Client from "twilio";


const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const twilioClient = Client(accountSid, authToken);

export const sendSMS = async (to: string, body: string) => {
    try {
        const message = await twilioClient.messages.create({
            body: body,
            from: process.env.TWILIO_PHONE_NUMBER || "",
            to: to
        });
        return { success: true, sid: message.sid };
    }
    catch (error){
        return { success: false, error: "Failed to send SMS." };
    }
}