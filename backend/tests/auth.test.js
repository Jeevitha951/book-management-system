const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.collection('users').deleteMany({ email: /testuser/i });
  await mongoose.connection.close();
});

describe('Auth Tests', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'password123';

  it('should register a new user', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'Test User',
      email: testEmail,
      password: testPassword,
    });

    console.log('REGISTER RESPONSE:', res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('should login with correct credentials', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: testEmail,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
  });
});
