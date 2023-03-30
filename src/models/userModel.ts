import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    cellphone: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const User = mongoose.model('User', userSchema);
