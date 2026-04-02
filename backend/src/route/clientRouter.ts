// // Client Management
// GET    /api/clients              // List all clients
// GET    /api/clients/:id          // Get single client
// POST   /api/clients              // Create client
// PUT    /api/clients/:id          // Update client
// PATCH    /api/clients/:id          // Update client

import express from "express";
import authMiddleware from "../middleware/auth.middleware.ts";
import { getAllClients, getClientById, createClient, updateClient, deleteClient, createClientBulk } from "../controller/clientController.ts";


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
	*                   username:
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
 *               totalAmount:
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
clientRouter.post("/create/bulk", createClientBulk);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:     
 *                 type: string
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
 *               totalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
clientRouter.patch("/:id", updateClient);

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


export default clientRouter;