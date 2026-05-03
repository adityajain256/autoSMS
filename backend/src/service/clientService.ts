import {
  createClientRepo,
  getAllClientsRepo,
  getClientByIdRepo,
  getClientRepo,
  updateClientAmountRepo,
} from "../reposatory/clientRepo.js";
import logger from "../utils/logger.js";
import type { IClient } from "../types/index.js";
import { deleteClientRepo } from "../reposatory/clientRepo.js";
import User from "../model/User.js";
import mongoose from "mongoose";
import { createEntryRepo } from "../reposatory/entryRepo.js";
import redisClient from "../config/redis.js";

export const getAllClientsService = async (
  id: string,
  skip: number,
  limit: number,
) => {
  try {
    const clientsFromRedis = await redisClient.get(`allClient:${id}`);
    if (clientsFromRedis) {
      logger.info(`Clients retrieved from Redis for user ID: ${id}`);
      return JSON.parse(clientsFromRedis);
    }
    const clients = await getAllClientsRepo(id, skip, limit);
    if (!clients) {
      logger.warn(`No clients found for user with id: ${id}`);
      return { success: false, error: "No clients found" };
    }
    logger.info(`Clients retrieved for user ID: ${id}`);
    await redisClient.set(`allClient:${id}`, JSON.stringify(clients), {
      EX: 3600,
    }); // Cache for 1 hour
    return clients;
  } catch (error) {
    logger.error(error);
    return { success: false, error: error };
  }
};

export const getClientByIdService = async (id: string) => {
  try {
    const client = await getClientByIdRepo(id);
    logger.info(`Client retrieved for ID: ${id}`);
    return client;
  } catch (error) {
    logger.error(error);
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

    logger.info(`Client created for user ID: ${authId}`);

    return { success: true, data: client };
  } catch (error) {
    logger.error(error);
    return { success: false, error: error };
  }
};

export const deleteClientService = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await deleteClientRepo(id);
    if (!result.success) {
      await session.abortTransaction();
      session.endSession();
      logger.error(`Failed to delete client with ID: ${id} - ${result.error}`);
      return { success: false, error: result.error };
    }
    await session.commitTransaction();
    session.endSession();
    logger.info(`Client deleted for ID: ${id}`);
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(error);
    return { success: false, error: error };
  }
};

export const updateClientAmountService = async (id: string, amount: number) => {
  try {
    const updateClientAmount = await updateClientAmountRepo(id, amount);
    if (!updateClientAmount.success) {
      logger.error(
        `Failed to update client amount for ID: ${id} - ${updateClientAmount.error}`,
      );
      return { success: false, error: updateClientAmount.error };
    }
    const createEntry = await createEntryRepo({
      userId: id,
      amount: amount,
      type: "Payment",
      quantity: 0,
    } as any);
    if (!createEntry.success) {
      logger.error(
        `Failed to create entry for client ID: ${id} - ${createEntry.error}`,
      );
      return { success: false, error: createEntry.error };
    }
    logger.info(`Client amount updated for ID: ${id}`);
    return { success: true, data: updateClientAmount.data };
  } catch (error) {
    logger.error(error);
    return { success: false, error: error };
  }
};

export const getClientService = async (
  phoneNumber: string,
  vehicleId: string,
  email: string,
) => {
  try {
    const phoneNumberWithCountryCode = String(phoneNumber).startsWith("+91")
      ? String(phoneNumber)
      : `+91${String(phoneNumber)}`;
    phoneNumber = phoneNumberWithCountryCode;

    const client = await getClientRepo(phoneNumber, vehicleId, email);
    if (!client.success) {
      logger.warn(
        `Client not found with phoneNumber: ${phoneNumber}, vehicleId: ${vehicleId}, email: ${email} - ${client.error}`,
      );
      return { success: false, error: client.error || "Client not found" };
    }
    logger.info(
      `Client retrieved with phoneNumber: ${phoneNumber}, vehicleId: ${vehicleId}, email: ${email}`,
    );
    return { success: true, data: client.data };
  } catch (error) {
    logger.warn(
      `Failed to get client with phoneNumber: ${phoneNumber}, vehicleId: ${vehicleId}, email: ${email} - ${error}`,
    );
    return {
      success: false,
      error: `Error occurred while fetching client in services: ${error}`,
    };
  }
};
