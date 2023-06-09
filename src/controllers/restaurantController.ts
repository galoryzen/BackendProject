import { Restaurant } from '../models/restaurantModel';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/productModel';

export async function createRestaurant(req: Request, res: Response) {
    try {
        const restaurant = new Restaurant({ ...req.body, distance: Math.floor(Math.random() * 1000) });
        await restaurant.save();
        res.status(201).send(restaurant);
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
}

export async function getRestaurant(req: Request, res: Response) {
    try {
        const { name, category } = req.query;
        const query = {
            ...(name && { name: { $regex: name, $options: 'i' } }),
            ...(category && { category })
        };

        const restaurants = await Restaurant.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "restaurant",
                    as: "orders"
                }
            },
            {
                $addFields: {
                    popularity: {
                        $size: "$orders"
                    }
                }
            },
            {
                $sort: {
                    popularity: -1
                }
            }
        ]);

        res.send(restaurants);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

export async function getRestaurantById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Invalid restaurant ID');
        }

        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).send('Restaurant not found');
        }

        const products = await Product.find({ restaurant: id });

        res.send({
            restaurant,
            products,
        });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

export async function updateRestaurant(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send('Body is empty');
        }

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Invalid restaurant ID');
        }

        const { name, address, category } = req.body;

        const restaurant = await Restaurant.findByIdAndUpdate(
            id,
            { name, address, category },
            { new: true }
        );

        if (!restaurant) {
            return res.status(404).send('Restaurant not found');
        }

        res.send(restaurant);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

export async function deleteRestaurant(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Invalid restaurant ID');
        }

        const restaurant = await Restaurant.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        );

        if (!restaurant) {
            return res.status(404).send('Restaurant not found');
        }

        res.send(restaurant);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

