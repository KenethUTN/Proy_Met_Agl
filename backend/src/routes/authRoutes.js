const express = require('express');
const { register, login, verifyToken } = require('../controllers/authController');

// Crear router de Express
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Público
 * @body    { email: string, password: string, name?: string }
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión de usuario
 * @access  Público
 * @body    { email: string, password: string }
 */

router.post('/login', login);

/**
 * @route   GET /api/auth/verify
 * @desc    Verificar token JWT válido
 * @access  Privado (requiere token)
 * @header  Authorization: Bearer <token>
 */

router.get('/verify', verifyToken);

/**
 * @route   GET /api/auth/status
 * @desc    Estado del servicio de autenticación
 * @access  Público
 */
router.get('/status', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Servicio de autenticación activo',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;