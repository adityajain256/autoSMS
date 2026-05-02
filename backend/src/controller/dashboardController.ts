import express from "express";
import User from "../model/User.js";

import SMS from "../model/Sms.js";
import { getAllClientsService } from "../service/clientService.js";
import { getAllSMSService } from "../service/smsService.js";
import Client from "../model/Client.js";
import { getClientInfoRepo } from "../reposatory/clientRepo.js";
import logger from "../utils/logger.js";
import redisClient from "../config/redis.js";

export const getStatistics = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const authId = (req as any).user.id;
    const userInfo = await redisClient.get(`userInfo:${authId}`);
    if (userInfo) {
      logger.info(`User info retrieved from Redis for user ID: ${authId}`);
      return res.status(200).json(JSON.parse(userInfo));
    }
    const user = await getClientInfoRepo(authId);
    logger.info(
      `Statistics retrieved for user ID: ${authId}, ${JSON.stringify(user.data)}`,
    );

    const totalSMS = await getAllSMSService(authId);
    const smsCount = await SMS.find({
      userId: authId,
    }).countDocuments();
    await redisClient.set(
      `userInfo:${authId}`,
      JSON.stringify({
        totalUser: user.data?.totalUser || 0,
        totalAmount: user.data?.totalNonPaidAmount || 0,
        totalSMS: smsCount || 0,
        totalClientInOneDay: user.data?.clientsCreatedToday || 0,
        listOfSMS: totalSMS || [],
      }),
      {
        EX: 3600,
      },
    ); // Cache for 1 hour
    return res.status(200).json({
      totalUser: user.data?.totalUser || 0,
      totalAmount: user.data?.totalNonPaidAmount || 0,
      totalSMS: smsCount || 0,
      totalClientInOneDay: user.data?.clientsCreatedToday || 0,
      listOfSMS: totalSMS || [],
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
    const topClients = await Client.find({ authId: (req as any).user.id }).sort(
      {
        paidAmount: -1,
      },
    );
    return res.status(200).json({ topClients });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};
