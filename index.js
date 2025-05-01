require('dotenv').config();
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

// RUN SERVER
app.listen(process.env.SERVER_PORT, '0.0.0.0', () => {
    console.log('💻 Server running at: http://0.0.0.0:'.concat(process.env.SERVER_PORT));
});

/*

app.get('/api/status', (req, res) => {
    if (!req.body.jwt || isInvalidJwt(req.body.jwt)) {
        return res.status(400).json({ error: 'Faltan credenciales' });
    } else {
        return res.json(getContainerStatusResponse());
    }
});

app.put('/api/off', (req, res) => {
    if (!req.body.jwt || isInvalidJwt(req.body.jwt)) {
        return res.status(400).json({ error: 'Faltan credenciales' });
    } if (!req.body.service) {
        return res.status(400).json({ error: 'Servicio no especificado' });
    } else {
        stopContainer(req.body.service);
        return res.json(getContainerStatusResponse());
    }
});

app.put('/api/on', (req, res) => {
    if (!req.body.jwt || isInvalidJwt(req.body.jwt)) {
        return res.status(400).json({ error: 'Faltan credenciales' });
    } if (!req.body.service) {
        return res.status(400).json({ error: 'Servicio no especificado' });
    } else {
        startContainer(req.body.service);
        return res.json(getContainerStatusResponse());
    }
});

// INI CONTAINER METHODS
function getContainerStatusResponse() {
    const minecraftStatus = "running";  // TODO "docker status minecraft" 
    const vintageStory = "running";     // TODO "docker status vintage_story" 
    return {
        status: 'ok', services: {
            minecraft: minecraftStatus,
            vintage_story: vintageStory
        }
    };
}

function stopContainer(service) {
    // TODO Execute "docker stop service"
}

function startContainer(service) {
    // TODO Execute "docker start service"
    switch (service) {
        case "minecraft":
            // docker stop vintageStory
            // docker start minecraft
            break;
        case "vintageStory":
            // docker stop minecraft
            // docker start vintageStory
            break;
    }
}
// END CONTAINER METHODS

// INI DB METHODS
function updateIntentosLogin(username, intentos) {
    const updateIntentos = db.prepare('UPDATE USUARIOS SET INTENTOS = ? WHERE USERNAME = ?');
    updateIntentos.run(intentos, username);
}

function disableUser(username) {
    const updateIntentos = db.prepare('UPDATE USUARIOS SET ACTIVO = FALSE WHERE USERNAME = ?');
    updateIntentos.run(username);
}
// END DB METHODS

*/