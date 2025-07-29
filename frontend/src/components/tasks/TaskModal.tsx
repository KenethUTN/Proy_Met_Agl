import React, { useState, useEffect } from 'react'
import { Task, CreateTaskData, UpdateTaskData } from '../../services/taskService'
import '../../styles/tasks/TaskModal.css'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: CreateTaskData | UpdateTaskData) => Promise<boolean>
  task?: Task | null
  mode: 'create' | 'edit'
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task, 
  mode 
}) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: 'media',
    category: '',
    dueDate: '',
    tags: []
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Resetear formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && task) {
        setFormData({
          title: task.title,
          description: task.description,
          priority: task.priority,
          category: task.category,
          dueDate: task.dueDate.split('T')[0], // Formato YYYY-MM-DD para input date
          tags: task.tags || []
        })
      } else {
        setFormData({
          title: '',
          description: '',
          priority: 'media',
          category: '',
          dueDate: '',
          tags: []
        })
      }
      setTagInput('')
      setErrors({})
    }
  }, [isOpen, mode, task])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }
    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es requerida'
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha de vencimiento es requerida'
    } else {
      const selectedDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.dueDate = 'La fecha no puede ser anterior a hoy'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      // Para crear tareas nuevas, añadir completed por defecto
      const submitData = mode === 'create' 
        ? { ...formData, completed: false }
        : formData
      
      const success = await onSubmit(submitData)
      if (success) {
        onClose()
      }
    } catch (error) {
      console.error('Error submitting task:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Estilos inline para debug
  const inputStyle = {
    padding: '14px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    fontFamily: 'inherit',
    background: '#fafbfc',
    color: '#1f2937',
    width: '100%',
    boxSizing: 'border-box' as const
  }

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151',
    marginBottom: '4px'
  }

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        className="modal-container" 
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header Mejorado */}
        <div 
          className="modal-header"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            padding: '20px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div className="modal-title-section">
            <div className="modal-icon">
              {mode === 'create' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              )}
            </div>
            <div>
              <h2 className="modal-title">
                {mode === 'create' ? 'Nueva Tarea' : 'Editar Tarea'}
              </h2>
              <p className="modal-subtitle">
                {mode === 'create' 
                  ? 'Crea una nueva tarea para organizar tu trabajo' 
                  : 'Modifica los detalles de tu tarea'
                }
              </p>
            </div>
          </div>
          <button 
            className="modal-close" 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Contenido del formulario */}
        <div 
          className="modal-body"
          style={{
            padding: '24px 30px',
            flex: 1,
            overflowY: 'auto',
            minHeight: 0
          }}
        >
          <form onSubmit={handleSubmit} className="task-form">
            {/* Título */}
            <div 
              className="form-section"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingBottom: '24px',
                borderBottom: '1px solid #e5e7eb'
              }}
            >
              <div 
                className="form-group"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <label 
                  htmlFor="title" 
                  className="form-label"
                  style={labelStyle}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                  Título de la tarea *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  style={{
                    ...inputStyle,
                    borderColor: errors.title ? '#ef4444' : '#e5e7eb',
                    backgroundColor: errors.title ? '#fef2f2' : '#fafbfc'
                  }}
                  placeholder="¿Qué necesitas hacer?"
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              {/* Descripción */}
              <div className="form-group">
                <label 
                  htmlFor="description" 
                  className="form-label"
                  style={labelStyle}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  Descripción *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  style={{
                    ...inputStyle,
                    minHeight: '100px',
                    resize: 'vertical' as const,
                    lineHeight: '1.5',
                    borderColor: errors.description ? '#ef4444' : '#e5e7eb',
                    backgroundColor: errors.description ? '#fef2f2' : '#fafbfc'
                  }}
                  placeholder="Describe detalladamente lo que necesitas hacer..."
                  rows={4}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>
            </div>

            {/* Prioridad y Categoría */}
            <div 
              className="form-section"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingBottom: '24px',
                borderBottom: '1px solid #e5e7eb'
              }}
            >
              <div 
                className="form-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px'
                }}
              >
                <div 
                  className="form-group"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <label 
                    htmlFor="priority" 
                    className="form-label"
                    style={labelStyle}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Prioridad
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="form-select"
                    style={{
                      ...inputStyle,
                      cursor: 'pointer',
                      backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      paddingRight: '44px'
                    }}
                  >
                    <option value="baja">🟢 Baja</option>
                    <option value="media">🟡 Media</option>
                    <option value="alta">🔴 Alta</option>
                  </select>
                </div>

                <div 
                  className="form-group"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <label 
                    htmlFor="category" 
                    className="form-label"
                    style={labelStyle}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    Categoría *
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`form-input ${errors.category ? 'error' : ''}`}
                    style={{
                      ...inputStyle,
                      borderColor: errors.category ? '#ef4444' : '#e5e7eb',
                      backgroundColor: errors.category ? '#fef2f2' : '#fafbfc'
                    }}
                    placeholder="Trabajo, Personal, Estudio..."
                  />
                  {errors.category && <span className="error-message">{errors.category}</span>}
                </div>
              </div>

              {/* Fecha */}
              <div 
                className="form-group"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <label 
                  htmlFor="dueDate" 
                  className="form-label"
                  style={labelStyle}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Fecha de vencimiento *
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={`form-input ${errors.dueDate ? 'error' : ''}`}
                  style={{
                    ...inputStyle,
                    borderColor: errors.dueDate ? '#ef4444' : '#e5e7eb',
                    backgroundColor: errors.dueDate ? '#fef2f2' : '#fafbfc'
                  }}
                />
                {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
              </div>
            </div>

            {/* Etiquetas */}
            <div 
              className="form-section"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div 
                className="form-group"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <label 
                  className="form-label"
                  style={labelStyle}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  Etiquetas
                </label>
                <div 
                  className="tags-input-container"
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'stretch'
                  }}
                >
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="form-input tags-input"
                    style={{
                      ...inputStyle,
                      flex: 1,
                      margin: 0
                    }}
                    placeholder="Escribe una etiqueta y presiona Enter"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddTag} 
                    disabled={!tagInput.trim()}
                    className="add-tag-btn"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0 16px',
                      color: 'white',
                      cursor: !tagInput.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '48px',
                      opacity: !tagInput.trim() ? 0.5 : 1
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
                
                {formData.tags && formData.tags.length > 0 && (
                  <div 
                    className="tags-display"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '12px'
                    }}
                  >
                    {formData.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="tag-chip"
                        style={{
                          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                          color: '#0369a1',
                          padding: '8px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: '1px solid #bae6fd'
                        }}
                      >
                        #{tag}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveTag(tag)} 
                          className="tag-remove"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0369a1'
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer con botones */}
        <div 
          className="modal-footer"
          style={{
            background: '#f9fafb',
            padding: '16px 30px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            borderTop: '1px solid #e5e7eb',
            flexShrink: 0
          }}
        >
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-secondary"
            style={{
              padding: '10px 20px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              background: 'white',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary"
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                {mode === 'create' ? 'Crear Tarea' : 'Guardar Cambios'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskModal
