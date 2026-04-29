import { getAllEntriesRepo } from "../reposatory/entryRepo.js";
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
