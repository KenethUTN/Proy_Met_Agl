import React from 'react'
import { useAuth } from '../context/AuthContext'
import Dashboard from './Dashboard'
import LandingPage from './LandingPage'

const MainScreen = () => {
  const { user } = useAuth()

  // Decidir qué componente mostrar basado en la autenticación
  return user ? <Dashboard /> : <LandingPage />
}

export default MainScreen
