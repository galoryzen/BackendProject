// index.ts
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import { TypeboxError } from 'typebox-express-middleware';
import { User } from './models/userModel';
import { Order } from './models/orderModel';
import { Restaurant } from './models/restaurantModel';
import { Product } from './models/productModel';

const app = express();

app.use(express.json());
app.use('/user', userRoutes);
app.use('/restaurant', restaurantRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

app.get('/delete', async (req, res) => {
  await User.deleteMany({});
  await Order.deleteMany({});
  await Restaurant.deleteMany({});
  await Product.deleteMany({});
  res.status(200).json({ message: 'Deleted all data!' });
});

app.use((error: Error | TypeboxError, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof TypeboxError) {
    return res.status(400).json(error);
  } else {
    return res.status(500).json(error);
  }
});

export default app;
