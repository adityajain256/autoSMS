import Entry from "../model/Entry.js";
import type { IEntry } from "../types/index.js";

export const getAllEntriesRepo = async (id: string) => {
  try {
    const entries = await Entry.find({ authId: id }).populate("userId");
    if (!entries) {
      return { success: false, error: "No entries found" };
    }
    return { success: true, data: entries };
  } catch (error) {
    return { success: false, error: error };
  }
};
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

export const getEntryByIdRepo = async (id: string) => {
  try {
    const entry = await Entry.findById(id);
    if (!entry) {
      return { success: false, error: "Entry not found" };
    }
    return { success: true, data: entry };
  } catch (error) {
    return { success: false, error: error };
  }
};
