jest.mock('./logRepository');
const logRepo = require('./logRepository');
const logService = require('./logService');

describe('findAll', () => {
  it('should return all logs', async () => {
    logRepo.findAll = jest.fn().mockResolvedValue([{ log_key: 1, username: 'test', action: 'USER_CREATE', detail: 'User created', log_date: '2023-10-01' }]);
    
    const res = await logService.findAll();
    expect(res).toEqual([{ log_key: 1, username: 'test', action: 'USER_CREATE', detail: 'User created', log_date: '2023-10-01' }]);
  });

  it('should return an empty array if no logs are found', async () => {
    logRepo.findAll = jest.fn().mockResolvedValue(undefined);
    
    const res = await logService.findAll();
    expect(res).toEqual([]);
  });

  it('should handle errors', async () => {
    logRepo.findAll = jest.fn().mockRejectedValue(new Error('Database error'));
    
    await expect(logService.findAll()).rejects.toThrow('Database error');
  });

});

describe('insert', () => {
  it('should insert a log', async () => {
    process.env.ENABLE_DB_LOGS = true;
    const username = 'test';
    const action = logService.ACTIONS.USER_CREATE;
    const detail = 'User created';
    const mockLog = { username, action, detail };

    logRepo.insert.mockResolvedValue(mockLog);

    const res = await logService.insert(username, action, detail);
    expect(res).toEqual(mockLog);
  });

  it('should not insert a log if ENABLE_DB_LOGS is false', async () => {
    process.env.ENABLE_DB_LOGS = false;
    const username = 'test';
    const action = logService.ACTIONS.USER_CREATE;
    const detail = 'User created';
    const mockLog = { username, action, detail };

    logRepo.insert.mockResolvedValue(mockLog);

    const res = await logService.insert(username, action, detail);
    expect(res).toBeUndefined();
  });

  it('should throw an error if username or action is missing', async () => {
    process.env.ENABLE_DB_LOGS = true;
    const action = logService.ACTIONS.USER_CREATE;
    const detail = 'User created';

    await expect(logService.insert(undefined, action, detail)).rejects.toThrow('Username and action are required');
  });

  it('should throw an error if action is invalid', async () => {
    process.env.ENABLE_DB_LOGS = true;
    const username = 'test';
    const action = 'INVALID_ACTION';
    const detail = 'User created';

    await expect(logService.insert(username, action, detail)).rejects.toThrow('Invalid action');
  });

  it('should handle undefined result from logRepo', async () => {
    process.env.ENABLE_DB_LOGS = true;
    const username = 'test';
    const action = logService.ACTIONS.USER_CREATE;
    const detail = 'User created';

    logRepo.insert.mockResolvedValue(undefined);

    const res = await logService.insert(username, action, detail);
    expect(res).toBeUndefined();
  });
});