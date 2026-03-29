import express from 'express';
import jwt from 'jsonwebtoken';


const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token: string = authHeader.split(' ')[1] || "";
    if(token === ""){
        return res.status(401).json({ message: 'Unauthorized: No token provided' });   
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET    || "adityajain256@");
        (req as any).user = decoded; // Attach user info to request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export default authMiddleware;