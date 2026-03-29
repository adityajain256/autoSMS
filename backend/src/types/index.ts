import { Document, Types } from 'mongoose';


export interface ICAUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff';
  createdAt: Date;
  updatedAt: Date;
}

export interface IClient extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string; // +91XXXXXXXXXX format
  gstNumber: string;
  address: string;
  totalTaxFilled: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaxEntry extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Reference to Client
  amount: number;
  entryDate: Date;
  totalAfterEntry: number;
  remark: string;
  smsStatus: 'pending' | 'sent' | 'failed';
  smsResponse?: any;
  createdBy: Types.ObjectId; // Reference to CAUser
  createdAt: Date;
  updatedAt: Date;
}

// Session type extension
// declare module 'express-session' {
//   interface SessionData {
//     userId: string;
//     role: 'admin' | 'staff';
//   }
// }