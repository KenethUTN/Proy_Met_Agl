import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'
import { Task, CreateTaskData, UpdateTaskData, taskService } from '../services/taskService'
import TaskList from './tasks/TaskList'
import TaskModal from './tasks/TaskModal'
import '../styles/color_pallete.css'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskCompleted,
    getTaskStats
  } = useTasks()

  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [loadTasks, user])

  const stats = getTaskStats()

  // Handlers para el modal
  const handleCreateTask = () => {
    setEditingTask(null)
    setShowModal(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTask(null)
  }

  const handleSaveTask = async (taskData: CreateTaskData | UpdateTaskData): Promise<boolean> => {
    try {
      if (editingTask) {
        // Para editar, usamos UpdateTaskData
        await updateTask(editingTask._id!, taskData as UpdateTaskData)
      } else {
        // Para crear, convertimos CreateTaskData agregando completed por defecto
        const newTaskData: CreateTaskData & { completed: boolean } = {
          ...taskData as CreateTaskData,
          completed: false
        }
        await createTask(newTaskData)
      }
      handleCloseModal()
      return true
    } catch (error) {
      console.error('Error saving task:', error)
      return false
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleStatusChange = async (id: string, completed: boolean) => {
    try {
      await updateTaskCompleted(id, completed)
    } catch (error) {
      console.error('Error updating task completed:', error)
    }
  }

  const handleCompleteTask = async (id: string) => {
    try {
      await taskService.completeTask(id)
      // Actualizar la lista de tareas después de completar
      loadTasks()
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  return (
    <div className="main-screen logged-in">
      <div className="main-container">
        {/* Header de bienvenida */}
        <div className="welcome-header">
          <div className="welcome-content">
            <h1 className="welcome-title">
              ¡Bienvenido, {user?.name}!
            </h1>
            <p className="welcome-subtitle">
              Gestiona tus tareas de manera eficiente y mantén tu productividad al máximo
            </p>
          </div>
          <div className="quick-actions">
            <button 
              onClick={handleCreateTask}
              className="btn-primary"
            >
              Nueva Tarea
            </button>
            <button 
              onClick={() => logout()}
              className="btn-secondary"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.pending}</h3>
              <p>Pendientes</p>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.completed}</h3>
              <p>Completadas</p>
            </div>
          </div>
        </div>

        {/* Sección principal de tareas */}
        <div className="tasks-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Mis Tareas</h2>
            </div>
            <button 
              onClick={handleCreateTask}
              className="btn-add-task"
              title="Agregar nueva tarea"
            >
              +
            </button>
          </div>

          {/* Lista de tareas */}
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onCompleteTask={handleCompleteTask}
            onCreateTask={handleCreateTask}
            currentFilter="all"
          />
        </div>
      </div>

      {/* Modal de tareas */}
      {showModal && (
        <TaskModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSaveTask}
          task={editingTask}
          mode={editingTask ? 'edit' : 'create'}
        />
      )}
    </div>
  )
}

export default Dashboard
