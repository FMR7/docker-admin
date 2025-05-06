let sessionData = null;

const mockSession = jest.fn(() => (req, res, next) => {
  req.session = {
    ...sessionData,  // Ensure sessionData is spread into req.session
    destroy: jest.fn((callback) => {  // Mock the destroy method
      // Simulate an asynchronous destroy operation
      if (sessionData) {
        sessionData = null;  // Destroy session data
        callback(null);  // No error
      } else {
        callback(new Error("Failed to destroy session"));  // Simulate an error if no session exists
      }
    }),
  };
  next();
});

mockSession.setSession = (data) => {
  sessionData = data;
};

mockSession.clearSession = () => {
  sessionData = null;
};

module.exports = mockSession;
