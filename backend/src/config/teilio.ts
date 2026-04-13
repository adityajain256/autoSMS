import twilio from "twilio";
import mongoose from "mongoose";
import SMS from "../model/Sms.ts";

export const sendSMS = async (
  to: string,
  body: string,
  userId: mongoose.Types.ObjectId,
) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioClient = twilio(accountSid, authToken);
  const twilioPhoneNumber = process.env.TWILIO_PHONE;

  const session = await mongoose.default.startSession();
  session.startTransaction();
  try {
    const response = await twilioClient.messages.create({
      from:
        twilioPhoneNumber ||
        (() => {
          throw new Error(
            "TWILIO_PHONE_NUMBER environment variable is not set",
          );
        })(),
      to: "+91" + to,
      body,
    });
    const smsRecord = await SMS.create(
      [
        {
          adminId: userId,
          to: "+91" + to,
          body,
          status: response.status,
          errorMessage: response.errorMessage || "",
        },
      ],
      { session },
    );

    if (!smsRecord || smsRecord.length === 0) {
      throw new Error("Failed to create SMS record in database");
    }
    await session.commitTransaction();
    session.endSession();
    return { success: true, response };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send SMS:", errorMessage);
    return { success: false, error: `Failed to send SMS: ${errorMessage}` };
  }
};

// export const fetchAllSMS = async (userId: mongoose.Types.ObjectId) => {
//   try {
//     const params: any = { limit: 100 };
//     if (twilioPhoneNumber) {
//       params.from = twilioPhoneNumber;
//     }
//     const sms = await twilioClient.messages.list(params);
//     return sms;
//   } catch (error) {
//     console.error("Error fetching SMS count:", error);
//     throw error;
//   }
// };
