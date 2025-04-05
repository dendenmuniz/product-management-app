import express from 'express';
import { setupSwagger } from './config/swagger';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import { createError, errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import productsRoutes from './routes/productRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);

app.get('/api', (req, res) => {
  res.send('API is running!');
});


app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next(createError('Route not found', 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
