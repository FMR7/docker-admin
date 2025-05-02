require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const path = require('path');
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
    console.log('🧩 Connected to:', res.rows[0]);
})();

// Certificates info
const options = {
    key: fs.readFileSync('../certs/key.pem'),
    cert: fs.readFileSync('../certs/cert.pem'),
};

// RUN SERVER
https.createServer(options, app).listen(process.env.SERVER_PORT, () => {
    console.log('💻 Server running at: https://0.0.0.0:'.concat(process.env.SERVER_PORT));
});