import express from 'express';
import { connectDB } from './db';
import userRoutes from './routes/userRoutes';
import testingRoutes from './routes/testingRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use('/user', userRoutes);
app.use('/testing', testingRoutes);

app.get('/', (req, res) => {
  res.send('Hello, TypeScript and Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
