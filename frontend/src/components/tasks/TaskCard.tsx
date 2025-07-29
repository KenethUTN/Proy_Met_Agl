import React, { useState } from 'react'
import { Task } from '../../services/taskService'
import '../../styles/tasks/TaskCard.css'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, completed: boolean) => void
  onComplete?: (id: string) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange,
  onComplete
}) => {
  // const [showDropdown, setShowDropdown] = useState(false) // Removido: no se usa

  const getPriorityClass = (priority: string) => {
    switch(priority) {
      case 'alta': return 'priority-high'
      case 'media': return 'priority-medium'  
      case 'baja': return 'priority-low'
      default: return 'priority-medium'
    }
  }

  const getStatusClass = (completed: boolean) => {
    return completed ? 'status-completed' : 'status-pending'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Mañana'
    if (diffDays === -1) return 'Ayer'
    if (diffDays < 0) return `Hace ${Math.abs(diffDays)} días`
    if (diffDays <= 7) return `En ${diffDays} días`
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const handleStatusChange = (newCompleted: boolean) => {
    onStatusChange(task._id!, newCompleted)
  }

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      onDelete(task._id!)
    }
  }

  const handleCompleteToggle = () => {
    if (task.completed) {
      // Si está completada, cambiar a pendiente
      onStatusChange(task._id!, false)
    } else {
      // Si no está completada, usar la función específica de completar
      if (onComplete) {
        onComplete(task._id!)
      } else {
        // Fallback al método anterior
        onStatusChange(task._id!, true)
      }
    }
  }

  return (
    <div className={`task-card ${getStatusClass(task.completed)}`}>
      {/* Header con acciones principales */}
      <div className="task-header">
        <div className="task-meta-info">
          <span className="task-category">{task.category}</span>
          <div className={`task-priority ${getPriorityClass(task.priority)}`}>
            <span className="priority-indicator"></span>
            <span className="priority-text">{task.priority.toUpperCase()}</span>
          </div>
        </div>
        
        <div className="task-main-actions">
          {/* Botón de completar con texto verde */}
          <button 
            className={`complete-btn-text ${task.completed ? 'completed' : 'incomplete'}`}
            title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
            onClick={handleCompleteToggle}
          >
            {task.completed ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Completada
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Completar
              </>
            )}
          </button>

          {/* Botón de editar */}
          <button 
            className="edit-btn" 
            title="Editar tarea"
            onClick={() => onEdit(task)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          
          {/* Botón de eliminar - X ROJA */}
          <button 
            className="delete-btn" 
            title="Eliminar tarea"
            onClick={handleDelete}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="task-content">
        <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.title}
        </h3>
        <p className={`task-description ${task.completed ? 'completed' : ''}`}>
          {task.description}
        </p>
        
        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="task-tags">
            {task.tags.map((tag, index) => (
              <span key={index} className="task-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer con status y fechas */}
      <div className="task-footer">
        <div className="task-status-section">
          <div className="status-simple">
            <span className={`status-badge ${task.completed ? 'completed' : 'pending'}`}>
              {task.completed ? (
                <>
                  <span className="status-icon">✅</span>
                  <span>Completada</span>
                </>
              ) : (
                <>
                  <span className="status-icon">⏳</span>
                  <span>Pendiente</span>
                </>
              )}
            </span>
          </div>
        </div>
        
        <div className="task-dates">
          <div className="due-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="date-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
