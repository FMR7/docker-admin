const bcrypt = require('bcrypt');
const userService = require('./userService');
const usuarioRepo = require('./userRepository');
jest.mock('./userRepository');

const testPassword = 'testPassword';

describe('findAll', () => {
  it('should return all users without passwords', async () => {
    usuarioRepo.findAll = jest.fn().mockResolvedValue([{ username: 'test', active: true, admin: false }]);

    const res = await userService.findAll();
    expect(res).toEqual([{ username: 'test', active: true, admin: false }]);
  });

  it('should return an empty array if no users are found', async () => {
    usuarioRepo.findAll = jest.fn().mockResolvedValue(undefined);

    const res = await userService.findAll();
    expect(res).toEqual([]);
  });

  it('should handle errors', async () => {
    usuarioRepo.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(userService.findAll()).rejects.toThrow('Database error');
  });
});

describe('getUserByUsername', () => {
  it('should return a user without password', async () => {
    usuarioRepo.findByUsername = jest.fn().mockResolvedValue({ username: 'test', active: true, admin: false });

    const res = await userService.getUserByUsername('test');
    expect(res).toEqual({ username: 'test', active: true, admin: false });
  });

  it('should return undefined if no user is found', async () => {
    usuarioRepo.findByUsername = jest.fn().mockResolvedValue(undefined);

    const res = await userService.getUserByUsername('test');
    expect(res).toBeUndefined();
  });

  it('should handle errors', async () => {
    usuarioRepo.findByUsername = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(userService.getUserByUsername('test')).rejects.toThrow('Database error');
  });
});

describe('getUserByUsernameAndActive', () => {
  it('should return a user without password', async () => {
    usuarioRepo.findByUsernameAndActive = jest.fn().mockResolvedValue({ username: 'test', active: true, admin: false });

    const res = await userService.getUserByUsernameAndActive('test');
    expect(res).toEqual({ username: 'test', active: true, admin: false });
  });

  it('should return undefined if no user is found', async () => {
    usuarioRepo.findByUsernameAndActive = jest.fn().mockResolvedValue(undefined);

    const res = await userService.getUserByUsernameAndActive('test');
    expect(res).toBeUndefined();
  });

  it('should handle errors', async () => {
    usuarioRepo.findByUsernameAndActive = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(userService.getUserByUsernameAndActive('test')).rejects.toThrow('Database error');
  });
});

describe('signin', () => {
  it('should return a user without password', async () => {
    const testPasswordHash = (await bcrypt.hash(testPassword, 10)).toString();
    usuarioRepo.findByUsernameAndActive = jest.fn().mockResolvedValue({ username: 'test', active: true, admin: false, password: testPasswordHash, password_wrong_tries: 0 });
    usuarioRepo.updatePasswordWrongTries = jest.fn().mockResolvedValue({ username: 'test', active: true, admin: false, password: testPasswordHash, password_wrong_tries: 0 });

    const res = await userService.signin('test', testPassword);
    expect(res).toEqual({ username: 'test', active: true, admin: false });
  });

  it('should return undefined if no user is found', async () => {
    usuarioRepo.findByUsernameAndActive = jest.fn().mockResolvedValue(undefined);

    await expect(userService.signin('test', testPassword)).rejects.toThrow('User not found or inactive');
  });

  it('should handle errors', async () => {
    usuarioRepo.findByUsernameAndActive = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(userService.signin('test', testPassword)).rejects.toThrow('Database error');
  });

  it('should throw an error if password is invalid', async () => {
    const testPasswordHash = (await bcrypt.hash(testPassword, 10)).toString();
    usuarioRepo.findByUsernameAndActive = jest.fn().mockResolvedValue({ username: 'test', active: true, admin: false, password: testPasswordHash, password_wrong_tries: 0 });
    usuarioRepo.updatePasswordWrongTries = jest.fn().mockResolvedValue({ username: 'test', active: true, admin: false, password: testPasswordHash, password_wrong_tries: 1 });

    await expect(userService.signin('test', 'wrongPassword')).rejects.toThrow('Invalid password');
  });

  it('should disable user after 3 failed attempts', async () => {
    const testPasswordHash = (await bcrypt.hash(testPassword, 10)).toString();
    usuarioRepo.findByUsernameAndActive = jest.fn().mockResolvedValue({ username: 'test', active: true, admin: false, password: testPasswordHash, password_wrong_tries: 3 });
    usuarioRepo.updatePasswordWrongTries = jest.fn().mockResolvedValue({ username: 'test', active: true, admin: false, password: testPasswordHash, password_wrong_tries: 4 });
    usuarioRepo.disableUser = jest.fn().mockResolvedValue({ username: 'test', active: false, admin: false });

    await expect(userService.signin('test', 'wrongPassword')).rejects.toThrow('User disabled due to too many failed login attempts. Contact admin.');
  });
});

describe('signup', () => {
  it('should return a user without password', async () => {
    const testPasswordHash = (await bcrypt.hash(testPassword, 10)).toString();
    usuarioRepo.findByUsername = jest.fn().mockResolvedValue(undefined);
    usuarioRepo.createUser = jest.fn().mockResolvedValue({ username: 'test', active: true, admin: false, password: testPasswordHash, password_wrong_tries: 0 });

    const res = await userService.signup('test', testPassword);
    expect(res).toEqual({ username: 'test', active: true, admin: false, password_wrong_tries: 0 });
  });

  it('should throw an error if user already exists', async () => {
    usuarioRepo.findByUsername = jest.fn().mockResolvedValue({ username: 'test', active: true, admin: false });

    await expect(userService.signup('test', testPassword)).rejects.toThrow('User already exists');
  });

  it('should handle errors', async () => {
    usuarioRepo.findByUsername = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(userService.signup('test', testPassword)).rejects.toThrow('Database error');
  });
});

