const express = require('express');
const router = express.Router();
const usuarioService = require('./service');

router.post('/usuario/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await usuarioService.login(username, password);
        req.session.user = user;
        res.json({ ok: true, user });
    } catch (err) {
        res.status(401).json({ ok: false, message: err.message });
    }
});

router.post('/usuario/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ ok: false, message: 'Username y password son requeridos' });
        }

        // Simulación de la operación de registro
        // Verifica si ya existe el usuario
        const existingUser = await usuarioService.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ ok: false, message: 'El usuario ya existe' });
        }

        // Si todo es correcto, registramos el nuevo usuario
        const newUser = await usuarioService.register(username, password);
        res.json({ ok: true, user: newUser });
    } catch (err) {
        console.error(err);  // Log para ver qué está fallando
        res.status(500).json({ ok: false, message: 'Error al registrar el usuario' });
    }
});

// Exportamos el router
module.exports = router;
