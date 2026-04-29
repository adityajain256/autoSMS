import Entry from "../model/Entry.js";
import type { IEntry } from "../types/index.js";

export const getAllEntriesRepo = async (id: string) => {};
export const createEntryRepo = async (data: IEntry) => {
  try {
    const entry = await Entry.create(data);
    if (!entry) {
      return { success: false, error: "Failed to create entry" };
    }
    return { success: true, data: entry };
  } catch (error) {
    return { success: false, error: error };
  }
};
export const updateEntryRepo = async (id: string, data: IEntry) => {};
