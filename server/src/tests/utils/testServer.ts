import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from '../../middlewares/errorHandler';
import authRoutes from '../../routes/auth';
import productsRoutes from '../../routes/products';

export const createTestServer = () => {
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  app.use('/auth', authRoutes);
  app.use('/products', productsRoutes);

  app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use(errorHandler);

  return app;
};
