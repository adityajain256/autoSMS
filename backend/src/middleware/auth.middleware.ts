import express from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Authorization header missing or malformed.");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token: string = authHeader.split(" ")[1] || "";
  if (token === "") {
    console.error("No token provided in the Authorization header.");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error("JWT secret key is not defined in environment variables.");
      return res.status(500).json({ message: "Internal Server Error" });
    }
    const decoded = jwt.verify(token, secretKey);
    (req as any).user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    console.error("Invalid token.");

    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
