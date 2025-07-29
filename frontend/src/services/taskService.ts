// import { authAPI } from '../utils/api' // No se usa actualmente
// import API_CONFIG from '../config/api' // No se usa actualmente

export interface Task {
  _id?: string
  title: string
  description: string
  priority: 'baja' | 'media' | 'alta'
  category: string
  categories?: string[]
  dueDate: string
  tags?: string[]
  completed: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateTaskData {
  title: string
  description: string
  priority: 'baja' | 'media' | 'alta'
  category: string
  dueDate: string
  tags?: string[]
  completed?: boolean
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  completed?: boolean
}

class TaskService {
  private async makeRequest(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (!token || !user._id) {
      throw new Error('Usuario no autenticado')
    }

    const response = await fetch(`http://localhost:3000/api${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-user-id': user._id,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Obtener todas las tareas del usuario
  async getTasks(): Promise<Task[]> {
    const data = await this.makeRequest('/tasks')
    const tasks = data.tasks || []
    
    // Transformar datos del backend al formato del frontend
    return tasks.map((task: any) => ({
      ...task,
      category: task.categories?.[0] || '',  // Tomar la primera categoría como category principal
    }))
  }

  // Obtener una tarea específica
  async getTask(id: string): Promise<Task> {
    const data = await this.makeRequest(`/tasks/${id}`)
    const task = data.task
    
    return {
      ...task,
      category: task.categories?.[0] || '',
    }
  }

  // Crear nueva tarea
  async createTask(taskData: CreateTaskData): Promise<Task> {
    const requestBody: any = {
      ...taskData,
      categories: [taskData.category],  // Convertir category a categories array
    }
    delete requestBody.category
    
    const data = await this.makeRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    })
    
    const task = data.task
    return {
      ...task,
      category: task.categories?.[0] || '',
    }
  }

  // Actualizar tarea completa
  async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
    const requestBody: any = {
      ...taskData,
      categories: taskData.category ? [taskData.category] : undefined,
    }
    delete requestBody.category
    
    const data = await this.makeRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestBody),
    })
    
    const task = data.task
    return {
      ...task,
      category: task.categories?.[0] || '',
    }
  }

  // Actualización parcial (PATCH) - Usar el endpoint completeTask del backend
  async patchTask(id: string, updates: Partial<UpdateTaskData>): Promise<Task> {
    let endpoint = `/tasks/${id}`
    let method = 'PUT'
    let body: any = updates
    
    // Si solo se está actualizando a completado, usar el endpoint específico
    if (Object.keys(updates).length === 1 && updates.completed === true) {
      endpoint = `/tasks/${id}/complete`
      method = 'PATCH'
      body = {}
    } else {
      // Para otras actualizaciones, usar PUT con el body completo
      if (updates.category) {
        body = {
          ...updates,
          categories: [updates.category],
        }
        delete body.category
      }
    }
    
    const data = await this.makeRequest(endpoint, {
      method,
      body: JSON.stringify(body),
    })
    
    const task = data.task
    return {
      ...task,
      category: task.categories?.[0] || '',
    }
  }

  // Eliminar tarea
  async deleteTask(id: string): Promise<void> {
    await this.makeRequest(`/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  // Cambiar estado de tarea (método rápido para completar)
  async updateTaskCompleted(id: string, completed: boolean): Promise<Task> {
    return this.patchTask(id, { completed })
  }

  // Completar tarea específicamente (usando el endpoint PATCH)
  async completeTask(id: string): Promise<Task> {
    const data = await this.makeRequest(`/tasks/${id}/complete`, {
      method: 'PATCH',
    })
    
    const task = data.task
    return {
      ...task,
      category: task.categories?.[0] || '',
    }
  }
}

export const taskService = new TaskService()
