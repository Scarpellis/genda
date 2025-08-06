process.env.JWT_SECRET = 'testsecret';

const request = require('supertest');
const app = require('../src/config/app');

describe('POST /users', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'User One',
        email: 'user1@example.com',
        phone: '1234567890',
        password: 'password1',
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      name: 'User One',
      email: 'user1@example.com',
      phone: '1234567890',
    });
  });
});

describe('POST /login', () => {
  it('should authenticate an existing user', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'User Two',
        email: 'user2@example.com',
        phone: '0987654321',
        password: 'password2',
      });

    const res = await request(app)
      .post('/login')
      .send({ email: 'user2@example.com', password: 'password2' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
