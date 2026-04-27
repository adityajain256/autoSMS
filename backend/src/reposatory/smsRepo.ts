import SMS from "../model/Sms.ts";
import type { ISMS } from "../types/index.ts";

export const createSMSRepo = async (data: ISMS) => {
  try {
    await SMS.create(data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const getAllSMSRepo = async (authId: string) => {
  try {
    const sms = await SMS.find({ userId: authId });
    return sms;
  } catch (error) {
    return { success: false, error: error };
  }
};
