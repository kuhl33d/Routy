import mongoose from 'mongoose';
import { config } from './config.js';

mongoose.set('strictQuery', false);

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};