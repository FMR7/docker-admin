const express = require('express');
const router = express.Router();
const usuarioService = require('./service');

router.post('/usuario/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        return res.status(400).json({ ok: false, message: 'Username required' });
    }

    if (!password) {
        return res.status(400).json({ ok: false, message: 'Password required' });
    }

    try {
        const user = await usuarioService.signin(username, password);
        req.session.user = user;
        return res.json({ ok: true, user });
    } catch (err) {
        return res.status(401).json({ ok: false, message: err.message });
    }
});

router.post('/usuario/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res.status(400).json({ ok: false, message: 'Username required' });
        }

        if (!password) {
            return res.status(400).json({ ok: false, message: 'Password required' });
        }

        const existingUser = await usuarioService.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ ok: false, message: 'Username already exists' });
        }

        const newUser = await usuarioService.signup(username, password);
        return res.json({ ok: true, user: newUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: 'Error signup' });
    }
});

router.get('/usuario/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ ok: false, message: 'Error closing session' });
        }
        return res.json({ ok: true, message: 'Session closed' });
    });
});

router.get('/usuario/user', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }
    return res.json({ ok: true, user: req.session.user });
});

router.get('/usuario/logged', (req, res) => {
    if (!req.session.user) {
        return res.json({ ok: false, message: 'Not authenticated' });
    }
    return res.json({ ok: true, message: 'Authenticated' });
});

module.exports = router;
