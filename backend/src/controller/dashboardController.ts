import express from "express";
import User from "../model/User.ts";
import Entry from "../model/Entry.ts";
import { error } from "console";
import Admin from "../model/Auth.ts";

export const getStatistics = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const totalUser = await User.countDocuments({
      authId: (req as any).user.id,
    });
    if (totalUser === 0) {
      return res.status(200).json({
        totalUser: 0,
        totalEntries: 0,
        totalAmount: 0,
        totalQuantity: 0,
      });
    }

    const totalDueAmount = await User.aggregate([
      {
        $group: {
          _id: null,
          nonPaidAmount: { $sum: "$nonPaidAmount" },
        },
      },
    ]);
    const totalSMS = await Admin.findById((req as any).user.id).select(
      "smsCount",
    );
    console.log(totalDueAmount, totalSMS, totalUser);
    return res.status(200).json({
      totalUser,
      totalAmount: totalDueAmount[0]?.nonPaidAmount || 0,
      totalSMS: totalSMS?.smsCount || 0,
    });
  } catch (error) {
    console.log("Error fetching statistics:", error);
    return res.status(500).json({ message: "server error" });
  }
};
