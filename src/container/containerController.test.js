const request = require('supertest');
const express = require('express');
const session = require('express-session');
const containerRoutes = require('./containerController');

jest.mock('./containerService');
jest.mock('express-session');
const mockSession = require('../testUtils/mockSessionMiddleware');
require('express-session').mockImplementation(mockSession);
const containerService = require('./containerService');

const app = express();
app.use(express.json());

// ✅ Add session middleware
app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: true,
}));

// ✅ Use route
app.use('/', containerRoutes);

describe('getStatus', () => {
  beforeEach(() => {
    process.env.CONTAINERS = 'containerId,anotherContainer';
    jest.clearAllMocks();
  });

  it('should return the status of the container, true', async () => {
    containerService.getStatus.mockResolvedValue({ ok: true });

    mockSession.setSession({ user: { username: 'test', active: true, admin: true } });

    const containerId = 'containerId';
    const result = await request(app).get(`/container/status/${containerId}`);
    expect(result.statusCode).toBe(200);
    expect(result.ok).toBe(true);
  });

  it('should return the status of the container, false', async () => {
    containerService.getStatus.mockResolvedValue({ ok: false });

    mockSession.setSession({ user: { username: 'test', active: true, admin: true } });

    const containerId = 'containerId';
    const result = await request(app).get(`/container/status/${containerId}`);
    expect(result.statusCode).toBe(500);
    expect(result.ok).toBe(false);
  });

  it('should return 401 if not authenticated', async () => {
    mockSession.setSession(null);
    const containerId = 'containerId';
    const result = await request(app).get(`/container/status/${containerId}`);
    expect(result.statusCode).toBe(401);
    expect(result.ok).toBe(false);
  });

  it('should return 400 if container ID is invalid', async () => {

    mockSession.setSession({ user: { username: 'test', active: true, admin: true } });
    const containerId = 'invalidContainerId';
    const result = await request(app).get(`/container/status/${containerId}`);
    expect(result.statusCode).toBe(400);
    expect(result.ok).toBe(false);
  });

  it('should return 500 if error', async () => {
    containerService.getStatus.mockRejectedValue(new Error('Some error'));

    mockSession.setSession({ user: { username: 'test', active: true, admin: true } });
    const containerId = 'containerId';
    const result = await request(app).get(`/container/status/${containerId}`);
    expect(result.statusCode).toBe(500);
    expect(result.ok).toBe(false);
  });
});

describe('turnOnContainer', () => {
  beforeEach(() => {
    process.env.CONTAINERS = 'containerId,anotherContainer';
    jest.clearAllMocks();
  });

  it('should turn on the container, true', async () => {
    containerService.turnOnContainer.mockResolvedValue({ ok: true, message: 'Container turned on' });

    mockSession.setSession({ user: { username: 'test', active: true, admin: true } });
    
    const containerId = 'containerId';
    const result = await request(app).get(`/container/turn-on/${containerId}`);
    expect(result.statusCode).toBe(200);
    expect(result.ok).toBe(true);
  });

  it('should turn on the container, false', async () => {
    containerService.turnOnContainer.mockResolvedValue({ ok: false });

    mockSession.setSession({ user: { username: 'test', active: true, admin: true } });
    
    const containerId = 'containerId';
    const result = await request(app).get(`/container/turn-on/${containerId}`);
    expect(result.statusCode).toBe(500);
    expect(result.ok).toBe(false);
  });

  it('should return 401 if not authenticated', async () => {
    mockSession.setSession(null);
    const containerId = 'containerId';
    const result = await request(app).get(`/container/turn-on/${containerId}`);
    expect(result.statusCode).toBe(401);
    expect(result.ok).toBe(false);
  });

  it('should return 400 if container ID is invalid', async () => {
    mockSession.setSession({ user: { username: 'test', active: true, admin: true } });
    const containerId = 'invalidContainerId';
    const result = await request(app).get(`/container/turn-on/${containerId}`);
    expect(result.statusCode).toBe(400);
    expect(result.ok).toBe(false);
  });

  it('should return 500 if error', async () => {
    containerService.turnOnContainer.mockRejectedValue(new Error('Some error'));

    mockSession.setSession({ user: { username: 'test', active: true, admin: true } });
    const containerId = 'containerId';
    const result = await request(app).get(`/container/turn-on/${containerId}`);
    expect(result.statusCode).toBe(500);
    expect(result.ok).toBe(false);
  });
});

describe('turnOffContainer', () => {
  beforeEach(() => {
    process.env.CONTAINERS = 'containerId,anotherContainer';
    jest.clearAllMocks();
  });

  it('should turn off the container, true', async () => {
    containerService.turnOffContainer.mockResolvedValue({ ok: true, message: 'Container turned off' });

    mockSession.setSession({ user: { username: 'test', active: true, admin: true } });
    
    const containerId = 'containerId';
    const result = await request(app).get(`/container/turn-off/${containerId}`);
    expect(result.statusCode).toBe(200);
    expect(result.ok).toBe(true);
  });

  it('should turn off the container, false', async () => {
    containerService.turnOffContainer.mockResolvedValue({ ok: false });

    mockSession.setSession({ user: { username: 'test', active: true, admin: true } });
    
    const containerId = 'containerId';
    const result = await request(app).get(`/container/turn-off/${containerId}`);
    expect(result.statusCode).toBe(500);
    expect(result.ok).toBe(false);
  });

  it('should return 401 if not authenticated', async () => {
    mockSession.setSession(null);
    const containerId = 'containerId';
    const result = await request(app).get(`/container/turn-off/${containerId}`);
    expect(result.statusCode).toBe(401);
    expect(result.ok).toBe(false);
  });

  it('should return 400 if container ID is invalid', async () => {
    mockSession.setSession({ user: { username: 'test', active: true, admin: true } });
    const containerId = 'invalidContainerId';
    const result = await request(app).get(`/container/turn-off/${containerId}`);
    expect(result.statusCode).toBe(400);
    expect(result.ok).toBe(false);
  });

  it('should return 500 if error', async () => {
    containerService.turnOffContainer.mockRejectedValue(new Error('Some error'));

    mockSession.setSession({ user: { username: 'test', active: true, admin: true } });
    const containerId = 'containerId';
    const result = await request(app).get(`/container/turn-off/${containerId}`);
    expect(result.statusCode).toBe(500);
    expect(result.ok).toBe(false);
  });
});