import express from "express";
import excel from "exceljs";
import {
  createClientService,
  deleteClientService,
  getAllClientsService,
  getClientByIdService,
  getClientService,
  updateClientAmountService,
} from "../service/clientService.js";
import type { IClient } from "../types/index.js";
import logger from "../utils/logger.js";
import Client from "../model/Client.js";

export const getAllClients = async (
  req: express.Request,
  res: express.Response,
) => {
  const limit = parseInt(req.query.limit as string) || 12;
  const page = parseInt(req.query.page as string) || 1;
  const skip = (page - 1) * limit;
  try {
    const authId = (req as any).user.id;
    const clients = await getAllClientsService(authId, skip, limit);
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

export const deleteClient = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Client ID is required" });
  }
  const result = await deleteClientService(
    String(id),
    String((req as any).user.id),
  );
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

export const updateAmount = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (!id) {
    logger.error("Client ID is required for updating amount.");
    return res.status(400).json({ message: "Client ID is required" });
  }
  if (!amount) {
    logger.error("Amount is required for updating amount.");
    return res.status(400).json({ message: "Amount is required" });
  }
  try {
    const result = await updateClientAmountService(String(id), Number(amount));
    if (!result.success) {
      return res.status(400).json({ message: result.error });
    }
    res.json({ message: "Amount updated successfully", data: result });
  } catch (error) {
    logger.error(`Error updating amount: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClient = async (
  req: express.Request,
  res: express.Response,
) => {
  const { phoneNumber, vehicleId, email } = req.query;
  console.log("Received query parameters:", { phoneNumber, vehicleId, email });
  try {
    logger.info({
      message: "Fetching client information",
      query: { phoneNumber, vehicleId, email },
    });
    const clientId = await getClientService(
      String(phoneNumber) || "",
      String(vehicleId) || "",
      String(email) || "",
    );
    if (!clientId.success) {
      return res.status(404).json({ message: clientId.error });
    }

    res.status(200).json(clientId.data);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
