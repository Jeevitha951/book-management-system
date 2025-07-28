jest.setTimeout(20000); 

const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const User = require('../models/User');

let adminToken, userToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Book.deleteMany({});

  const adminRes = await request(app).post('/api/users/register').send({
    name: 'Admin',
    email: 'admin@example.com',
    password: 'adminpass',
    role: 'admin'
  });
  adminToken = adminRes.body.token;

  const userRes = await request(app).post('/api/users/register').send({
    name: 'User',
    email: 'user@example.com',
    password: 'userpass',
    role: 'user'
  });
  userToken = userRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('RBAC Tests', () => {
  it('Admin should be able to add a book', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Admin Book',
        author: 'Admin Author',
        description: 'Book added by admin',
        publishedYear: 2024
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Admin Book');
  });

  it('Regular user should NOT be able to add a book', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'User Book',
        author: 'User Author',
        description: 'Book by user',
        publishedYear: 2024
      });

    expect(res.statusCode).toBe(403); 
  });

  it('Any user can view books', async () => {
    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${userToken}`); 

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
