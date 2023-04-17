// index.ts
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoutes';
import testingRoutes from './routes/testingRoutes';
import { TypeboxError } from 'typebox-express-middleware';

const app = express();

app.use(express.json());
app.use('/user', userRoutes);
app.use('/testing', testingRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

app.use((error: Error | TypeboxError, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof TypeboxError) {
    return res.status(400).json(error);
  } else {
    return res.status(500).json(error);
  }
});

export default app;