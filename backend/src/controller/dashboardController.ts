import express from "express";
import User from "../model/User.ts";

import SMS from "../model/Sms.ts";
import { getAllClientsService } from "../service/clientService.ts";
import { getAllSMSService } from "../service/smsService.ts";
import Client from "../model/Client.ts";

export const getStatistics = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const authId = (req as any).user.id;
    const user: any = await getAllClientsService(authId);
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

    const totalSMS = await getAllSMSService(authId);
    const smsCount = await SMS.find({
      userId: authId,
    }).countDocuments();

    const totalClientInOneDay: any = user.reduce((acc: any, ele: any) => {
      const createdAt = new Date(ele.createdAt);
      const today = new Date();
      createdAt.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (createdAt.getTime() === today.getTime()) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return res.status(200).json({
      totalUser: totalUser || 0,
      totalAmount: totalDueAmount || 0,
      totalSMS: smsCount || 0,
      totalClientInOneDay: totalClientInOneDay || 0,
      listOfSMS: totalSMS || [],
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

export const getTopClients = async (
  req: express.Request,
  res: express.Response,
) => {
  const { period } = req.query;
  try {
    const topClients = await Client.find({ authId: (req as any).user.id }).sort({
      paidAmount: -1,
    });
    return res.status(200).json({ topClients });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};
