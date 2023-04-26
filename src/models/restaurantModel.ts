import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
