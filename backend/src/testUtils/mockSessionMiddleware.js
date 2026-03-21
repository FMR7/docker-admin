const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-with-secure-secret';

let userData = null;

const mockAuthJwt = jest.fn(() => (req, res, next) => {
  if (userData) {
    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
    req.headers.authorization = `Bearer ${token}`;
    req.user = userData;
  }
  next();
});

mockAuthJwt.setUser = (data) => {
  userData = data;
};

mockAuthJwt.clearUser = () => {
  userData = null;
};

mockAuthJwt.generateToken = (data) => {
  return jwt.sign(data, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
};

module.exports = mockAuthJwt;
