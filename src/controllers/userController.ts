import { User } from '../models/userModel';
import { Request, Response } from 'express';
import mongoose from 'mongoose';


export async function createUser(req: Request, res: Response) {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const { email, password, userId } = req.query;

        let user;
        if (email && password) {
            user = await User.findOne({ email, password });
        } else if (userId) {
            user = await User.findById(userId);
        } else {
            return res.status(400).send({ error: 'Invalid query parameters' });
        }

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.send(user);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

//function to update user, it will update the user with the given id from params
export async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Invalid user ID');
        }

        const { email, name, password, cellphone, address } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { email, name, password, cellphone, address },
            { new: true }
        );

        if (!user) {
            return res.status(404).send('User not found');
        }

        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Invalid user ID');
        }

        //Do a soft delete, just change the status to false

        const user = await User.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}