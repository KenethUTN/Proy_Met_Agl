import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/color_pallete.css'
import '../styles/LandingPage.css'

const LandingPage = () => {
  return (
    <div className="main-screen landing">
      <div className="main-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-badge">✨ Gestión de Tareas Inteligente</span>
              <h1 className="hero-title">
                Organiza tu vida con <span className="gradient-text">TaskFlow</span>
              </h1>
              <p className="hero-subtitle">
                La plataforma todo-en-uno que revoluciona tu productividad. Gestiona tareas, proyectos y equipos de manera cómoda.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn-hero-primary">
                  Comenzar Gratis
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link to="/login" className="btn-hero-secondary">
                  Iniciar Sesión
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Gratuito</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Disponible</span>
                </div>
                <div className="stat">
                  <span className="stat-number">∞</span>
                  <span className="stat-label">Tareas</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-card card-1">
                <div className="card-header">
                  <div className="status-dot completed"></div>
                  <span>Completado</span>
                </div>
                <h4>Diseñar nueva interfaz</h4>
                <div className="card-tags">
                  <span>UI/UX</span>
                  <span>Figma</span>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="card-header">
                  <div className="status-dot pending"></div>
                  <span>Pendiente</span>
                </div>
                <h4>Reunión con cliente</h4>
                <div className="card-meta">📅 Mañana 10:00</div>
              </div>
              <div className="floating-card card-3">
                <div className="card-header">
                  <div className="status-dot in-progress"></div>
                  <span>En Progreso</span>
                </div>
                <h4>Desarrollo API</h4>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '65%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="features-header">
            <span className="section-badge">Características</span>
            <h2>Todo lo que necesitas para ser más productivo</h2>
            <p>Herramientas diseñadas para equipos modernos que buscan eficiencia y resultados</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Gestión Eficiente</h3>
              <p>Organiza y administra todas tus tareas de forma clara y estructurada para maximizar tu productividad.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Organización por Prioridades</h3>
              <p>Clasifica tus tareas por prioridad y fechas límite para enfocarte en lo que realmente importa.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Seguimiento Visual</h3>
              <p>Visualiza el progreso de tus tareas con estados claros y un dashboard organizado.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Acceso Multiplataforma</h3>
              <p>Accede a tus tareas desde cualquier dispositivo, en cualquier momento y lugar.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Datos Seguros</h3>
              <p>Tu información está protegida con medidas de seguridad modernas y confiables.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Interfaz Intuitiva</h3>
              <p>Diseño moderno y fácil de usar que te permite gestionar tus tareas sin complicaciones.</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
          <div className="benefits-content">
            <div className="benefits-text">
              <span className="section-badge">Beneficios</span>
              <h2>Aumenta tu productividad hasta un 300%</h2>
              <p>TaskFlow no es solo una herramienta más. Es tu compañero de productividad que se adapta a tu ritmo de trabajo y te ayuda a lograr más en menos tiempo.</p>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">✅</div>
                  <div>
                    <h4>Reduce el estrés</h4>
                    <p>Mantén todo organizado y bajo control</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🎯</div>
                  <div>
                    <h4>Mejora tu enfoque</h4>
                    <p>Concentrarte en lo que realmente importa</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">💡</div>
                  <div>
                    <h4>Optimiza tu tiempo</h4>
                    <p>Automatiza tareas repetitivas y gana horas</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="benefits-visual">
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span className="preview-title">TaskFlow Dashboard</span>
                </div>
                <div className="preview-content">
                  <div className="preview-sidebar">
                    <div className="preview-item active">📋 Mis Tareas</div>
                    <div className="preview-item">📊 Analytics</div>
                    <div className="preview-item">📅 Calendario</div>
                  </div>
                  <div className="preview-main">
                    <div className="preview-card completed"></div>
                    <div className="preview-card pending"></div>
                    <div className="preview-card in-progress"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>¿Listo para revolucionar tu productividad?</h2>
            <p>Únete a miles de profesionales que ya transformaron su forma de trabajar</p>
            <div className="cta-actions">
              <Link to="/register" className="btn-cta-primary">
                Comenzar Gratis Ahora
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <span className="cta-note">✨ Sin tarjeta de crédito • Setup en 2 minutos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
