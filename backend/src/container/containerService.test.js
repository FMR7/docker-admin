jest.mock('dockerode', () => {
  const mockInspect = jest.fn();
  const mockStart = jest.fn();
  const mockStop = jest.fn();

  const getContainer = jest.fn(() => ({
    inspect: mockInspect,
    start: mockStart,
    stop: mockStop,
  }));

  const Docker = jest.fn(() => ({ getContainer }));

  Docker.__mocks = {
    getContainer,
    inspect: mockInspect,
    start: mockStart,
    stop: mockStop,
  };

  return Docker;
});

jest.mock('../containerConfig/containerConfigService');

const Docker = require('dockerode');
const containerConfigService = require('../containerConfig/containerConfigService');
const containerService = require('./containerService');
const {
  validateContainer,
  getStatus,
  getName,
  turnOnContainer,
  turnOffContainer,
  controlContainer,
  getContainers,
} = containerService;

describe('containerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    containerConfigService.findAll = jest.fn();
    containerConfigService.findById = jest.fn();
    Docker.__mocks.inspect.mockReset();
    Docker.__mocks.start.mockReset();
    Docker.__mocks.stop.mockReset();
    Docker.__mocks.getContainer.mockReset();
    Docker.__mocks.getContainer.mockImplementation(() => ({
      inspect: Docker.__mocks.inspect,
      start: Docker.__mocks.start,
      stop: Docker.__mocks.stop,
    }));
  });

  describe('validateContainer', () => {
    it('returns true for existing container', async () => {
      containerConfigService.findAll.mockResolvedValue([
        { container_key: 'foo', name: 'foo', description: 'desc', active: true, admin_only: false },
      ]);

      await expect(validateContainer('foo')).resolves.toBe(true);
    });

    it('throws if container config not found', async () => {
      containerConfigService.findAll.mockResolvedValue([{ container_key: 'bar' }]);

      await expect(validateContainer('foo')).rejects.toThrow('Error checking container status');
    });

    it('throws if findAll fails', async () => {
      containerConfigService.findAll.mockRejectedValue(new Error('DB fail'));

      await expect(validateContainer('foo')).rejects.toThrow('Error checking container status');
    });

    it('throws if findAll returns undefined', async () => {
      containerConfigService.findAll.mockResolvedValue(undefined);

      await expect(validateContainer('foo')).rejects.toThrow('Error checking container status');
    });
  });

  describe('getStatus', () => {
    it('returns running state', async () => {
      Docker.__mocks.inspect.mockResolvedValue({ State: { Running: true } });
      const res = await getStatus('foo');

      expect(res).toBe(true);
      expect(Docker.__mocks.getContainer).toHaveBeenCalledWith('foo');
    });

    it('throws on inspect failure', async () => {
      Docker.__mocks.inspect.mockRejectedValue(new Error('inspect failed'));
      await expect(getStatus('foo')).rejects.toThrow('Error checking status');
    });
  });

  describe('getName', () => {
    it('returns container name without slash', async () => {
      Docker.__mocks.inspect.mockResolvedValue({ Name: '/foo' });
      const res = await getName('foo');

      expect(res).toBe('foo');
    });

    it('throws on inspect failure', async () => {
      Docker.__mocks.inspect.mockRejectedValue(new Error('inspect failed'));
      await expect(getName('foo')).rejects.toThrow('Error checking container name');
    });
  });

  describe('controlContainer', () => {
    it('starts container and returns ok true when valid', async () => {
      containerConfigService.findById.mockResolvedValue({ container_key: 'foo', active: true, admin_only: false });
      Docker.__mocks.start.mockResolvedValue();

      const res = await controlContainer('start', 'foo', false);

      expect(res).toEqual({ ok: true, message: 'Container turned on' });
      expect(Docker.__mocks.start).toHaveBeenCalled();
    });

    it('stops container and returns ok true when valid', async () => {
      containerConfigService.findById.mockResolvedValue({ container_key: 'foo', active: true, admin_only: false });
      Docker.__mocks.stop.mockResolvedValue();

      const res = await controlContainer('stop', 'foo', false);

      expect(res).toEqual({ ok: true, message: 'Container turned off' });
      expect(Docker.__mocks.stop).toHaveBeenCalled();
    });

    it('throws when container is not found in config', async () => {
      containerConfigService.findById.mockResolvedValue(undefined);

      await expect(controlContainer('start', 'foo', false)).rejects.toThrow('Container foo not found');
    });

    it('throws when container is admin_only and user is not admin', async () => {
      containerConfigService.findById.mockResolvedValue({ container_key: 'foo', active: true, admin_only: true });

      await expect(controlContainer('start', 'foo', false)).rejects.toThrow('Container foo is admin only');
    });

    it('throws when container is inactive', async () => {
      containerConfigService.findById.mockResolvedValue({ container_key: 'foo', active: false, admin_only: false });

      await expect(controlContainer('start', 'foo', true)).rejects.toThrow('Container foo is disabled');
    });

    it('throws on unexpected docker errors', async () => {
      containerConfigService.findById.mockResolvedValue({ container_key: 'foo', active: true, admin_only: false });
      Docker.__mocks.start.mockRejectedValue(new Error('docker start failed'));

      await expect(controlContainer('start', 'foo', true)).rejects.toThrow('Unexpected error when trying to start container: docker start failed');
    });
  });

  describe('turnOnContainer/turnOffContainer', () => {
    it('turns on container through controlContainer behavior', async () => {
      containerConfigService.findById.mockResolvedValue({ container_key: 'foo', active: true, admin_only: false });
      Docker.__mocks.start.mockResolvedValue();

      const res = await turnOnContainer('foo', true);

      expect(res).toEqual({ ok: true, message: 'Container turned on' });
      expect(Docker.__mocks.start).toHaveBeenCalled();
    });

    it('turns off container through controlContainer behavior', async () => {
      containerConfigService.findById.mockResolvedValue({ container_key: 'foo', active: true, admin_only: false });
      Docker.__mocks.stop.mockResolvedValue();

      const res = await turnOffContainer('foo', true);

      expect(res).toEqual({ ok: true, message: 'Container turned off' });
      expect(Docker.__mocks.stop).toHaveBeenCalled();
    });
  });

  describe('getContainers', () => {
    it('returns active non-admin containers for user', async () => {
      const configs = [
        { container_key: 'c1', name: 'c1', description: 'desc', active: true, admin_only: false },
        { container_key: 'c2', name: 'c2', description: 'desc', active: true, admin_only: true },
        { container_key: 'c3', name: 'c3', description: 'desc', active: false, admin_only: false },
      ];
      containerConfigService.findAll.mockResolvedValue(configs);
      Docker.__mocks.inspect.mockResolvedValue({ State: { Running: true }, Name: '/c1' });

      const res = await getContainers(false);

      expect(res.containers).toHaveLength(1);
      expect(res.containers[0]).toMatchObject({ container_key: 'c1' });
      expect(res.messages).toEqual([]);
    });

    it('sorts containers by status and name', async () => {
      const configs = [
        { container_key: 'a', name: 'a', description: 'desc', active: true, admin_only: false },
        { container_key: 'b', name: 'b', description: 'desc', active: true, admin_only: false },
        { container_key: 'c', name: 'c', description: 'desc', active: true, admin_only: false },
      ];

      containerConfigService.findAll.mockResolvedValue(configs);
      const statusMap = { a: false, b: true, c: true };

      Docker.__mocks.getContainer.mockImplementation((id) => ({
        inspect: jest.fn().mockResolvedValue({ State: { Running: statusMap[id] }, Name: `/${id}` }),
        start: Docker.__mocks.start,
        stop: Docker.__mocks.stop,
      }));

      const res = await getContainers(true);

      expect(res.containers.map((c) => c.container_key)).toEqual(['b', 'c', 'a']);
      expect(res.messages).toEqual([]);
    });

    it('throws when container config is missing key', async () => {
      const configs = [{ name: 'missing', description: 'desc', active: true, admin_only: false }];
      containerConfigService.findAll.mockResolvedValue(configs);
      await expect(getContainers(true)).rejects.toThrow('Error getting containers');
    });

    it('collects messages when status check fails', async () => {
      const configs = [{ container_key: 'c1', name: 'c1', description: 'desc', active: true, admin_only: false }];
      containerConfigService.findAll.mockResolvedValue(configs);
      Docker.__mocks.inspect.mockRejectedValue(new Error('no such container'));

      const res = await getContainers(true);

      expect(res.containers).toEqual([]);
      expect(res.messages).toHaveLength(1);
      expect(res.messages[0]).toContain('Error checking status for <strong>c1</strong>');
    });

    it('throws if findAll fails', async () => {
      containerConfigService.findAll.mockRejectedValue(new Error('DB fail'));

      await expect(getContainers(true)).rejects.toThrow('Error getting containers');
    });

    it('sorts messages lexicographically', async () => {
      const configs = [
        { container_key: 'c4', name: 'container 4', description: 'desc', active: true, admin_only: false },
        { container_key: 'c5', name: 'container 5', description: 'desc', active: true, admin_only: false },
      ];
      containerConfigService.findAll.mockResolvedValue(configs);
      const errors = {
        c4: new Error('alpha error'),
        c5: new Error('beta error')
      };

      Docker.__mocks.getContainer.mockImplementation((id) => ({
        inspect: jest.fn().mockRejectedValue(errors[id]),
        start: Docker.__mocks.start,
        stop: Docker.__mocks.stop,
      }));

      const res = await getContainers(true);

      expect(res.containers).toEqual([]);
      expect(res.messages).toEqual([
        'Error checking status for <strong>container 4</strong>',
        'Error checking status for <strong>container 5</strong>'
      ]);
    });
  });
});
