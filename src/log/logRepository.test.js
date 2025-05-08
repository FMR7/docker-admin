const db = require('../config/db');
const repo = require('./logRepository');

jest.mock('../config/db');

describe('findAll', () => {
  it('should return all logs', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ log_key: 1, username: 'test', action: 'USER_CREATE', detail: 'User created', log_date: '2023-10-01' }]
    });

    const res = await repo.findAll();

    expect(res).toEqual([{ log_key: 1, username: 'test', action: 'USER_CREATE', detail: 'User created', log_date: '2023-10-01' }]);
  });

  it('should return an empty array if no logs are found', async () => {
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
  it('should insert a log', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ log_key: 1, username: 'test', action: 'USER_CREATE', detail: 'User created', log_date: '2023-10-01' }]
    });

    const res = await repo.insert('test', 'USER_CREATE', 'User created');
    expect(res).toEqual({ log_key: 1, username: 'test', action: 'USER_CREATE', detail: 'User created', log_date: '2023-10-01' });
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.insert('test', 'USER_CREATE', 'User created')).rejects.toThrow('Database error');
  });
});