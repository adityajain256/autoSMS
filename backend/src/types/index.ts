import { Document, Types } from "mongoose";

export interface IUser {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  phoneNumber?: string;
  petrolPumpName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IClient {
  _id?: Types.ObjectId;
  userName?: string;
  email?: string;
  phoneNumber?: string; // +91XXXXXXXXXX format
  gstNumber?: string;
  vehicleId?: string;
  address?: string;
  paidAmount?: number;
  nonPaidAmount?: number;
  quantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISMS {
  _id?: Types.ObjectId;
  userId: Types.ObjectId; // Reference to Client
  to: string; // Phone number in +91XXXXXXXXXX format
  body: string;
  status: string;
  whatsappMessageId?: string; // ID returned by WhatsApp API
}

export interface IEntry {
  _id?: Types.ObjectId;
  userId: Types.ObjectId; // Reference to Client
  quantity: number;
  amount: number;
  isPaid: boolean;
  types?: "petrol" | "diesel" | "CNG" | "Payment";
  message?: string;
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
