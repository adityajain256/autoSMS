import User from "../model/User.js";
import type { IUser } from "../types/index.js";

export const createUser = async ({
  name,
  email,
  password,
  address,
  phoneNumber,
  petrolPumpName,
}: IUser) => {
  try {
    const user = await User.create({
      adminName: name,
      email,
      password,
      address: address,
      phoneNumber,
      petrolPumpName,
    } as IUser);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const updateUser = async (
  { name, email, password, address, phoneNumber, petrolPumpName, resetToken }: IUser,
  id: string,
) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        adminName: name,
        email,
        password,
        address: address,
        phoneNumber,
        petrolPumpName,
        resetToken,
      },
      {
        returnDocument: "after",
      },
    );
    return { success: true, data: updatedUser };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const loginUser = async (phoneNumber: string) => {
  try {
    const user = await User.findOne({
      phoneNumber: phoneNumber,
    });
    if (!user) {
      return { success: false, error: "no User with this phoneNumber" };
    }
    return { success: true, user: user };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const getUser = async (id: string) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return { success: false, error: "No User Found" };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const getUserByMail = async (email: string) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return { success: false, error: "No User Found" };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error };
  }
};
