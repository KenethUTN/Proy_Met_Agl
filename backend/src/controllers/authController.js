const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Genera un token JWT para el usuario
 * @param {string} userId - ID del usuario
 * @returns {string} - Token JWT
 */
const generateToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: '7d' // Token válido por 7 días
        }
    );
};

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validación básica de entrada
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Validar longitud mínima de contraseña
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.emailExists(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Crear nuevo usuario
        const userData = {
            email,
            password,
            ...(name && { name })
        };

        const user = new User(userData);
        await user.save();

        // Generar token JWT
        const token = generateToken(user._id);

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: user.toJSON(),
                token
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);

        // Manejo de errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: errorMessages
            });
        }

        // Error genérico del servidor
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};



// GET /api/auth/verify
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        // Verificar y decodificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscar usuario
        const user = await User.findById(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        // Respuesta exitosa
        res.status(200).json({
            success: true,
            message: 'Token válido',
            data: {
                user: user.toJSON()
            }
        });

    } catch (error) {
        console.error('Error verificando token:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    register,
    verifyToken
};