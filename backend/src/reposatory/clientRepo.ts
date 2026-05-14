import mongoose, { set } from "mongoose";
import Client from "../model/Client.js";
import User from "../model/User.js";
import type { IClient } from "../types/index.js";
import Entry from "../model/Entry.js";
import redisClient from "../config/redis.js";

export const getAllClientsRepo = async (
  id: string,
  skip: number,
  limit: number,
) => {
  try {
    const clients = await Client.find({ authId: id }).sort({
      createdAt: -1,
    });
    if (!clients) {
      return { success: false, error: "No clients found for this user" };
    }
    await redisClient.set(
      `allClient:${id}`,
      JSON.stringify(await Client.find({ authId: id })),
      {
        EX: 60 * 60, // Cache for 1 hour
      },
    );
    return clients;
  } catch (error) {
    return { success: false, error: error };
  }
};

export const getClientByIdRepo = async (id: string) => {
  try {
    const client = await Client.findById(id).populate("entries");
    if (!client) {
      return { success: false, error: "Client not found" };
    }
    return client;
  } catch (error) {
    return { success: false, error: error };
  }
};

export const createClientRepo = async (data: IClient, authId: string) => {
  try {
    const client = await Client.create(data);
    if (!client) {
      return { success: false, error: "Failed to create client" };
    }
    await User.findByIdAndUpdate(authId, {
      $push: { clients: client._id },
    });
    return { success: true, data: client };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const deleteClientRepo = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Entry.deleteMany({ userId: id }, { session });
    const deletedClient = await Client.findByIdAndDelete(id).session(session);
    if (!deletedClient) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, error: "Client not found" };
    }
    await session.commitTransaction();
    session.endSession();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { success: false, error: error };
  }
};

export const getClientsWithDuesRepo = async (id: string) => {
  try {
    const clients = await Client.find({
      authId: id,
      nonPaidAmount: { $gt: 0 },
    });
    if (!clients) {
      return {
        success: false,
        error: "No clients with dues found for this user",
      };
    }
    return clients;
  } catch (error) {
    return { success: false, error: error };
  }
};

export const updateClientStatusRepo = async (
  id: string,
  status: boolean,
  type: "welcomeMessageSent" | "paymentReminderSent",
) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { [type]: status },
      { returnDocument: "after" },
    );
    if (!updatedClient) {
      return { success: false, error: "Client not found" };
    }
    return { success: true, data: updatedClient };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const getClientsWithStatusRepo = async (
  id: string,
  status: boolean,
  type: "welcomeMessageSent" | "paymentReminderSent",
) => {
  try {
    const data =
      type === "paymentReminderSent"
        ? { authId: id, [type]: status, nonPaidAmount: { $gt: 0 } }
        : { authId: id, [type]: status };
    const clients = await Client.find(data);
    if (!clients) {
      return {
        success: false,
        error: "No clients with the specified status found for this user",
      };
    }
    return clients;
  } catch (error) {
    return { success: false, error: error };
  }
};

export const updateClientAmountRepo = async (id: string, amount: number) => {
  try {
    const updateData =
      amount > 0
        ? { paidAmount: amount, nonPaidAmount: -amount }
        : { nonPaidAmount: -amount, paidAmount: amount };
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { $inc: updateData },
      { returnDocument: "after" },
    );
    if (!updatedClient) {
      return { success: false, error: "Client not found" };
    }
    return { success: true, data: updatedClient };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const getClientRepo = async (
  phoneNumber: string,
  vehicleId: string,
  email: string,
  id: string,
) => {
  try {
    const conditions = [];

    if (phoneNumber) conditions.push({ phoneNumber: phoneNumber });
    if (vehicleId) conditions.push({ vehicle: vehicleId });
    if (email) conditions.push({ email: email });

    const clientRedis = await redisClient.get(
      `allClient:${id}:${phoneNumber}:${vehicleId}:${email}`,
    );

    if (clientRedis) {
      return { success: true, data: JSON.parse(clientRedis) };
    }

    const client = await Client.findOne({
      $or: conditions,
    });

    if (!client) {
      return { success: false, error: "Client not found" };
    }

    return { success: true, data: client };
  } catch (error) {
    return {
      success: false,
      error: `Error occurred while fetching client: ${error}`,
    };
  }
};

export const getClientInfoRepo = async (id: string) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const totalClients = await Client.countDocuments({ authId: id });
    const totalNonPaidAmountAgg = await Client.aggregate([
      { $match: { authId: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: null, totalNonPaidAmount: { $sum: "$nonPaidAmount" } } },
    ]);
    const totalNonPaidAmount =
      totalNonPaidAmountAgg[0]?.totalNonPaidAmount || 0;

    const clientsCreatedToday = await Client.countDocuments({
      authId: id,
      createdAt: { $gte: oneDayAgo },
    });

    if (!totalClients && !totalNonPaidAmount && !clientsCreatedToday) {
      return {
        success: false,
        data: {
          totalUser: 0,
          totalNonPaidAmount: 0,
          clientsCreatedToday: 0,
        },
      };
    }

    return {
      success: true,
      data: {
        totalUser: totalClients,
        totalNonPaidAmount,
        clientsCreatedToday,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Error occurred while fetching client info: ${error}`,
    };
  }
};

export const getClientsRepo = async (search: any) => {
  try {
    const clients = await Client.find({
      $or: [
        { username: { $regex: search.value, $options: "i" } },
        { phoneNumber: { $regex: search.value, $options: "i" } },
        { vehicle: { $regex: search.value, $options: "i" } },
        { email: { $regex: search.value, $options: "i" } },
      ],
    });
    return { success: true, data: clients };
  } catch (error) {
    return { success: false, error: error };
  }
};
