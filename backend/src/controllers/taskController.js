const Task = require('../models/Task');

// Crear una tarea
exports.createTask = async (req, res) => {
    try {
        const { title, description, priority, categories, dueDate } = req.body;
        const user = req.user._id;
        const task = new Task({
            title,
            description,
            priority,
            categories,
            dueDate,
            user
        });
        await task.save();
        res.status(201).json({ success: true, task });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Listar tareas del usuario autenticado
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener una tarea específica
exports.getTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ _id: id, user: req.user._id });
        
        if (!task) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
        }
        
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// TASK-023: Editar una tarea
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Campos permitidos para actualización
        const allowedUpdates = ['title', 'description', 'priority', 'categories', 'dueDate', 'completed'];
        const actualUpdates = {};
        
        // Filtrar solo los campos permitidos
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                actualUpdates[key] = updates[key];
            }
        });
        
        // Validar que hay algo que actualizar
        if (Object.keys(actualUpdates).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No se proporcionaron campos válidos para actualizar'
            });
        }
        
        // Buscar y actualizar la tarea
        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user._id },
            actualUpdates,
            { 
                new: true, // Retorna el documento actualizado
                runValidators: true // Ejecuta las validaciones del modelo
            }
        );
        
        if (!task) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
        }
        
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// TASK-024: Eliminar una tarea
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        
        const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
        
        if (!task) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Tarea eliminada exitosamente',
            task // Retornamos la tarea eliminada por si el frontend la necesita
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Marcar tarea como completada (mantener compatibilidad)
exports.completeTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { completed: true },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
        }
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};