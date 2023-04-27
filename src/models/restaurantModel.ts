import mongoose from 'mongoose';
import statusFilterPlugin from '../statusFilterPlugin';

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

restaurantSchema.plugin(statusFilterPlugin);
export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
