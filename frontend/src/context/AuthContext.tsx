import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '../utils/api'

interface User {
  _id: string
  name: string
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un token y usuario en localStorage
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      
      if (savedToken && savedUser) {
        try {
          // Verificar si el token sigue siendo válido
          const data = await authAPI.verify()
          if (data.success) {
            setUser(data.data.user)
          } else {
            // Token inválido, limpiar localStorage
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        } catch (error) {
          console.error('Error verificando autenticación:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const data = await authAPI.login(email, password)

      if (data.success) {
        const { user, token } = data.data
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        setIsLoading(false)
        return true
      } else {
        console.error('Error en login:', data.message)
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Error en login:', error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const data = await authAPI.register(name, email, password)

      if (data.success) {
        const { user, token } = data.data
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        setIsLoading(false)
        return true
      } else {
        console.error('Error en registro:', data.message)
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Error en registro:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
