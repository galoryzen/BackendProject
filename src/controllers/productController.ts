import { Product } from "../models/productModel";
import { Request, Response } from 'express';
import mongoose from 'mongoose';

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
            return res.status(404).send('Invalid restaurant ID');
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
    const { restaurant, category } = req.query;
    const query = { ...(restaurant && { restaurant }), ...(category && { category }) };

    try {
        const products = await Product.find(query).populate("restaurant");
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
            return res.status(404).send('Invalid restaurant ID');
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
            return res.status(404).send('Invalid restaurant ID');
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

export { createProduct, getProductById, getProducts, updateProduct, deleteProduct };
