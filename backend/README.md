# Task Manager - Backend

Sistema de gestión de tareas personales desarrollado con Node.js y MongoDB.

## Descripción

Este proyecto permite a los usuarios gestionar sus tareas personales de manera eficiente, organizando actividades por prioridad, fechas límite y categorías para mejorar la productividad personal.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript
- **Express.js**: Framework web para Node.js
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Para autenticación de usuarios
- **bcryptjs**: Para hash de contraseñas

## Requisitos Previos

- Node.js (versión 14 o superior)
- MongoDB (local o remoto)
- npm o yarn

## Instalación

1. Clona el repositorio:

```bash
git clone [url-del-repositorio] -b dev
cd task-manager-backend
```

2. Instala las dependencias:

```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv cors
```

3. Configura las variables de entorno:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones específicas.

4. Inicia MongoDB en tu sistema local o asegúrate de tener acceso a una instancia remota.

## Ejecución

### Modo desarrollo:

```bash
npm run dev
```

### Modo producción:

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000` (o el puerto especificado en las variables de entorno).

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Inicio de sesión

### Tareas

- `GET /api/tasks` - Obtener todas las tareas del usuario
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
