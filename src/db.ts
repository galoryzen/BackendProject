import mongoose from 'mongoose';
import { MONGODB_URI } from './config';

mongoose.plugin((schema) => {
  schema.pre('find', function () {
    this.where({ status: { $ne: false } });
  });
});

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}