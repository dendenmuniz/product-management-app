import request from 'supertest';
import { createTestServer } from './utils/testServer';

let app: ReturnType<typeof createTestServer>;

beforeAll(() => {
    app = createTestServer();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('Products API', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@test.com',
        password: 'password',
        role: 'seller'});
        expect(res.status).toBe(201);
        expect(res.body.token).toBeTruthy();
  }); 
  it('should return 400 if duplicate e-mail', async () => {
    const res = await request(app).get('/auth/register')
    .send({
      name: 'Test User 2',
      email: 'testuser@test.com',
      password: 'password2',
      role: 'seller'});
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('User already exists');
  });

 
});