jest.mock('./containerConfigRepository');
const repo = require('./containerConfigRepository');
const service = require('./containerConfigService');

describe('findAll', () => {
  it('should return all container configs', async () => {
    repo.findAll = jest.fn().mockResolvedValue([{ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test' }]);

    const res = await service.findAll();
    expect(res).toEqual([{ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test' }]);
  });

  it('should return an empty array if no container configs are found', async () => {
    repo.findAll = jest.fn().mockResolvedValue(undefined);

    const res = await service.findAll();
    expect(res).toEqual([]);
  });

  it('should handle errors', async () => {
    repo.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(service.findAll()).rejects.toThrow('Database error');
  });
});

describe('insert', () => {
  it('should insert a container config', async () => {
    repo.insert = jest.fn().mockResolvedValue({ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test', active: true });

    const res = await service.insert('iuh23497iufg98q2irhas98df134', 'test', 'test', true, false);
    expect(res).toEqual({ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test', active: true });
  });

  it('should throw an error if no container_key is provided', async () => {
    await expect(service.insert(null, null, null, null, null)).rejects.toBeTruthy();
  });

  it('should throw an error if no name is provided', async () => {
    await expect(service.insert('iuh23497iufg98q2irhas98df134', null, null, null, null)).rejects.toBeTruthy();
  });

  it('should throw an error if no active is provided', async () => {
    await expect(service.insert('iuh23497iufg98q2irhas98df134', 'test', null, null, null)).rejects.toBeTruthy();
  });

  it('should throw an error if no admin_only is provided', async () => {
    await expect(service.insert('iuh23497iufg98q2irhas98df134', 'test', null, true, null)).rejects.toBeTruthy();
  });

  it('should return undefined if no container config is inserted', async () => {
    repo.insert = jest.fn().mockResolvedValue(undefined);

    const res = await service.insert('iuh23497iufg98q2irhas98df134', 'test', 'test', true, false);
    expect(res).toEqual(undefined);
  });

  it('should handle errors', async () => {
    repo.insert = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(service.insert('iuh23497iufg98q2irhas98df134', 'test')).rejects.toBeTruthy();
  });
});

describe('update', () => {
  it('should update a container config', async () => {
    repo.update = jest.fn().mockResolvedValue({ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test', active: true, admin_only: true });

    const res = await service.update('iuh23497iufg98q2irhas98df134', 'test', "deescription", true, true);
    expect(res).toEqual({ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test', active: true, admin_only: true });
  });

  it('should throw an error if no container_key', async () => {
    await expect(service.update(null, null, null, null, null)).rejects.toBeTruthy();
  });

  it('should throw an error if no name is provided', async () => {
    await expect(service.update('iuh23497iufg98q2irhas98df134', null, null, null, null)).rejects.toBeTruthy();
  });

  it('should throw an error if no active is provided', async () => {
    await expect(service.update('iuh23497iufg98q2irhas98df134', 'test', 'test', null, null)).rejects.toBeTruthy();
  });

  it('should throw an error if no admin_only is provided', async () => {
    await expect(service.update('iuh23497iufg98q2irhas98df134', 'test', 'test', true, null)).rejects.toBeTruthy();
  });

  it('should return undefined if no container config is updated', async () => {
    repo.update = jest.fn().mockResolvedValue(undefined);

    const res = await service.update('iuh23497iufg98q2irhas98df134', 'test', "deescription", true, true);
    expect(res).toEqual(undefined);
  });

  it('should handle errors', async () => {
    repo.update = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(service.update('iuh23497iufg98q2irhas98df134', 'test', "deescription", true, true)).rejects.toThrow('Database error');
  });
});

describe('delete', () => {
  it('should delete a container config', async () => {
    repo.deleteContainer = jest.fn().mockResolvedValue({ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test', active: true });

    const res = await service.deleteContainer('iuh23497iufg98q2irhas98df134');
    expect(res).toEqual({ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test', active: true });
  });

  it('should throw an error if no container_key is provided', async () => {
    await expect(service.deleteContainer(null)).rejects.toThrow('Container key is required');
  });

  it('should return undefined if no container config is deleted', async () => {
    repo.deleteContainer = jest.fn().mockResolvedValue(undefined);

    const res = await service.deleteContainer('iuh23497iufg98q2irhas98df134');
    expect(res).toEqual(undefined);
  });

  it('should handle errors', async () => {
    repo.deleteContainer = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(service.deleteContainer('iuh23497iufg98q2irhas98df134')).rejects.toThrow('Database error');
  });
});