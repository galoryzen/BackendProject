import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        category: { type: String, required: true },
        status: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        strict: true,
    }
);

export const Product = mongoose.model("Product", productSchema);