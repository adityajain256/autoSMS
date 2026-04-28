import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createClient,
  getAllClients,
  getClientById,
  deleteClient,
  exportExcel,
} from "../controller/clientController.js";

const clientRouter = express.Router();

clientRouter.use(authMiddleware);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Retrieve a list of clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: A list of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   userName:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   address:
 *                     type: string
 *                   gstNumber:
 *                     type: string
 *                   email:
 *                     type: string
 *       404:
 *         description: No clients found
 *       500:
 *         description: Server error
 */
clientRouter.get("/", getAllClients);
/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Retrieve a single client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: single client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   address:
 *                     type: string
 *                   gstNumber:
 *                     type: string
 *                   email:
 *                     type: string
 *                   totalAmount:
 *                     type: number
 *       404:
 *         description: No clients found
 *       500:
 *         description: Server error
 */

clientRouter.get("/:id", getClientById);

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               paidAmount:
 *                 type: number
 *               nonPaidAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   address:
 *                     type: string
 *                   gstNumber:
 *                     type: string
 *                   email:
 *                     type: string
 *                   totalAmount:
 *                     type: number
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

clientRouter.post("/", createClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
clientRouter.delete("/:id", deleteClient);

/**
 * @swagger
 * /api/clients/export/excel:
 *   get:
 *     summary: Export clients data to Excel
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Excel file generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Server error
 */
clientRouter.get("/export/excel", exportExcel);
export default clientRouter;
