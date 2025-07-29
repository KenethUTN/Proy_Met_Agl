import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import '../../styles/auth/Register.css'
import '../../styles/auth/Background.css'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const success = await register(name, email, password)
      
      if (success) {
        navigate('/')
      } else {
        setError('Error al crear la cuenta. Es posible que el email ya esté registrado.')
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
      <div className="register-container">
        <h2 className="register-title">
          Crear Cuenta
        </h2>
        
        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
        <div className="register-field">
          <label className="register-label">
            Nombre:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="register-input"
            placeholder="Tu nombre completo"
          />
        </div>

        <div className="register-field">
          <label className="register-label">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
            placeholder="tu@email.com"
          />
        </div>
        
        <div className="register-field">
          <label className="register-label">
            Contraseña:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div className="register-field">
          <label className="register-label">
            Confirmar Contraseña:
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="register-input"
            placeholder="Repite tu contraseña"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="register-button"
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>

      <p className="register-footer">
        ¿Ya tienes cuenta?{' '}
        <Link 
          to="/login" 
          className="register-link"
        >
          Inicia sesión aquí
        </Link>
      </p>
    </div>
    </div>
  )
}

export default Register