let sessionData = null;

const mockSession = jest.fn(() => (req, res, next) => {
  req.session = sessionData;
  next();
});

mockSession.setSession = (data) => {
  sessionData = data;
};

module.exports = mockSession;
