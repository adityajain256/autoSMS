import twilio from "twilio";

export const sendSMS = async (to: string, body: string) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioClient = twilio(accountSid, authToken);
    const twilioPhoneNumber = process.env.TWILIO_PHONE;
    try {
        const response = await twilioClient.messages.create({
            from: twilioPhoneNumber || (() => { throw new Error("TWILIO_PHONE_NUMBER environment variable is not set"); })(),
            to: "+91"+ to,
            body,
        })
        return { success: true, response };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Failed to send SMS:", errorMessage);
        return { success: false, error: `Failed to send SMS: ${errorMessage}` };
    }
}
