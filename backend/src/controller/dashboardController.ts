import express from "express";
import User from "../model/User.ts";
import Entry from "../model/Entry.ts";
import { error } from "console";


export const getStatistics = async (req: express.Request, res: express.Response) => {
    try {
        const totalUser = await User.countDocuments();
        const totalEntries = await Entry.countDocuments();
        if(totalUser === 0){
            return res.status(200).json({ totalUser: 0, totalEntries: 0, totalAmount: 0, totalQuantity: 0 });
        }
        const totalAmount = await Entry.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]); 
        const totalQuantity = await Entry.aggregate([
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);
        return res.status(200).json({ totalUser, totalEntries, totalAmount: totalAmount[0]?.total || 0, totalQuantity: totalQuantity[0]?.total || 0 });
    } catch (error) {
        return res.status(500).json({message: "server error"})
    }
}