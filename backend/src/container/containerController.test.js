const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const containerRouter = require('./containerController');
const authJwt = require('../middleware/authJwt');
const csrfHeader = require('../middleware/csrfHeader');

jest.mock('./containerService');
jest.mock('../log/logService');

const {
  validateContainer,
  getStatus,
  turnOnContainer,
  turnOffContainer,
  getContainers,
} = require('./containerService');

const logService = require('../log/logService');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-with-secure-secret';
const csrfToken = 'test-csrf-token';

function generateToken(userData) {
  return jwt.sign({ ...userData, csrfToken }, JWT_SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256',
  });
}

describe('Container Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Auth middleware
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

    app.use(containerRouter);
  });

  describe('GET /container/status/:containerId', () => {
    it('should return true when container status is running when authenticated and valid ID', async () => {
      validateContainer.mockReturnValue(true);
      getStatus.mockResolvedValue({ ok: true, message: 'running' });

      const token = generateToken({ username: 'testuser', admin: true });

      const res = await request(app)
        .get('/container/status/test-container')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ ok: true, message: 'running' });
    });

    it('should return 400 for invalid container ID', async () => {
      validateContainer.mockReturnValue(false);

      const token = generateToken({ username: 'testuser', admin: true });
      const res = await request(app)
        .get('/container/status/invalid')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.ok).toBe(false);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).get('/container/status/test-container');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /container/turn-on/:containerId', () => {
    it('should turn on container and log the action', async () => {
      validateContainer.mockReturnValue(true);
      turnOnContainer.mockResolvedValue({ ok: true, message: 'turned on' });

      const token = generateToken({ username: 'testuser', admin: true });
      const res = await request(app)
        .get('/container/turn-on/my-container')
        .set('Authorization', `Bearer ${token}`)
        .set('x-csrf-token', csrfToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(turnOnContainer).toHaveBeenCalledWith('my-container', true);
      expect(logService.insert).toHaveBeenCalledWith(
        'testuser',
        logService.ACTIONS.CONTAINER_TURN_ON,
        'Container my-container turned on'
      );
    });

    it('should return 500 if result.ok is null or undefined', async () => {
      turnOnContainer.mockResolvedValue({ ok: null, message: 'turned on' });

      const token = generateToken({ username: 'testuser', admin: true });
      const res = await request(app)
        .get('/container/turn-on/my-container')
        .set('Authorization', `Bearer ${token}`)
        .set('x-csrf-token', csrfToken);

      expect(res.statusCode).toBe(500);
      expect(res.body.ok).toBe(false);
    });

    it('should return 500 if error', async () => {
      turnOnContainer.mockRejectedValue(new Error('Some error'));

      const token = generateToken({ username: 'testuser', admin: true });
      const res = await request(app)
        .get('/container/turn-on/my-container')
        .set('Authorization', `Bearer ${token}`)
        .set('x-csrf-token', csrfToken);

      expect(res.statusCode).toBe(500);
      expect(res.body.ok).toBe(false);
    });
  });

  describe('GET /container/turn-off/:containerId', () => {
    it('should turn off container and log the action', async () => {
      validateContainer.mockReturnValue(true);
      turnOffContainer.mockResolvedValue({ ok: true, message: 'turned off' });

      const token = generateToken({ username: 'testuser', admin: true });
      const res = await request(app)
        .get('/container/turn-off/my-container')
        .set('Authorization', `Bearer ${token}`)
        .set('x-csrf-token', csrfToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(turnOffContainer).toHaveBeenCalledWith('my-container', true);
      expect(logService.insert).toHaveBeenCalledWith(
        'testuser',
        logService.ACTIONS.CONTAINER_TURN_OFF,
        'Container my-container turned off'
      );
    });
  });

  describe('GET /container', () => {
    it('should return list of containers', async () => {
      getContainers.mockResolvedValue([{ id: 'c1', name: 'container 1' }]);

      const token = generateToken({ username: 'testuser', admin: true });
      const res = await request(app)
        .get('/container')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
    });

    it('should return 500 if error', async () => {
      getContainers.mockRejectedValue(new Error('Some error'));

      const token = generateToken({ username: 'testuser', admin: true });
      const res = await request(app)
        .get('/container')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(500);
      expect(res.body.ok).toBe(false);
    });
  });
});
