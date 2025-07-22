const mongoose = require('mongoose');

// Configuración y conexión a la base de datos MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Manejo de eventos de conexión
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected from MongoDB');
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

// Cierra la conexión a la base de datos
const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
};

module.exports = {
    connectDB,
    closeDB
};