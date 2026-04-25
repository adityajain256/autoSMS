import mongoose from "mongoose";

const DBconnection = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/autoSMS",
    );
  } catch (error) {
    
    throw new Error("Failed to connect to the database: " + (error as Error).message);

  }
};

export default DBconnection;
