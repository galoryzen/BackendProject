import mongoose from "mongoose";
import statusFilterPlugin from "../statusFilterPlugin";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
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

productSchema.plugin(statusFilterPlugin);
export const Product = mongoose.model("Product", productSchema);