import {
  createClientRepo,
  getAllClientsRepo,
  getClientByIdRepo,
  getClientRepo,
  getClientsRepo,
  updateClientAmountRepo,
} from "../reposatory/clientRepo.js";
import logger from "../utils/logger.js";
import type { IClient } from "../types/index.js";
import { deleteClientRepo } from "../reposatory/clientRepo.js";
import mongoose from "mongoose";
import { createEntryRepo } from "../reposatory/entryRepo.js";
import redisClient from "../config/redis.js";
import { deleteClient } from "../reposatory/userRepo.js";
import { sendMail } from "../config/mail.js";
import { welcomeMessageTemplateForMail } from "../utils/templates.js";
import { parseJsonText } from "typescript";

export const getAllClientsService = async (
  id: string,
  skip: number,
  limit: number,
) => {
  try {
    const cachedClients = await redisClient.get(`allClient:${id}`);
    if (cachedClients) {
      logger.info(`Clients retrieved from cache for user ID: ${id}`);
      return JSON.parse(cachedClients);
    }
    const clients = await getAllClientsRepo(id, skip, limit);
    if (!clients) {
      logger.warn(`No clients found for user with id: ${id}`);
      return { success: false, error: "No clients found" };
    }
    logger.info(`Clients retrieved for user ID: ${id}`);

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
    await redisClient.append(
      `allClient:${authId}`,
      JSON.stringify(client.data),
    );
    logger.info(`Client created for user ID: ${authId}`);
    sendMail(
      String(client.data?.email),
      "Welcome to " +
        String(await redisClient.get(`user:${authId}:petrolPumpName`)),
      welcomeMessageTemplateForMail(
        String(await redisClient.get(`user:${authId}:petrolPumpName`)),
        String(client.data?.username),
        String(await redisClient.get(`user:${authId}:email`)),
        String(await redisClient.get(`user:${authId}:address`)),
      ),
    );

    return { success: true, data: client };
  } catch (error) {
    logger.error(error);
    return { success: false, error: error };
  }
};

export const deleteClientService = async (id: string, authId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await deleteClientRepo(id);
    await redisClient.del(`allClient:${authId}`);
    if (!result.success) {
      await session.abortTransaction();
      session.endSession();
      logger.error(`Failed to delete client with ID: ${id} - ${result.error}`);
      return { success: false, error: result.error };
    }
    const deleteClientResult = await deleteClient(id, authId);
    if (!deleteClientResult.success) {
      await session.abortTransaction();
      session.endSession();
      logger.error(
        `Failed to delete client with ID: ${id} - ${deleteClientResult.error}`,
      );
      return { success: false, error: deleteClientResult.error };
    }
    await redisClient.del(`allClient:${authId}`);
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

export const updateClientAmountService = async (
  id: string,
  amount: number,
  authId: string,
) => {
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

    await redisClient.del(`allClient:${authId}`);
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
  id: string,
) => {
  try {
    const phoneNumberWithCountryCode = String(phoneNumber).startsWith("+91")
      ? String(phoneNumber)
      : `+91${String(phoneNumber)}`;
    phoneNumber = phoneNumberWithCountryCode;

    const client = await getClientRepo(phoneNumber, vehicleId, email, id);
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

export const searchClientsService = async (searchTerm: string, id: string) => {
  try {
    logger.info(
      `Searching clients with searchTerm: ${searchTerm} for user ID: ${id}`,
    );
    const phoneNumber = String(searchTerm).startsWith("+91")
      ? searchTerm
      : undefined;
    const vehicleId = searchTerm.match(/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/)
      ? searchTerm
      : undefined;
    const email = String(searchTerm).includes("@") ? searchTerm : undefined;
    const username =
      !phoneNumber && !vehicleId && !email ? searchTerm : undefined;
    const clients = await redisClient.get(`allClient:${id}`);

    const search = {
      type: username
        ? "username"
        : phoneNumber
          ? "phoneNumber"
          : vehicleId
            ? "vehicle"
            : "email",
      value: searchTerm,
    };

    if (clients) {
      const filteredClients = JSON.parse(clients).filter(
        (client: any) =>
          client[search.type] &&
          String(client[search.type])
            .toLowerCase()
            .includes(String(search.value).toLowerCase()),
      );

      return { success: true, data: filteredClients };
    }
    const clientsFromDB = await getClientsRepo(search);
    return { success: true, data: clientsFromDB.data };
  } catch (error) {
    return { success: false, error: error };
  }
};
