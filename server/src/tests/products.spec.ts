import request from 'supertest';
import { createTestServer } from './utils/testServer';
import { PrismaClient, Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.test' });

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    product: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

let app: ReturnType<typeof createTestServer>;
const mockPrisma = jest.mocked(new PrismaClient());

const JWT_SECRET = process.env.JWT_SECRET as string;

const generateToken = (id: string, role: string) =>
  jwt.sign({ id, email: `${id}@test.com`, role }, JWT_SECRET);

beforeAll(() => {
  app = createTestServer();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Products API', () => {
  describe('GET /products', () => {
    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized - Missing or malformed token');
    });

    it('should return 401 if an invalid token is provided', async () => {
      const res = await request(app).get('/products').set('Authorization', 'Bearer invalid_token');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized - Invalid token');
    });

    it('should return 401 if an invalid and no Bearer token is provided', async () => {
      const res = await request(app).get('/products').set('Authorization', 'invalid_token');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized - Missing or malformed token');
    });

    it('should return 200 and an array of products', async () => {
      const token = generateToken('user-123', 'seller');

      mockPrisma.product.findMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'Product 1',
          description: 'Test product 1',
          price: 10 as unknown as Prisma.Decimal,
          stock: 100,
          userId: 'user-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const res = await request(app).get('/products').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          id: 'prod-1',
          name: 'Product 1',
          description: 'Test product 1',
          price: 10,
          stock: 100,
          userId: 'user-123',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });

    it('should return 200 and a valid product', async () => {
      const token = generateToken('user-123', 'seller');
      const validProductId = uuidv4();

      mockPrisma.product.findUnique.mockResolvedValue({
        id: validProductId,
        name: 'Product 1',
        description: 'Test product 1',
        price: 10 as unknown as Prisma.Decimal,
        stock: 100,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .get(`/products/${validProductId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: validProductId,
        name: 'Product 1',
        description: 'Test product 1',
        price: 10,
        stock: 100,
        userId: 'user-123',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 400 if the ID is not a valid UUID', async () => {
      const token = generateToken('user-123', 'seller');
      const invalidProductId = '12345';

      const res = await request(app)
        .get(`/products/${invalidProductId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid product ID');
    });

    it('should return 404 if the product does not exist', async () => {
      const token = generateToken('user-123', 'seller');
      const nonExistentId = uuidv4();

      mockPrisma.product.findUnique.mockResolvedValue(null);
      const res = await request(app)
        .get(`/products/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });
  });
  describe('POST /products', () => {
    it('should return 201 and create a new product', async () => {
      const token = generateToken('user-123', 'seller');

      mockPrisma.product.create.mockResolvedValue({
        id: 'prod-1',
        name: 'Product 1',
        description: 'Test product 1',
        price: 10 as unknown as Prisma.Decimal,
        stock: 100,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Product 1',
          description: 'Test product 1',
          price: 10,
          stock: 100,
        });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        id: 'prod-1',
        name: 'Product 1',
        description: 'Test product 1',
        price: 10,
        stock: 100,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        userId: 'user-123',
      });
    });

    it('should return 400 and require product name', async () => {
      const token = generateToken('user-123', 'seller');

      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
          description: 'Test product 1',
          price: 10,
          stock: 100,
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.details.fieldErrors.name).toContain('Name must have at least 3 characters');
    });

    it('should return 400 and require price greater than zero', async () => {
      const token = generateToken('user-123', 'seller');

      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test product 1',
          description: 'Test product 1',
          price: 0,
          stock: 100,
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.details.fieldErrors.price).toContain('Price must be greater than zero');
    });

    it('should return 400 and require stock greater than zero', async () => {
      const token = generateToken('user-123', 'seller');

      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test product 1',
          description: 'Test product 1',
          price: 10,
          stock: -1,
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.details.fieldErrors.stock).toContain('Stock cannot be negative');
    });

    it('should return 403 when the user role is not seller', async () => {
      const token = generateToken('user-123', 'client');

      mockPrisma.product.create.mockResolvedValue({
        id: 'prod-1',
        name: 'Product 1',
        description: 'Test product 1',
        price: 10 as unknown as Prisma.Decimal,
        stock: 100,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Product 1',
          description: 'Test product 1',
          price: 10,
          stock: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user-123',
        });
      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Unauthorized - Only sellers can create products');
    });
  });

  describe('PUT /products/:id', () => {
    it('should return 200 and update a product', async () => {
      const token = generateToken('user-123', 'seller');
      const validProductId = uuidv4();

      mockPrisma.product.findUnique.mockResolvedValue({
        id: validProductId,
        name: 'Product 1',
        description: 'Test product 1',
        price: 10 as unknown as Prisma.Decimal,
        stock: 100,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockPrisma.product.update.mockResolvedValue({
        id: validProductId,
        name: 'Product 1',
        description: 'Test product 1 - update',
        price: 15 as unknown as Prisma.Decimal,
        stock: 50,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .put(`/products/${validProductId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test product 1 - update',
          price: 15,
          stock: 50,
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: validProductId,
        name: 'Product 1',
        description: 'Test product 1 - update',
        price: 15,
        stock: 50,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        userId: 'user-123',
      });
    });
    it('should return 400 and validation message', async () => {
      const token = generateToken('user-123', 'seller');
      const validProductId = uuidv4();

      mockPrisma.product.findUnique.mockResolvedValue({
        id: validProductId,
        name: 'Product 1',
        description: 'Test product 1',
        price: 10 as unknown as Prisma.Decimal,
        stock: 100,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .put(`/products/${validProductId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test product 1 - update',
          price: 0,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.details.fieldErrors.price).toContain('Price must be greater than zero');
    });

    it('should return 403 when logged user is not the owner of the product', async () => {
      const token = generateToken('user-122', 'seller');
      const validProductId = uuidv4();

      mockPrisma.product.findUnique.mockResolvedValue({
        id: validProductId,
        name: 'Product 1',
        description: 'Test product 1',
        price: 10 as unknown as Prisma.Decimal,
        stock: 100,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .put(`/products/${validProductId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test product 1 - update',
          price: 15,
          stock: 50,
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('Unauthorized - You can only update your own products');
    });

    it('should return 404 and invalid product id', async () => {
      const token = generateToken('user-123', 'seller');
      const nonExistentId = uuidv4();

      mockPrisma.product.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .put(`/products/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(404);
      expect(res.body.message).toEqual('Product not found');
    });
  });

  describe('DELETE /products/:id', () => {
    it('should return 200 and delete the product', async () => {
      const token = generateToken('user-123', 'seller');
      const validProductId = uuidv4();

      mockPrisma.product.findUnique.mockResolvedValue({
        id: validProductId,
        name: 'Product 1',
        description: 'Test product 1',
        price: 10 as unknown as Prisma.Decimal,
        stock: 100,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockPrisma.product.delete.mockResolvedValue({
        id: validProductId,
        name: 'Product 1',
        description: 'Test product 1',
        price: 10 as unknown as Prisma.Decimal,
        stock: 100,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .delete(`/products/${validProductId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Product deleted successfully' });
    });

    it('should return 403 Unauthorized', async () => {
      const token = generateToken('user-122', 'seller');
      const validProductId = uuidv4();

      mockPrisma.product.findUnique.mockResolvedValue({
        id: validProductId,
        name: 'Product 1',
        description: 'Test product 1',
        price: 10 as unknown as Prisma.Decimal,
        stock: 100,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .delete(`/products/${validProductId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: 'Unauthorized - You can only delete your own products',
      });
    });

    it('should return 404 and invalid product id', async () => {
      const token = generateToken('user-123', 'seller');
      const nonExistentId = uuidv4();

      mockPrisma.product.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .put(`/products/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(404);
      expect(res.body.message).toEqual('Product not found');
    });
  });
});
