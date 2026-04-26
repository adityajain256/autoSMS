import express from "express";

import excel from "exceljs";
import {
  createClientService,
  deleteClientService,
  getAllClientsService,
  getClientByIdService,
} from "../service/clientService.ts";
import type { IClient } from "../types/index.ts";
import logger from "../utils/logger.ts";
import User from "../model/User.ts";
import Client from "../model/Client.ts";

export const getAllClients = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const authId = (req as any).user.id;
    const clients = await getAllClientsService(authId);
    return res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getClientById = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Client ID is required" });
  }
  try {
    const client = await getClientByIdService(String(id));
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid id format" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

export const createClient = async (
  req: express.Request,
  res: express.Response,
) => {
  const {
    userName,
    phoneNumber,
    address,
    gstNumber,
    email,
    paidAmount,
    nonPaidAmount,
    totalQuantity,
    vehicle,
  } = req.body;

  const authId = (req as any).user.id;

  if (!authId) {
    return res.status(400).json({ message: "no credentials." });
  }

  const p = `${phoneNumber}`;
  try {
    const newClient = await createClientService(
      {
        username: userName,
        phoneNumber: p,
        address,
        gstNumber,
        email,
        paidAmount,
        nonPaidAmount,
        totalQuantity,
        authId: authId,
        vehicle,
      } as IClient,
      authId,
    );
    if (!newClient.success) {
      logger.error(newClient.error);
      return res
        .status(400)
        .json({ message: newClient.error || "Failed to create client" });
    }
    res
      .status(201)
      .json({ message: "Client created successfully", data: newClient });
  } catch (error: any) {
    logger.error(`Error creating client: ${error.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};

// export const updateClient = async (
//   req: express.Request,
//   res: express.Response,
// ) => {
//   const { id } = req.params;
//   const { amount } = req.body;
//   const session = await mongoose.default.startSession();
//   session.startTransaction();

//   try {
//     // Only update fields that are defined\

//     const client = await User.findById(id);
//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     if (amount > client.nonPaidAmount) {
//       return res.status(400).json({
//         message: "Amount cannot be greater than non-paid amount / due amount",
//       });
//     }
//     await Entry.create({
//       userId: id,
//       amount: amount,
//       type: "Payment",
//       quantity: 0,
//       date: new Date(),
//       isPaid: true,
//     });
//     client.paidAmount += amount;
//     if (client.nonPaidAmount - amount < 0) {
//       client.nonPaidAmount = 0 as any;
//     } else {
//       client.nonPaidAmount = (client.nonPaidAmount - amount).toFixed(2) as any;
//     }
//     await client.save();
//     // await sendSMS(
//     //   String(client.phoneNumber),
//     //   `Dear customer, we have received your payment of ₹${amount}. Your remaining due amount is ₹${client.nonPaidAmount}. Thank you!`,
//     //   (req as any).user.id,
//     // );
//     session.commitTransaction();
//     session.endSession();

//     res.json({ message: "Client updated successfully", data: client });
//   } catch (error: any) {
//     session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ message: "Server error", error });
//   }
// };

export const deleteClient = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Client ID is required" });
  }
  const result = await deleteClientService(String(id));
  if (!result.success) {
    return res.status(404).json({ message: result.error });
  }
  return res.json({ message: "Client deleted successfully" });
};

export const exportExcel = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const data = await Client.find({ authId: (req as any).user.id }).populate(
      "entries",
    );

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Clients");

    worksheet.columns = [
      { header: "Username", key: "username", width: 30 },
      { header: "Phone Number", key: "phoneNumber", width: 20 },
      { header: "Vehicle Number", key: "vehicle", width: 20 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Paid Amount", key: "paidAmount", width: 15 },
      { header: "Non-Paid Amount", key: "nonPaidAmount", width: 15 },
      { header: "Total Quantity", key: "totalQuantity", width: 15 },
      { header: "GST Number", key: "gstNumber", width: 20 },
      { header: "Address", key: "address", width: 30 },
    ];

    worksheet.addRows(
      data.map((client) => ({
        username: client.username,
        phoneNumber: client.phoneNumber,
        vehicle: client.vehicle,
        createdAt: client.createdAt,
        email: client.email,
        paidAmount: client.paidAmount,
        nonPaidAmount: client.nonPaidAmount,
        totalQuantity: client.totalQuantity,
        gstNumber: client.gstNumber,
        address: client.address,
      })),
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=clients_${"Clients" + Date.now()}.xlsx`,
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting Excel:", error);
    res.status(500).json({ message: "Server error" });
  }
};
