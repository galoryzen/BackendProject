import { Router } from 'express';
import { User } from '../models/user';

const router = Router();

// POST endpoint to create a user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

// GET endpoint to retrieve user information by email and password or user ID
router.get('/', async (req, res) => {
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
});

//GET endpoint to retrieve all users
router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
