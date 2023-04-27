import mongoose from 'mongoose';
import statusFilterPlugin from '../statusFilterPlugin';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    cellphone: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: Boolean, default: true },
    role: { type: String, required: true, default: 'user' }
  },
  {
    timestamps: true,
    strict: true,
  }
);

userSchema.plugin(statusFilterPlugin);
export const User = mongoose.model('User', userSchema);
