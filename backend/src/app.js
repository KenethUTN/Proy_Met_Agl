const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/authRoutes');

// Configuración principal de la aplicación Express
const createApp = () => {
    const app = express();

    // Configuración de CORS
    app.use(cors({
        origin: process.env.NODE_ENV === 'production' 
            ? ['https://tu-dominio.com'] 
            : ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true
    }));

    // Middleware para parsing de JSON
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Middleware de logging
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp} - ${req.method} ${req.path}`);
        next();
    });

    // Ruta de salud del servidor
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'OK',
            message: 'Task Manager API is running',
            timestamp: new Date().toISOString()
        });
    });

    // Configuración de rutas de la API
    app.use('/api/auth', authRoutes);

    // Middleware de manejo de rutas no encontradas
    app.use('*', (req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint not found'
        });
    });

    // Middleware global de manejo de errores
    app.use((err, req, res, next) => {
        console.error('Error stack:', err.stack);
        
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        
        res.status(statusCode).json({
            success: false,
            message: message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    });

    return app;
};

module.exports = createApp;