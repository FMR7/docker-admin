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

const testPassword = 'testPassword';

describe('Login', () => {
  it('should return 200 on successful login', async () => {
    mockSession.setSession({});
    userService.signin.mockResolvedValue({ username: 'test', active: true, admin: false });

    const res = await request(app).post('/usuario/login').send({
      username: 'test',
      password: testPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 on failed login', async () => {
    userService.signin.mockRejectedValue(new Error('Invalid password'));

    const res = await request(app).post('/usuario/login').send({
      username: 'wrong',
      password: testPassword,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  it('should return 400 if username is missing', async () => {
    const res = await request(app).post('/usuario/login').send({
      password: testPassword,
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
      password: testPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 400 if username is missing', async () => {
    const res = await request(app).post('/usuario/register').send({
      password: testPassword,
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
      password: testPassword,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('should return 500 if error', async () => {
    userService.getUserByUsername.mockRejectedValue(new Error('Some error'));

    const res = await request(app).post('/usuario/register').send({
      username: 'test',
      password: testPassword,
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

describe('Users list', () => {
  it('should return 200 on successful list', async () => {
    userService.findAll.mockResolvedValue([{ username: 'test', active: true, admin: true }]);

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).get('/usuario');

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if error', async () => {
    userService.findAll.mockRejectedValue(new Error('Some error'));

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).get('/usuario');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  it('should return 401 if not authenticated', async () => {
    mockSession.setSession({});

    const res = await request(app).get('/usuario');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not authenticated');
  });

  it('should return 401 if not admin', async () => {
    mockSession.setSession({ user: { username: 'test', admin: false } });

    const res = await request(app).get('/usuario');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });
});

describe('Activate/Deactivate User', () => {
  it('should return 200 on successful activation', async () => {
    userService.setActive.mockResolvedValue({ username: 'test', active: true, admin: true });

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).put('/usuario/active/true/test');

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
  
  it('should return 200 on successful deactivation', async () => {
    userService.setActive.mockResolvedValue({ username: 'test', active: true, admin: true });

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).put('/usuario/active/false/test');

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if error', async () => {
    userService.setActive.mockRejectedValue(new Error('Some error'));

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).put('/usuario/active/true/test');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  it('should return 401 if not authenticated', async () => {
    mockSession.setSession({});

    const res = await request(app).put('/usuario/active/true/test');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not authenticated');
  });

  it('should return 401 if not admin', async () => {
    mockSession.setSession({ user: { username: 'test', admin: false } });

    const res = await request(app).put('/usuario/active/true/test');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });

  it('should return 400 if active is not true or false', async () => {
    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).put('/usuario/active/other/test');

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Active must be true or false');
  });
});

describe('Activate/Deactivate admin role', () => {
  it('should return 200 on successful activation', async () => {
    userService.setAdmin.mockResolvedValue({ username: 'test', active: true, admin: true });

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).put('/usuario/admin/true/test');

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
  
  it('should return 200 on successful deactivation', async () => {
    userService.setAdmin.mockResolvedValue({ username: 'test', active: true, admin: true });

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).put('/usuario/admin/false/test');

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if error', async () => {
    userService.setAdmin.mockRejectedValue(new Error('Some error'));

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).put('/usuario/admin/true/test');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  it('should return 401 if not authenticated', async () => {
    mockSession.setSession({});

    const res = await request(app).put('/usuario/admin/true/test');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not authenticated');
  });

  it('should return 401 if not admin', async () => {
    mockSession.setSession({ user: { username: 'test', admin: false } });

    const res = await request(app).put('/usuario/admin/true/test');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });

  it('should return 400 if admin is not true or false', async () => {
    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).put('/usuario/admin/other/test');

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Admin must be true or false');
  });
});

describe('Logout', () => {
  beforeEach(() => {
    mockSession.clearSession();
  });

  it('should return 200 on successful logout', async () => {
    mockSession.setSession({ user: { username: 'test', admin: false } });

    const res = await request(app).get('/usuario/logout');

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.message).toBe('Session closed');
  });

  it('should return 400 if no session exists', async () => {
    mockSession.setSession(null);

    const res = await request(app).get('/usuario/logout');

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('No active session to destroy');
  });
});
