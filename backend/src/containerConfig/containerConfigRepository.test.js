const db = require('../config/db');
const repo = require('./containerConfigRepository');

jest.mock('../config/db');

describe('findAll', () => {
  it('should return all container configs', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test' }]
    });

    const res = await repo.findAll();

    expect(res).toEqual([{ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test' }]);
  });

  it('should return an empty array if no container configs are found', async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });

    const res = await repo.findAll();
    expect(res).toEqual([]);
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.findAll()).rejects.toThrow('Database error');
  });
});

describe('insert', () => {
  it('should insert a container config', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test' }]
    });

    const res = await repo.insert('iuh23497iufg98q2irhas98df134', 'test');
    expect(res).toEqual({ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test' });
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.insert('iuh23497iufg98q2irhas98df134', 'test')).rejects.toThrow('Database error');
  });
});

describe('update', () => {
  it('should update a container config', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test' }]
    });

    const res = await repo.update('iuh23497iufg98q2irhas98df134', 'test');
    expect(res).toEqual({ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test' });
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.update('iuh23497iufg98q2irhas98df134', 'test')).rejects.toThrow('Database error');
  });
});

describe('delete', () => {
  it('should delete a container config', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test' }]
    });

    const res = await repo.deleteContainer('iuh23497iufg98q2irhas98df134');
    expect(res).toEqual({ container_key: 'iuh23497iufg98q2irhas98df134', name: 'test', description: 'test' });
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.deleteContainer('iuh23497iufg98q2irhas98df134')).rejects.toThrow('Database error');
  });
});