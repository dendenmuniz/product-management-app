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
const apiRouter = express.Router();

setupSwagger(app);

app.use(cors());
app.use(helmet());
app.use(express.json());

apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productsRoutes);

// Use /api prefix for the whole group
app.use('/api', apiRouter);

app.get('/api', (req, res) => {
  res.send('API is running!');
});


app.use((req, res, next) => {
  next(createError('Route not found', 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
