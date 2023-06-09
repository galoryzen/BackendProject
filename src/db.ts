import mongoose from 'mongoose';
import { MONGODB_URI } from './config';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}