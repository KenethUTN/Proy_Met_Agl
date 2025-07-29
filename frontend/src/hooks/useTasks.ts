import { useState, useEffect, useCallback } from 'react'
import { taskService, Task, CreateTaskData, UpdateTaskData } from '../services/taskService'

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar todas las tareas
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const tasksData = await taskService.getTasks()
      setTasks(tasksData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tareas')
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Crear nueva tarea
  const createTask = useCallback(async (taskData: CreateTaskData) => {
    try {
      setError(null)
      const newTask = await taskService.createTask(taskData)
      setTasks(prev => [newTask, ...prev])
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear tarea')
      console.error('Error creating task:', err)
      throw err
    }
  }, [])

  // Actualizar tarea
  const updateTask = useCallback(async (id: string, taskData: UpdateTaskData) => {
    try {
      setError(null)
      const updatedTask = await taskService.updateTask(id, taskData)
      setTasks(prev => prev.map(task => task._id === id ? updatedTask : task))
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar tarea')
      console.error('Error updating task:', err)
      throw err
    }
  }, [])

  // Actualización parcial
  const patchTask = useCallback(async (id: string, updates: Partial<UpdateTaskData>): Promise<boolean> => {
    try {
      setError(null)
      const updatedTask = await taskService.patchTask(id, updates)
      setTasks(prev => prev.map(task => task._id === id ? updatedTask : task))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar tarea')
      console.error('Error patching task:', err)
      return false
    }
  }, [])

  // Eliminar tarea
  const deleteTask = useCallback(async (id: string) => {
    try {
      setError(null)
      await taskService.deleteTask(id)
      setTasks(prev => prev.filter(task => task._id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar tarea')
      console.error('Error deleting task:', err)
      throw err
    }
  }, [])

  // Cambiar estado de tarea
  const updateTaskCompleted = useCallback(async (id: string, completed: boolean): Promise<boolean> => {
    try {
      setError(null)
      const updatedTask = await taskService.updateTaskCompleted(id, completed)
      setTasks(prev => prev.map(task => task._id === id ? updatedTask : task))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado')
      console.error('Error updating task completed:', err)
      return false
    }
  }, [])

  // Filtrar tareas por completado
  const getTasksByCompleted = useCallback((completed?: boolean) => {
    if (completed === undefined) return tasks
    return tasks.filter(task => task.completed === completed)
  }, [tasks])

  // Obtener estadísticas
  const getTaskStats = useCallback(() => {
    const completedTasks = tasks.filter(t => t.completed === true)
    const pendingTasks = tasks.filter(t => t.completed !== true)
    
    const stats = {
      total: tasks.length,
      completed: completedTasks.length,
      pending: pendingTasks.length,
    }
    
    return {
      ...stats,
      completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }
  }, [tasks])

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    patchTask,
    deleteTask,
    updateTaskCompleted,
    getTasksByCompleted,
    getTaskStats,
    clearError: () => setError(null)
  }
}
