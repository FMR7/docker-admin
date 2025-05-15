const request = require('supertest');
const express = require('express');
const session = require('express-session');
const containerRouter = require('./containerController');

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

describe('Container Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.use(session({
      secret: 'test',
      resave: false,
      saveUninitialized: true
    }));

    app.use((req, res, next) => {
      req.session.user = { username: 'testuser', admin: true };
      next();
    });

    app.use(containerRouter);
  });

  describe('GET /container/status/:containerId', () => {
    it('should return true when container status is running when authenticated and valid ID', async () => {
      validateContainer.mockReturnValue(true);
      getStatus.mockResolvedValue({ ok: true, message: 'running' });

      const res = await request(app).get('/container/status/test-container');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ ok: true, message: 'running' });
    });

    it('should return 400 for invalid container ID', async () => {
      validateContainer.mockReturnValue(false);

      const res = await request(app).get('/container/status/invalid');

      expect(res.statusCode).toBe(400);
      expect(res.body.ok).toBe(false);
    });

    it('should return 401 when not authenticated', async () => {
      app = express();
      app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
      app.use(containerRouter);

      const res = await request(app).get('/container/status/test-container');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /container/turn-on/:containerId', () => {
    it('should turn on container and log the action', async () => {
      validateContainer.mockReturnValue(true);
      turnOnContainer.mockResolvedValue({ ok: true, message: 'turned on' });

      const res = await request(app).get('/container/turn-on/my-container');

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

      const res = await request(app).get('/container/turn-on/my-container');

      expect(res.statusCode).toBe(500);
      expect(res.body.ok).toBe(false);
    });

    it('should return 500 if error', async () => {
      turnOnContainer.mockRejectedValue(new Error('Some error'));

      const res = await request(app).get('/container/turn-on/my-container');

      expect(res.statusCode).toBe(500);
      expect(res.body.ok).toBe(false);
    });
  });

  describe('GET /container/turn-off/:containerId', () => {
    it('should turn off container and log the action', async () => {
      validateContainer.mockReturnValue(true);
      turnOffContainer.mockResolvedValue({ ok: true, message: 'turned off' });

      const res = await request(app).get('/container/turn-off/my-container');

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

      const res = await request(app).get('/container');

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.containers.length).toBe(1);
    });

    it('should return 500 if error', async () => {
      getContainers.mockRejectedValue(new Error('Some error'));

      const res = await request(app).get('/container');

      expect(res.statusCode).toBe(500);
      expect(res.body.ok).toBe(false);
    });
  });
});
