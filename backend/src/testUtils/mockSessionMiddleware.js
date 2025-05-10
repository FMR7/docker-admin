let sessionData = null;
let destroyMock = jest.fn((cb) => cb(null)); // default to success

const mockSession = jest.fn(() => (req, res, next) => {
  req.session = {
    cookie: {},
    ...sessionData,
    destroy: (...args) => destroyMock(...args), // delegate to the mocked function
  };
  next();
});

mockSession.setSession = (data) => {
  sessionData = data;
};

mockSession.clearSession = () => {
  sessionData = null;
};

mockSession.setDestroyMock = (fn) => {
  destroyMock = fn;
};

module.exports = mockSession;
