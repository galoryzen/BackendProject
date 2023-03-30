import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
