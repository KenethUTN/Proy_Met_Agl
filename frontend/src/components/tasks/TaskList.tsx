import React from 'react'
import { Task } from '../../services/taskService'
import TaskCard from './TaskCard'
import '../../styles/tasks/TaskList.css'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  error: string | null
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onStatusChange: (id: string, completed: boolean) => void
  onCompleteTask?: (id: string) => void
  onCreateTask?: () => void
  currentFilter: string
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  error,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onCompleteTask,
  onCreateTask,
  currentFilter
}) => {
  const getEmptyMessage = () => {
    return 'No tienes tareas creadas aún'
  }

  if (loading) {
    return (
      <div className="task-list-container">
        <div className="loading-state">
          <div className="loading-spinner">⏳</div>
          <h3>Cargando tareas...</h3>
          <p>Un momento por favor</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="task-list-container">
        <div className="error-state">
          <div className="error-state-icon">⚠️</div>
          <h3>Error al cargar tareas</h3>
          <p>{error}</p>
          <button 
            className="btn-secondary"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-container">
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>¡Comienza a organizar tus tareas!</h3>
          <p>{getEmptyMessage()}</p>
          <button 
            className="btn-primary"
            onClick={() => {
              if (onCreateTask) {
                onCreateTask()
              } else {
                // Fallback al método anterior
                const createButton = document.querySelector('.welcome-header .btn-primary') as HTMLButtonElement;
                if (createButton) createButton.click();
              }
            }}
          >
            Crear mi primera tarea
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="task-list-container">
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onStatusChange={onStatusChange}
            onComplete={onCompleteTask}
          />
        ))}
      </div>
    </div>
  )
}

export default TaskList
