import { Order } from "../models/orderModel";
import { User } from "../models/userModel";
import { Request, Response } from 'express';
import mongoose from 'mongoose';

const createOrder = async (req: Request, res: Response) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).send(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Invalid order ID');
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).send('Order not found');
        }

        res.status(200).send(order);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }

};

const getOrders = async (req: Request, res: Response) => {
    try {
        const { user, restaurant, startDate, endDate, deliveryStatus } = req.query;

        const query: any = {};

        if (user) {
            query.user = user;
        }

        if (restaurant) {
            query.restaurant = restaurant;
        }

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string),
            };
        }

        if (deliveryStatus) {
            query.deliveryStatus = deliveryStatus;
        }

        const orders = await Order.find(query);

        res.send(orders);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

const getOrdersEnviados = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ deliveryStatus: "Enviado" });

        res.send(orders);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

const updateOrderItems = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { items } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Invalid order ID');
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).send('Order not found');
        }

        if (order.deliveryStatus !== "Creado"){
            return res.status(404).send('Order not available for update');
        }

        order.items = items;

        //Lo hacemos de esta manera porque necesitamos hacer trigger del middleware de save
        //Si lo hacemos con findByIdAndUpdate no se ejecuta el middleware
        await order.save();

        res.send(order);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { deliveryStatus} = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Invalid order ID');
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).send('Order not found');
        }

        order.deliveryStatus = deliveryStatus;

        //Hacemos trigger del middleware de save
        await order.save();

        //add a notification to the user
        const user = await User.findById(order.user);
        if(!user){
            return res.status(404).send('User not found');
        }

        user.notifications.push({ message: `Tu orden ${order._id} ha sido ${deliveryStatus}`, read: false });
        user.save();

        res.send(order);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

const deleteOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Invalid order ID');
        }

        const order = await Order.findByIdAndUpdate(id, { status: false }, { new: true });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

export { createOrder, getOrderById, getOrders, getOrdersEnviados, updateOrderItems, updateOrderStatus, deleteOrder };
