import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to MONGODB", error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    // console.log("MongoDB disconnected");
  } catch (error) {
    console.error(`Error disconnecting MongoDB: ${error.message}`);
    process.exit(1);
  }
};
