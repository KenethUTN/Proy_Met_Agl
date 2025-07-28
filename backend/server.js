require('dotenv').config();
const createApp = require('./src/app');
const { connectDB } = require('./src/config/database');

const startServer = async () => {
    try {
        // Conectar a la base de datos
        await connectDB();
        
        // Crear la aplicación Express
        console.log('DEBUG: Llamando a createApp() en server.js');
        const app = createApp();
        
        // Configurar el puerto
        const PORT = process.env.PORT || 3000;
        
        // Iniciar el servidor
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
        });

        // Manejo graceful de cierre del servidor
        const gracefulShutdown = (signal) => {
            console.log(`\n${signal} received. Shutting down gracefully...`);
            
            server.close(() => {
                console.log('HTTP server closed');
                process.exit(0);
            });

            // Forzar el cierre si no se cierra en 10 segundos
            setTimeout(() => {
                console.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        // Escuchar señales de terminación
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Manejo de errores no capturados
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err);
            process.exit(1);
        });

        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Rejection:', err);
            server.close(() => {
                process.exit(1);
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Iniciar el servidor
startServer();