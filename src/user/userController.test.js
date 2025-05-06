const request = require('supertest');
const express = require('express');
const session = require('express-session');
const userRoutes = require('./userController');

jest.mock('./userService');
jest.mock('express-session');
const mockSession = require('../testUtils/mockSessionMiddleware');
require('express-session').mockImplementation(mockSession);
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

describe('Login', () => {
  it('should return 200 on successful login', async () => {
    mockSession.setSession({});
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

  it('should return 400 if username is missing', async () => {
    const res = await request(app).post('/usuario/login').send({
      password: 'pass',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Username required');
  });

  it('should return 400 if password is missing', async () => {
    const res = await request(app).post('/usuario/login').send({
      username: 'test',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Password required');
  });
});

describe('Register', () => {
  it('should return 200 on successful register', async () => {
    userService.signup.mockResolvedValue({ username: 'test', active: true, admin: false });

    const res = await request(app).post('/usuario/register').send({
      username: 'test',
      password: 'pass',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 400 if username is missing', async () => {
    const res = await request(app).post('/usuario/register').send({
      password: 'pass',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Username required');
  });

  it('should return 400 if password is missing', async () => {
    const res = await request(app).post('/usuario/register').send({
      username: 'test',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Password required');
  });

  it('should return 400 if username already exists', async () => {
    userService.getUserByUsername.mockResolvedValue({username: 'test'});

    const res = await request(app).post('/usuario/register').send({
      username: 'test',
      password: 'pass',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('should return 500 if error', async () => {
    userService.getUserByUsername.mockRejectedValue(new Error('Some error'));

    const res = await request(app).post('/usuario/register').send({
      username: 'test',
      password: 'pass',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.ok).toBe(false);
  });
});

describe('Delete User', () => {
  it('should return 200 on successful delete', async () => {
    userService.deleteUser.mockResolvedValue({ username: 'test', active: true, admin: true });

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).delete('/usuario/test');

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if error', async () => {
    userService.deleteUser.mockRejectedValue(new Error('Some error'));

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).delete('/usuario/test');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  it('should return 401 if not authenticated', async () => {
    mockSession.setSession({});

    const res = await request(app).delete('/usuario/test');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not authenticated');
  });

  it('should return 401 if not admin', async () => {
    mockSession.setSession({ user: { username: 'test', admin: false } });

    const res = await request(app).delete('/usuario/test');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });
});
