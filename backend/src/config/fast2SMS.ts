import fast2Sms from "@api/fast2sms";
import SMS from "../model/Sms.ts";
import mongoose from "mongoose";

type BulkDLTParams = {
  numbers: string[];
  templateId: string;
  senderId: string;
  variables: string[]; // ordered values
};

export const sendBulkDLTSMS = async ({
  numbers,
  templateId,
  senderId,
  variables,
}: BulkDLTParams) => {
  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "dlt",
        sender_id: process.env.FAST2SMS_SENDER_ID || senderId,
        message: templateId,
        variables_values: variables.join("|"),
        numbers: numbers.join(","),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "DLT SMS failed");
    }

    return data;
  } catch (error: any) {
    console.error("DLT SMS Error:", error.message);
    throw error;
  }
};

export const singleSMS = async (
  phone: string,
  message: string,
  variables: string[],
) => {
  const session = await mongoose.default.startSession();
  session.startTransaction();
  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: process.env.FAST2SMS_API_KEY || "",
      },
      body: JSON.stringify({
        route: "dlt",
        sender_id: process.env.FAST2SMS_SENDER_ID || "TXTIND",
        message: message,
        numbers: phone,
        variables_values: `${variables[0]}|${variables[1]}|${variables[2]}|${variables[3]}`,
      }),
    });

    await session.commitTransaction();
    session.endSession();
    return res;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error sending SMS through Fast2SMS:", error);
    return error;
  }
};
