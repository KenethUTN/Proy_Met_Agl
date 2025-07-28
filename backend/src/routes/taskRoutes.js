const express = require('express');
const { 
    createTask, 
    getTasks, 
    getTask,
    updateTask,
    deleteTask,
    completeTask 
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Crear tarea
router.post('/', authMiddleware, createTask);

// Listar tareas
router.get('/', authMiddleware, getTasks);

// Obtener una tarea específica
router.get('/:id', authMiddleware, getTask);

// TASK-023: Editar tarea
router.put('/:id', authMiddleware, updateTask);

// TASK-024: Eliminar tarea
router.delete('/:id', authMiddleware, deleteTask);

// Marcar como completada (mantener compatibilidad)
router.patch('/:id/complete', authMiddleware, completeTask);

module.exports = router;