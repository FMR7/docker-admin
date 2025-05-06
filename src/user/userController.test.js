const request = require('supertest');
const express = require('express');
const session = require('express-session');
const userRoutes = require('./userController');

jest.mock('./userService');
const userService = require('./userService');

const app = express();
app.use(express.json());

// ✅ Add session middleware
app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: true,
}));

// ✅ Use route
app.use('/', userRoutes);

describe('User Controller', () => {
  it('should return 200 on successful login', async () => {
    userService.signin.mockResolvedValue({ username: 'test', active: true, admin: false });

    const res = await request(app).post('/usuario/login').send({
      username: 'test',
      password: 'pass',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 on failed login', async () => {
    userService.signin.mockRejectedValue(new Error('Invalid password'));

    const res = await request(app).post('/usuario/login').send({
      username: 'wrong',
      password: 'fail',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});
