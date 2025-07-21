import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/color_pallete.css'
import '../styles/layout/Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo/Brand */}
        <div className="nav-brand">
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <h2 className="nav-logo">TaskFlow</h2>
          </Link>
        </div>

        {/* Desktop Menu - Solo mostrar si está logueado */}
        {user && (
          <div className="desktop-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/tasks" className="nav-link">Mis Tareas</Link>
            <Link to="/categories" className="nav-link">Categorías</Link>
            <Link to="/calendar" className="nav-link">Calendario</Link>
          </div>
        )}

        {/* User Actions - Mostrar según estado de autenticación */}
        <div className="user-actions">
          {user ? (
            // Usuario logueado
            <>
              <button className="nav-button">+ Nueva Tarea</button>
              <div className="nav-profile">
                <span className="nav-profile-text">{user.name}</span>
                <div className="nav-avatar">{user.name.charAt(0).toUpperCase()}</div>
              </div>
              <button className="nav-button logout-button" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            // Usuario no logueado
            <>
              <Link to="/login" className="nav-button auth-button">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="nav-button auth-button register">
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMenu}
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {user ? (
            // Usuario logueado - menú móvil
            <>
              <Link to="/dashboard" className="mobile-link">Dashboard</Link>
              <Link to="/tasks" className="mobile-link">Mis Tareas</Link>
              <Link to="/categories" className="mobile-link">Categorías</Link>
              <Link to="/calendar" className="mobile-link">Calendario</Link>
              <button className="mobile-button">+ Nueva Tarea</button>
              <button className="mobile-button logout-button" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            // Usuario no logueado - menú móvil
            <>
              <Link to="/login" className="mobile-link">Iniciar Sesión</Link>
              <Link to="/register" className="mobile-link">Registrarse</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar