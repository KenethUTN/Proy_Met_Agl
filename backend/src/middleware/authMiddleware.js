// Middleware de autenticación simple
// Supone que el usuario está autenticado y su ID viene en el header 'x-user-id'
// En un entorno real, aquí se verificaría un JWT

const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const userId = req.header('x-user-id');
        if (!userId) {
            return res.status(401).json({ success: false, message: 'No autenticado: falta x-user-id' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Error de autenticación' });
    }
};

