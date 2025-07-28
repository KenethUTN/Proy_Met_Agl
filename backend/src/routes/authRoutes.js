const express = require('express');
const { register, login, verifyToken } = require('../controllers/authController');

// Crear router de Express
const router = express.Router();

router.post('/register', register);


router.post('/login', login);


router.get('/verify', verifyToken);


router.get('/status', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Servicio de autenticación activo',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;