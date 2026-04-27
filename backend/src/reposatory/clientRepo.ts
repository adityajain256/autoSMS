import mongoose from "mongoose";
import Client from "../model/Client.ts";
import User from "../model/User.ts";
import type { IClient } from "../types/index.ts";
import Entry from "../model/Entry.ts";

export const getAllClientsRepo = async (id: string) => {
  try {
    const clients: IClient[] = await Client.find({ authId: id });
    if (!clients) {
      return { success: false, error: "No clients found for this user" };
    }
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

export const updateClientWelcomeMessageStatusRepo = async (
  id: string,
  status: boolean,
) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { welcomeMessageSent: status },
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

export const getClientsWithWelcomeMessageStatusRepo = async (
  id: string,
  status: boolean,
) => {
  try {
    const clients = await Client.find({
      authId: id,
      welcomeMessageSent: status,
    });
    if (!clients) {
      return {
        success: false,
        error:
          "No clients with the specified welcome message status found for this user",
      };
    }
    return clients;
  } catch (error) {
    return { success: false, error: error };
  }
};
