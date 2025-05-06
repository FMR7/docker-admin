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
