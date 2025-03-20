import express from 'express';
import { setupSwagger } from './config/swagger';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import { createError, errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';

dotenv.config();

const app = express();
setupSwagger(app);

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productsRoutes);

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.use((req, res, next) => {
  next(createError('Route not found', 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
