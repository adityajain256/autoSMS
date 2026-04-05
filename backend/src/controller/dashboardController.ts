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
    const user: any = await User.find({ authId: (req as any).user.id });
    const totalUser: number = user.length;
    if (totalUser === 0) {
      return res.status(200).json({
        totalUser: 0,
        totalEntries: 0,
        totalAmount: 0,
        totalQuantity: 0,
      });
    }

    const totalDueAmount: Number = user.reduce(
      (acc: any, ele: any) => acc + ele.nonPaidAmount,
      0,
    );

    const totalSMS = await Admin.findById((req as any).user.id).select(
      "smsCount",
    );

    const totalClientInOneDay: any = user.reduce((acc: any, ele: any) => {
      const createdAt = new Date(ele.createdAt);
      const today = new Date();
      if (
        createdAt.getDate() === today.getDate() &&
        createdAt.getMonth() === today.getMonth() &&
        createdAt.getFullYear() === today.getFullYear()
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return res.status(200).json({
      totalUser: totalUser || 0,
      totalAmount: totalDueAmount || 0,
      totalSMS: totalSMS?.smsCount || 0,
      totalClientInOneDay: totalClientInOneDay || 0,
    });
  } catch (error) {
    console.log("Error fetching statistics:", error);
    return res.status(500).json({ message: "server error" });
  }
};
