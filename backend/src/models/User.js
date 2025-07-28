const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema del modelo User para MongoDB
const userSchema = new mongoose.Schema({
    // Campo de email único y requerido
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'Formato de email inválido'
        }
    },
    
    // Campo de contraseña hasheada
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    
    // Nombre del usuario (opcional)
    name: {
        type: String,
        trim: true,
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    
    // Estado de la cuenta
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    // Opciones del esquema
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    versionKey: false // Elimina el campo __v
});

// Middleware pre-save: Hashea la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    // Solo hashear la contraseña si ha sido modificada
    if (!this.isModified('password')) return next();
    
    try {
        // Generar salt y hashear contraseña
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método de instancia: Comparar contraseña
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error al comparar contraseñas');
    }
};

// Método de instancia: Convertir a JSON (excluye datos sensibles)
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    
    // Eliminar campos sensibles del objeto JSON
    delete userObject.password;
    
    return userObject;
};

// Método estático: Buscar usuario por email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// Método estático: Verificar si existe un usuario con el email
userSchema.statics.emailExists = async function(email) {
    const user = await this.findOne({ email: email.toLowerCase() });
    return !!user;
};

// Crear índices para optimizar consultas
userSchema.index({ createdAt: -1 });

// Crear el modelo
const User = mongoose.model('User', userSchema);

module.exports = User;