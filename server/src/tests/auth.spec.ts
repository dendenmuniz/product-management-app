import request from 'supertest';
import { createTestServer } from './utils/testServer';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});
let app: ReturnType<typeof createTestServer>;
const mockPrisma = jest.mocked(new PrismaClient());

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
  genSalt: jest.fn().mockResolvedValue('mocked-salt'),
}));

beforeAll(() => {
  app = createTestServer();
  jest.spyOn(console, 'error').mockImplementation((msg) => {});
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Auth  API - Registration', () => {
  it('should create a new user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    mockPrisma.user.create.mockResolvedValue({
      id: 'fake-id',
      name: 'Test User',
      email: 'tuser@example.com',
      password: 'hashedPassword',
      role: 'seller',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app).post('/auth/register').send({
      name: 'User',
      email: 'user@example.com',
      password: 'Password123#',
      role: 'seller',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
  });
  it('should return 400 if duplicate e-mail', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'fake-id' } as any);

    const res = await request(app).post('/auth/register').send({
      name: 'Test User 2',
      email: 'testuser@test.com',
      password: 'hashed-password',
      role: 'seller',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('should return 400 if invalid e-mail', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Test User',
      email: 'testuser',
      password: 'hashed-password',
      role: 'seller',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid data');
    expect(res.body.details.email._errors).toContain('Invalid email format');
  });

  it('should return 400 if invalid role', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Test User',
      email: 'testuser@test.com',
      password: 'hashed-password',
      role: 'client',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid data');
    expect(res.body.details.role._errors).toContain(
      "Invalid enum value. Expected 'seller' | 'admin', received 'client'",
    );
  });

  it('should return 400 if invalid password', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Test User',
      email: 'testuser@test.com',
      password: '123',
      role: 'seller',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid data');
    expect(res.body.details.password._errors).toContain('Password must have at least 8 characters');
  });

  it('should return 400 if invalid name', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Te',
      email: 'testuser@test.com',
      password: 'hashed-password',
      role: 'seller',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid data');
    expect(res.body.details.name._errors).toContain('Name must have at least 3 characters');
  });

  it('should return 400 and validation details if required fields are missing', async () => {
    const res = await request(app).post('/auth/register').send({
      email: 'invalid-email',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid data');
    expect(res.body.details.name._errors).toContain('Name is required');
    expect(res.body.details.email._errors).toContain('Invalid email format');
    expect(res.body.details.password._errors).toContain('Password is required');
    expect(res.body.details.role._errors).toContain('Role is required');
  });
});

describe('Auth API - Login', () => {
  it('should login a user', async () => {
    const hashedPassword = await bcrypt.hash('Password123#', 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'fake-id',
      email: 'testuser@test.com',
      password: hashedPassword,
      role: 'seller',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const res = await request(app).post('/auth/login').send({
      email: 'testuser@test.com',
      password: 'Password123#',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  it('should return 400 if invalid credentials', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app).post('/auth/login').send({
      email: 'nonexistent@test.com',
      password: 'Password123#',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
  it('should return 400 if invalid password', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'fake-id',
      email: 'testuser@test.com',
      password: 'some-hashed-password',
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const res = await request(app).post('/auth/login').send({
      email: 'testuser@test.com',
      password: 'wrong-password',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
