import { Product } from "../models/productModel";
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Restaurant } from "../models/restaurantModel";

const createProduct = async (req: Request, res: Response) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Invalid product ID');
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.send(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const getProducts = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { category } = req.query;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    const query = { restaurant: restaurant._id, ...(category && { category }) };

    try {
        const products = await Product.aggregate([
            { $match: query },
            { $group: { _id: "$category", products: { $push: "$$ROOT" } } }
        ]);
        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send('Body is empty');
        }

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Invalid product ID');
        }

        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.send(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Invalid product ID');
        }
        const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export { createProduct, getProductById, getProducts, updateProduct, deleteProduct, getAllProducts };
