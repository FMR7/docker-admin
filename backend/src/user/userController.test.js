const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const userRoutes = require('./userController');
const authJwt = require('../middleware/authJwt');
const csrfHeader = require('../middleware/csrfHeader');

jest.mock('./userService');
const userService = require('./userService');

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-with-secure-secret';

// Public routes (no auth required)
app.post('/usuario/login', (req, res, next) => {
  // extract just the login endpoint
  const router = require('./userController');
  router.stack.find(r => r.route && r.route.path === '/usuario/login')?.route.stack[0].handle(req, res, next);
});

app.post('/usuario/register', (req, res, next) => {
  const router = require('./userController');
  router.stack.find(r => r.route && r.route.path === '/usuario/register')?.route.stack[0].handle(req, res, next);
});

// Protected routes
const protectedRouter = express.Router();
protectedRouter.use(authJwt);
protectedRouter.use(csrfHeader);
protectedRouter.use('/', userRoutes);

app.use('/', protectedRouter);

const testPassword = 'testPassword';
const csrfToken = 'test-csrf-token-12345';

// Helper to generate JWT token
function generateToken(userData) {
  return jwt.sign({ ...userData, csrfToken }, JWT_SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256',
  });
}

describe('Login', () => {
  it('should return 200 on successful login', async () => {
    userService.signin.mockResolvedValue({ username: 'test', active: true, admin: false });

    const res = await request(app).post('/usuario/login').send({
      username: 'test',
      password: testPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.csrfToken).toBeDefined();
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

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .delete('/usuario/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if error', async () => {
    userService.deleteUser.mockRejectedValue(new Error('Some error'));

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .delete('/usuario/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .delete('/usuario/test')
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toContain('authorization');
  });

  it('should return 401 if not admin', async () => {
    const token = generateToken({ username: 'test', admin: false });

    const res = await request(app)
      .delete('/usuario/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });
});

describe('Users list', () => {
  it('should return 200 on successful list', async () => {
    userService.findAll.mockResolvedValue([{ username: 'test', active: true, admin: true }]);

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .get('/usuario')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if error', async () => {
    userService.findAll.mockRejectedValue(new Error('Some error'));

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .get('/usuario')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).get('/usuario');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toContain('authorization');
  });

  it('should return 401 if not admin', async () => {
    const token = generateToken({ username: 'test', admin: false });

    const res = await request(app)
      .get('/usuario')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });
});

describe('Activate/Deactivate User', () => {
  it('should return 200 on successful activation', async () => {
    userService.setActive.mockResolvedValue({ username: 'test', active: true, admin: true });

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .put('/usuario/active/true/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
  
  it('should return 200 on successful deactivation', async () => {
    userService.setActive.mockResolvedValue({ username: 'test', active: true, admin: true });

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .put('/usuario/active/false/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if error', async () => {
    userService.setActive.mockRejectedValue(new Error('Some error'));

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .put('/usuario/active/true/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .put('/usuario/active/true/test')
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toContain('authorization');
  });

  it('should return 401 if not admin', async () => {
    const token = generateToken({ username: 'test', admin: false });

    const res = await request(app)
      .put('/usuario/active/true/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });

  it('should return 400 if active is not true or false', async () => {
    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .put('/usuario/active/other/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Active must be true or false');
  });
});

describe('Activate/Deactivate admin role', () => {
  it('should return 200 on successful activation', async () => {
    userService.setAdmin.mockResolvedValue({ username: 'test', active: true, admin: true });

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .put('/usuario/admin/true/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
  
  it('should return 200 on successful deactivation', async () => {
    userService.setAdmin.mockResolvedValue({ username: 'test', active: true, admin: true });

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .put('/usuario/admin/false/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if error', async () => {
    userService.setAdmin.mockRejectedValue(new Error('Some error'));

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .put('/usuario/admin/true/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .put('/usuario/admin/true/test')
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toContain('authorization');
  });

  it('should return 401 if not admin', async () => {
    const token = generateToken({ username: 'test', admin: false });

    const res = await request(app)
      .put('/usuario/admin/true/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });

  it('should return 400 if admin is not true or false', async () => {
    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .put('/usuario/admin/other/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Admin must be true or false');
  });
});

describe('Logout', () => {
  it('should return 200 on successful logout', async () => {
    const token = generateToken({ username: 'test', admin: false });

    const res = await request(app)
      .get('/usuario/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).get('/usuario/logout');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toContain('authorization');
  });
});

describe('Logged User', () => {
  it('should return 200 on successful get logged user', async () => {
    const token = generateToken({ username: 'test', admin: false });

    const res = await request(app)
      .get('/usuario/logged')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if no token exists', async () => {
    const res = await request(app).get('/usuario/logged');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toContain('authorization');
  });
});

describe('Logged Admin', () => {
  it('should return 200 on successful get logged admin', async () => {
    const token = generateToken({ username: 'test', admin: true });

    const res = await request(app)
      .get('/usuario/admin')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if no session exists', async () => {
    const res = await request(app).get('/usuario/admin');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  it('should return 200 if not admin', async () => {
    const token = generateToken({ username: 'test', admin: false });

    const res = await request(app)
      .get('/usuario/admin')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(false);
  });
});