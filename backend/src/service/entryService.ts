import mongoose from "mongoose";
import { updateClientAmountRepo } from "../reposatory/clientRepo.js";
import {
  getAllEntriesRepo,
  getEntryByIdRepo,
} from "../reposatory/entryRepo.js";
import logger from "../utils/logger.js";

export const getAllEntriesService = async (id: string) => {
  try {
    const entries = await getAllEntriesRepo(id);
    if (!entries) {
      logger.warn(`No entries found for user with id: ${id}`);
      return { success: false, error: "No entries found" };
    }
    if (!entries.success) {
      logger.warn(
        `Failed to retrieve entries for user with id: ${id}. Error: ${entries.error}`,
      );
      return {
        success: false,
        error: entries.error || "Failed to retrieve entries",
      };
    }
    return { success: true, data: entries.data?.reverse() };
  } catch (error) {
    logger.error(`Error in getAllEntriesService: ${error}`);
    return { success: false, error: error };
  }
};

export const updateStatusEntryService = async (id: string) => {
  const session = await mongoose.default.startSession();
  session.startTransaction();
  try {
    const entry = await getEntryByIdRepo(id);
    if (!entry.success) {
      logger.warn(`Entry not found with id: ${id}`);
      session.endSession();
      return { success: false, error: "Entry not found" };
    }
    const isPaid = entry.data?.isPaid;
    const amount = Number(entry.data?.amount);
    if (isPaid === undefined) {
      logger.warn(`isPaid field is missing for entry with id: ${id}`);
      session.endSession();
      return { success: false, error: "isPaid field is missing" };
    }

    if (isPaid) {
      await updateClientAmountRepo(String(entry.data?.userId), -amount);
      entry.data!.isPaid = false;
    } else {
      await updateClientAmountRepo(String(entry.data?.userId), amount);
      entry.data!.isPaid = true;
    }
    await entry.data!.save();
    await session.commitTransaction();
    session.endSession();
    return { success: true, data: entry.data };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(`Error in updateStatusEntryService: ${error}`);
    return { success: false, error: error };
  }
};
