// Configuración base para las peticiones a la API
const API_BASE_URL = 'http://localhost:3000/api'

// Interfaz para las respuestas de la API
interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

// Interfaz para datos de autenticación
interface AuthData {
  user: {
    _id: string
    name: string
    email: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  token: string
}

// Función helper para hacer peticiones HTTP
const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  // Agregar token de autorización si existe
  const token = localStorage.getItem('token')
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      'Authorization': `Bearer ${token}`
    }
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  const response = await fetch(url, finalOptions)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición')
  }

  return data
}

// Funciones específicas para autenticación
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthData>> => {
    return makeRequest<AuthData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  },

  register: async (name: string, email: string, password: string): Promise<ApiResponse<AuthData>> => {
    return makeRequest<AuthData>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })
  },

  verify: async (): Promise<ApiResponse<{ user: AuthData['user'] }>> => {
    return makeRequest<{ user: AuthData['user'] }>('/auth/verify')
  }
}

// Exportar también la función helper para otros usos
export { makeRequest }
export type { ApiResponse, AuthData }
