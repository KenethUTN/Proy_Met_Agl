import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import '../../styles/auth/Login.css'
import '../../styles/auth/Background.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password)
      
      if (success) {
        navigate('/')
      } else {
        setError('Email o contraseña incorrectos. Por favor, verifica tus credenciales.')
      }
    } catch (error) {
      setError('Error de conexión. Por favor, inténtalo de nuevo.')
    }
    
    setIsLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background simple que SÍ funciona */}
      <div className="auth-background"></div>
      <div className="wave-container">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      
      {/* Contenedor del formulario */}
      <div className="login-container">
        <h2 className="login-title">
          Iniciar Sesión
        </h2>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
        <div className="login-field">
          <label className="login-label">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
            placeholder="tu@email.com"
          />
        </div>
        
        <div className="login-field">
          <label className="login-label">
            Contraseña:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
            placeholder="••••••••"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="login-button"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p className="login-footer">
        ¿No tienes cuenta?{' '}
        <Link 
          to="/register" 
          className="login-link"
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
    </div>
  )
}

export default Login