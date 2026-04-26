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

// interface IClient extends Document {
//   _id: Types.ObjectId;
//   name: string;
//   email: string;
//   phone: string; // +91XXXXXXXXXX format
//   gstNumber: string;
//   vehicleId: string;
//   address: string;
//   paidAmount: number;
//   nonPaidAmount: number;
//   quantity: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface ITaxEntry extends Document {
//   _id: Types.ObjectId;
//   userId: Types.ObjectId; // Reference to Client
//   amount: number;
//   entryDate: Date;
//   totalAfterEntry: number;
//   remark: string;
//   smsStatus: "pending" | "sent" | "failed";
//   smsResponse?: any;
//   createdBy: Types.ObjectId; // Reference to CAUser
//   createdAt: Date;
//   updatedAt: Date;
// }
