import express from "express";
import { sendSMS } from "../config/teilio.ts";
import Entry from "../model/Entry.ts";

export const sendSmsRetry = async (req: express.Request, res: express.Response) => {
    const { entryId } = req.params;
    try {
        const entry = await Entry.findById(entryId).populate("userId");
        if(!entry){
            return res.status(404).json({ message: "Entry not found" });
        }
        const userNumber = entry.userId?.phoneNumber;
        if(!userNumber){
            return res.status(404).json({ message: "User phone number not found for this entry" });
        }
        // Logic to retry sending SMS for the given entryId
        // This is a placeholder. You would typically fetch the entry details and resend the SMS.
        const smsRes = await sendSMS(userNumber, `Retrying SMS for entry ${entryId}`);
        return res.status(200).json({ 
            message: "SMS retry initiated", 
            data: { messageId: smsRes.response?.sid, status: smsRes.response?.status } 
        });
    } catch (error) {
        console.error("Error retrying SMS:", error);
        return res.status(500).json({ message: "Failed to retry SMS" });
    }
};

// export const checkSmsStatus = async (req: express.Request, res: express.Response) => {
//     const { entryId } = req.params;
//     try {
//         const smsStatus = "delivered"; 
//         console.log(`SMS status for entry ${entryId}:`, smsStatus);
//         return res.status(200).json({ message: "SMS status retrieved", data: { entryId, status: smsStatus } });
//     } catch (error) {
//         return res.status(501).json({ message: "SMS status check not yet implemented", entryId });
//     }
// };