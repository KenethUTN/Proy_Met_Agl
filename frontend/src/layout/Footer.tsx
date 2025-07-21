import React from 'react'
import '../styles/color_pallete.css'
import '../styles/layout/Footer.css'

const Footer = () => {
  const teamMembers = [
    'Kevin Córdoba Rivera',
    'Edú Ramírez Campos',
    'Karina Selles Obando',
    'Keneth González Castillo',
    'Sebastián Peraza Desanti',
    'Susan Guzmán Vega'
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo y descripción */}
          <div className="footer-section">
            <h3 className="footer-logo">TaskFlow</h3>
            <p className="footer-description">
              Sistema de gestión de tareas desarrollado con metodologías ágiles
            </p>
          </div>

          {/* Equipo de desarrollo */}
          <div className="footer-section">
            <h4 className="footer-title">Equipo de Desarrollo</h4>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member">
                  <span className="member-name">{member}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Información del proyecto */}
          <div className="footer-section">
            <h4 className="footer-title">Proyecto</h4>
            <div className="project-info">
              <p>Metodologías Ágiles</p>
              <p>2025</p>
              <p>Universidad Técnica Nacional</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="copyright">
            © 2025 TaskFlow - Desarrollado por estudiantes de Metodologías Ágiles
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer