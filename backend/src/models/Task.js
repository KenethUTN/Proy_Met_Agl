const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es requerido'],
        trim: true,
        maxlength: [100, 'El título no puede exceder 100 caracteres']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
    },
    completed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'overdue'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['baja', 'media', 'alta'],
        default: 'media'
    },
    categories: {
        type: [String],
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;