// Tax Entry Management
// GET    /api/entries              // List all entries (with filters)
// GET    /api/entries/:id          // Get single entry
// GET    /api/entries/client/:clientId  // Get entries by client
// POST   /api/entries              // Create new entry (triggers SMS)
// PUT    /api/entries/:id          // Update entry
// DELETE /api/entries/:id          // Delete entry

import express from "express";
import authMiddleware from "../middleware/auth.middleware.ts";
import { getAllEntries, createEntry, getEntryByClientId, updateDue } from "../controller/entryController.ts";

const entryRouter = express.Router();

entryRouter.use(authMiddleware);

/**
 * @swagger
 * /api/entries:
 *   get:
 *     summary: Retrieve a list of entries
 *     tags: [Entries]
 *     responses:
 *       200:
 *         description: A list of entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   amount:
 *                     type: number
 *                   message:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No entries found
 *       500:
 *         description: Server error
 */
entryRouter.get("/", getAllEntries);

/**
 * @swagger
 * /api/entries/client/{clientId}:
 *   get:
 *     summary: Retrieve entries for a specific client
 *     tags: [Entries]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The client ID
 *     responses:
 *       200:
 *         description: A list of entries for the client
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   amount:
 *                     type: number
 *                   message:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error    
 */
entryRouter.get("/client/:clientId", getEntryByClientId);
/**
 * @swagger
 * /api/entries/{clientId}:
 *   post:
 *     summary: Create a new entry
 *     tags: [Entries]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - quantity
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               amount:
 *                 type: number
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     amount:
 *                       type: number
 *                     message:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
*/

entryRouter.post("/:clientId", createEntry);

/**
 * @swagger
 * /api/entries/{id}:
 *   patch:
 *     summary: Update the due status of an entry
 *     tags: [Entries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The entry ID
 *     responses:
 *       200:
 *         description: Due updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Server error
 */
entryRouter.patch("/:id", updateDue);

export default entryRouter;