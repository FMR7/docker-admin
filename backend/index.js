const path = require('path');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}
const https = require('https');
const fs = require('fs');
const express = require('express');
const rateLimit = require('express-rate-limit');
const authJwt = require('./src/middleware/authJwt');
const csrfHeader = require('./src/middleware/csrfHeader');
const usuarioRoutes = require('./src/user/userController');
const containerRoutes = require('./src/container/containerController');
const containerConfigRoutes = require('./src/containerConfig/containerConfigController');

const db = require('./src/config/db');

const app = express();
app.use(express.json());

// Rate limiter for frontend asset and SPA entrypoint requests
const frontendLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter for API requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => apiPublicPaths.has(req.path), // Skip rate limiting for public paths
});


// JWT + header-based CSRF protection
const apiPublicPaths = new Set([
  '/usuario/login',
  '/usuario/register',
  '/usuario/logged'
]);

app.use('/api', apiLimiter);

app.use('/api', (req, res, next) => {
  if (apiPublicPaths.has(req.path)) {
    return next();
  }
  authJwt(req, res, (err) => {
    if (err) return next(err);
    csrfHeader(req, res, next);
  });
});

app.use('/api', usuarioRoutes);
app.use('/api', containerRoutes);
app.use('/api', containerConfigRoutes);

// FRONTEND
const frontendPath = path.join(__dirname, '../frontend/dist');
// Apply rate limiter to static assets and frontend entrypoint
app.use(frontendLimiter);
app.use(express.static(frontendPath));

// Redirect all requests, except for API requests
app.get(/^\/(?!api).*/, frontendLimiter, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});


// DB INFO
(async () => {
  const res = await db.query('SELECT current_database(), current_user');
  console.log('🧩 DB connection:', res.rows[0]);
})();

console.log('SSL_KEY:', process.env.SSL_KEY);
console.log('SSL_CERT:', process.env.SSL_CERT);

const PORT = process.env.PORT || 3000;

// RUN SERVER
if (process.env.SSL === 'true') {
  if (!process.env.SSL_KEY || !process.env.SSL_CERT) {
    console.error('❌ SSL is enabled but SSL_KEY or SSL_CERT is not set in .env');
    process.exit(1);
  } else {
    console.log('✅ SSL is enabled');
  }

  // Certificates info
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  };

  https.createServer(options, app).listen(PORT, () => {
    console.log(`💻 Server running at: https://localhost:${PORT}`);
  });
} else {
  console.warn('⚠️  SSL is disabled');

  app.listen(PORT, () => {
    console.log(`💻 Server running at: http://localhost:${PORT}`);
  });
}
