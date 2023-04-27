import mongoose from "mongoose";
import statusFilterPlugin from "../statusFilterPlugin";

const orderSchema = new mongoose.Schema(
    {
        restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
            },
        ],
        status: { type: String, required: true, default: "pending" },
        deliveryStatus: { type: String, required: true, default: "Creado" },
        deliveryUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        total: { type: Number, required: true },
    },
    {
        timestamps: true,
        strict: true,
    }
);

orderSchema.plugin(statusFilterPlugin);
export const Order = mongoose.model("Order", orderSchema);