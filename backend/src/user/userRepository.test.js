const db = require('../config/db');
const repo = require('./userRepository');

jest.mock('../config/db');

describe('findAll', () => {
  it('should return all users without passwords', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ username: 'test', active: true, admin: false }]
    });
  
    const res = await repo.findAll();
  
    expect(res).toEqual([{ username: 'test', active: true, admin: false }]);
  });
  
  it('should return an empty array if no users are found', async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });
  
    const res = await repo.findAll();
    expect(res).toEqual([]);
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.findAll()).rejects.toThrow('Database error');
  });
});

describe('findByUsername', () => {
  it('should return a user by username', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ username: 'test', active: true, admin: false }]
    });
  
    const res = await repo.findByUsername('test');
  
    expect(res).toEqual({ username: 'test', active: true, admin: false });
  });
  
  it('should return undefined if no user is found', async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });
  
    const res = await repo.findByUsername('test');
    expect(res).toBeUndefined();
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.findByUsername('test')).rejects.toThrow('Database error');
  });
});

describe('findByUsernameAndActive', () => {
  it('should return a user by username', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ username: 'test', active: true, admin: false }]
    });
  
    const res = await repo.findByUsernameAndActive('test');
  
    expect(res).toEqual({ username: 'test', active: true, admin: false });
  });
  
  it('should return undefined if no user is found', async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });
  
    const res = await repo.findByUsernameAndActive('test');
    expect(res).toBeUndefined();
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.findByUsernameAndActive('test')).rejects.toThrow('Database error');
  });
});

describe('createUser', () => {
  it('should create a user', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ username: 'test', active: true, admin: false }]
    });
  
    const res = await repo.createUser('test', 'test');
  
    expect(res).toEqual({ username: 'test', active: true, admin: false });
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.createUser('test', 'test')).rejects.toThrow('Database error');
  });
});

describe('deleteUser', () => {
  it('should delete a user', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ username: 'test', active: true, admin: false }]
    });
  
    const res = await repo.deleteUser('test');
  
    expect(res).toEqual({ username: 'test', active: true, admin: false });
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.deleteUser('test')).rejects.toThrow('Database error');
  });
});

describe('updatePasswordWrongTries', () => {
  it('should update password wrong tries', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ username: 'test', password_wrong_tries: 1 }]
    });
  
    const res = await repo.updatePasswordWrongTries('test');
  
    expect(res).toEqual({ username: 'test', password_wrong_tries: 1 });
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.updatePasswordWrongTries('test')).rejects.toThrow('Database error');
  });
});

describe('setActive', () => {
  it('should set user active', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ username: 'test', active: true, admin: false }]
    });
  
    const res = await repo.setActive('test', true);
  
    expect(res).toEqual({ username: 'test', active: true, admin: false });
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.setActive('test', true)).rejects.toThrow('Database error');
  });
});

describe('setAdmin', () => {
  it('should set user admin', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ username: 'test', active: true, admin: true }]
    });
  
    const res = await repo.setAdmin('test', true);
  
    expect(res).toEqual({ username: 'test', active: true, admin: true });
  });

  it('should handle errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(repo.setAdmin('test', true)).rejects.toThrow('Database error');
  });
});