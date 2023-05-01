import mongoose from "mongoose";
import statusFilterPlugin from "../statusFilterPlugin";
import { Product } from "./productModel";

const orderSchema = new mongoose.Schema(
    {
        restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true },
            },
        ],
        deliveryStatus: { type: String, required: true, default: "Creado" },
        deliveryUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        total: { type: Number},
        status: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        strict: true,
    }
);

orderSchema.plugin(statusFilterPlugin);
orderSchema.pre("save", async function (this, next){
    const items = this.items;
    let total = 0;

    for(const item of items) {
        const product = await Product.findById(item.product);
        if(!product) {
            throw new Error("Product not found");
        }
        total += product.price * item.quantity;
    }

    this.total = total;
    next();
})

export const Order = mongoose.model("Order", orderSchema);