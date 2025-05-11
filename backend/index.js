const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const usuarioRoutes = require('./src/user/userController');
const containerRoutes = require('./src/container/containerController');

const db = require('./src/config/db');

const app = express();
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use('/api', usuarioRoutes);
app.use('/api', containerRoutes);


// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

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
