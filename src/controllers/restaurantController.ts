import { Restaurant } from '../models/restaurantModel';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export async function createRestaurant(req: Request, res: Response) {
    try {
        const restaurant = new Restaurant(req.body);
        await restaurant.save();
        res.status(201).send(restaurant);
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
}

export async function getRestaurant(req: Request, res: Response) {
    try {
        const { name, category } = req.query;
        const restaurants = await Restaurant.find({ name: name, category: category });
        res.send(restaurants);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

export async function getAllRestaurants(req: Request, res: Response) {
    try {
        const restaurants = await Restaurant.find();
        res.send(restaurants);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

export async function updateRestaurant(req: Request, res: Response) {
    try {
        throw new Error('Sin implementar');
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

export async function deleteRestaurant(req: Request, res: Response) {
    try {
        throw new Error('Sin implementar');
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

