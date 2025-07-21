import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

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

    const success = await login(email, password)
    
    if (success) {
      navigate('/')
    } else {
      setError('Credenciales inválidas')
    }
    setIsLoading(false)
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '100px auto', 
      padding: '20px',
      backgroundColor: 'var(--white)',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: 'var(--marian-blue)',
        marginBottom: '30px'
      }}>
        Iniciar Sesión
      </h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          textAlign: 'center', 
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#ffeaea',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px',
            color: 'var(--marian-blue)',
            fontWeight: '500'
          }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid var(--light-cyan)',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px',
            color: 'var(--marian-blue)',
            fontWeight: '500'
          }}>
            Contraseña:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid var(--light-cyan)',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--pacific-cyan)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p style={{ 
        textAlign: 'center', 
        marginTop: '20px',
        color: 'var(--marian-blue)'
      }}>
        ¿No tienes cuenta?{' '}
        <Link 
          to="/register" 
          style={{ 
            color: 'var(--pacific-cyan)',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  )
}

export default Login