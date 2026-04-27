import {
  createClientRepo,
  getAllClientsRepo,
  getClientByIdRepo,
} from "../reposatory/clientRepo.ts";
import logger from "../utils/logger.ts";
import type { IClient } from "../types/index.ts";
import { deleteClientRepo } from "../reposatory/clientRepo.ts";
import User from "../model/User.ts";
import mongoose from "mongoose";

export const getAllClientsService = async (id: string) => {
  try {
    const clients = await getAllClientsRepo(id);
    return clients;
  } catch (error) {
    logger.error(error);
    return { success: false, error: error };
  }
};

export const getClientByIdService = async (id: string) => {
  try {
    const client = await getClientByIdRepo(id);
    return client;
  } catch (error) {
    return { success: false, error: error };
  }
};

export const createClientService = async (data: IClient, authId: string) => {
  try {
    const phoneNumberWithCountryCode = String(data.phoneNumber).startsWith(
      "+91",
    )
      ? String(data.phoneNumber)
      : `+91${String(data.phoneNumber)}`;
    data.phoneNumber = phoneNumberWithCountryCode;

    const client = await createClientRepo(data, authId);
    if (!client.success) {
      return {
        success: false,
        error: client.error || "Failed to create client",
      };
    }
    
    return { success: true, data: client };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const deleteClientService = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await deleteClientRepo(id);
    await User.findOneAndUpdate({ clients: id }, { $pop: { clients: id } });
    await session.commitTransaction();
    session.endSession();
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(error);
    return { success: false, error: error };
  }
};
