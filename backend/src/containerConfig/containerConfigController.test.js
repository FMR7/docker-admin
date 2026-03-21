const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const routes = require('./containerConfigController');
const authJwt = require('../middleware/authJwt');
const csrfHeader = require('../middleware/csrfHeader');

jest.mock('./containerConfigService');
const service = require('./containerConfigService');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-with-secure-secret';
const csrfToken = 'test-csrf-token';

function generateToken(userData) {
  return jwt.sign({ ...userData, csrfToken }, JWT_SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256',
  });
}

const app = express();
app.use(express.json());

// JWT auth middleware
const apiPublicPaths = [];
app.use((req, res, next) => {
  if (apiPublicPaths.includes(req.path) && req.method === 'POST') {
    return next();
  }
  authJwt(req, res, (err) => {
    if (err) return next(err);
    csrfHeader(req, res, next);
  });
});

app.use('/', routes);

const testPassword = 'testPassword';

describe('Container config list', () => {
  it('should return 200 on successful list', async () => {
    service.findAll.mockResolvedValue([{ container_key: 'test', name: 'test', description: 'test' }]);

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .get('/container-config')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).get('/container-config');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toContain('authorization');
  });

  it('should return 401 if not admin', async () => {
    const token = generateToken({ username: 'test', admin: false });

    const res = await request(app)
      .get('/container-config')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });

  it('should return 401 if error', async () => {
    service.findAll.mockRejectedValue(new Error('Some error'));

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .get('/container-config')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});

describe('Container config insert', () => {
  it('should return 200 on successful insert', async () => {
    service.insert.mockResolvedValue({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .post('/container-config')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .post('/container-config')
      .set('x-csrf-token', csrfToken)
      .send({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toContain('authorization');
  });

  it('should return 401 if not admin', async () => {
    const token = generateToken({ username: 'test', admin: false });

    const res = await request(app)
      .post('/container-config')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });

  it('should return 401 if error', async () => {
    service.insert.mockRejectedValue(new Error('Some error'));

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .post('/container-config')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});

describe('Container config update', () => {
  it('should return 200 on successful update', async () => {
    service.update.mockResolvedValue({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .put('/container-config/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .put('/container-config/test')
      .set('x-csrf-token', csrfToken)
      .send({ name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toContain('authorization');
  });

  it('should return 401 if not admin', async () => {
    const token = generateToken({ username: 'test', admin: false });

    const res = await request(app)
      .put('/container-config/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });

  it('should return 401 if error', async () => {
    service.update.mockRejectedValue(new Error('Some error'));

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .put('/container-config/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});

describe('Container config delete', () => {
  it('should return 200 on successful delete', async () => {
    service.deleteContainer.mockResolvedValue({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .delete('/container-config/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .delete('/container-config/test')
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toContain('authorization');
  });

  it('should return 401 if not admin', async () => {
    const token = generateToken({ username: 'test', admin: false });

    const res = await request(app)
      .delete('/container-config/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });

  it('should return 401 if error', async () => {
    service.deleteContainer.mockRejectedValue(new Error('Some error'));

    const token = generateToken({ username: 'admin', admin: true });

    const res = await request(app)
      .delete('/container-config/test')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});