import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.delete('/clear-database', async (req, res) => {
  try {
    await mongoose.connection.db.dropDatabase();
    res.send({ message: 'Database cleared' });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
