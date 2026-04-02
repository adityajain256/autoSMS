import express from "express";
import User from "../model/User.ts";
import Entry from "../model/Entry.ts";


export const getStatistics = async (req: express.Request, res: express.Response) => {
    try {
        const totalUser = await User.countDocuments();
        return res.status(200).json(totalUser)
    } catch (error) {
        return res.status(500).json({message: "server error"})
    }
}