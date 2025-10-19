const request = require('supertest');
const express = require('express');
const session = require('express-session');
const routes = require('./containerConfigController');

jest.mock('./containerConfigService');
jest.mock('express-session');
const mockSession = require('../testUtils/mockSessionMiddleware');
require('express-session').mockImplementation(mockSession);
const service = require('./containerConfigService');

const app = express();
app.use(express.json());

// ✅ Add session middleware
app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}));

// ✅ Use route
app.use('/', routes);

const testPassword = 'testPassword';

describe('Container config list', () => {
  it('should return 200 on successful list', async () => {
    service.findAll.mockResolvedValue([{ container_key: 'test', name: 'test', description: 'test' }]);

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).get('/container-config');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if not authenticated', async () => {
    mockSession.setSession({});

    const res = await request(app).get('/container-config');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not authenticated');
  });

  it('should return 401 if not admin', async () => {
    mockSession.setSession({ user: { username: 'test', admin: false } });

    const res = await request(app).get('/container-config');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });

  it('should return 401 if error', async () => {
    service.findAll.mockRejectedValue(new Error('Some error'));

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).get('/container-config');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});

describe('Container config insert', () => {
  it('should return 200 on successful insert', async () => {
    service.insert.mockResolvedValue({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).post('/container-config').send({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if not authenticated', async () => {
    mockSession.setSession({});

    const res = await request(app).post('/container-config').send({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not authenticated');
  });

  it('should return 401 if not admin', async () => {
    mockSession.setSession({ user: { username: 'test', admin: false } });

    const res = await request(app).post('/container-config').send({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });

  it('should return 401 if error', async () => {
    service.insert.mockRejectedValue(new Error('Some error'));

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).post('/container-config').send({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});

describe('Container config update', () => {
  it('should return 200 on successful update', async () => {
    service.update.mockResolvedValue({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).put('/container-config/test').send({ name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if not authenticated', async () => {
    mockSession.setSession({});

    const res = await request(app).put('/container-config/test').send({ name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not authenticated');
  });

  it('should return 401 if not admin', async () => {
    mockSession.setSession({ user: { username: 'test', admin: false } });

    const res = await request(app).put('/container-config/test').send({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });

  it('should return 401 if error', async () => {
    service.update.mockRejectedValue(new Error('Some error'));

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).put('/container-config/test').send({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});

describe('Container config delete', () => {
  it('should return 200 on successful delete', async () => {
    service.deleteContainer.mockResolvedValue({ container_key: 'test', name: 'test', description: 'test', active: true, admin_only: false });

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).delete('/container-config/test');

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should return 401 if not authenticated', async () => {
    mockSession.setSession({});

    const res = await request(app).delete('/container-config/test');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not authenticated');
  });

  it('should return 401 if not admin', async () => {
    mockSession.setSession({ user: { username: 'test', admin: false } });

    const res = await request(app).delete('/container-config/test');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toBe('Not admin');
  });

  it('should return 401 if error', async () => {
    service.deleteContainer.mockRejectedValue(new Error('Some error'));

    mockSession.setSession({ user: { username: 'admin', admin: true } });

    const res = await request(app).delete('/container-config/test');

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});