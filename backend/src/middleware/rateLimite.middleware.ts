// import express from "express";
// import jwt from "jsonwebtoken";

// export const rateLimiter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(401).json({ message: "Unauthorized: No token provided." });
//     }
    
//     const token = authHeader.split(" ")[1];

//     try {
//         const decoded = await jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        
//         next();
//     } catch (error) {
//         res.status(403).json({
//             message: "Forbidden: Invalid token.",
//         });
//     }
// }