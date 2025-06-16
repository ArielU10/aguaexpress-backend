## 🧾 `aguaexpress-frontend` (React + Vite)

```markdown
# AguaExpress - Frontend

Este es el frontend web (modo app) de **AguaExpress**, desarrollado con React + Vite. La aplicación permite a los usuarios (clientes y administrador) realizar y gestionar pedidos de botellones de agua.

## 🚀 Tecnologías

- React
- Vite
- Axios
- React Router
- Context API (para autenticación y estado global)
- Tailwind CSS (opcional para estilos)
- dotenv

## 📁 Estructura sugerida

```

aguaexpress-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── hooks/
│   ├── styles/
│   └── App.jsx
├── .env
├── vite.config.js
├── index.html
└── package.json

````

## ⚙️ Instalación

1. Clona el repositorio  
   `git clone https://github.com/tuusuario/aguaexpress-frontend.git`

2. Instala las dependencias  
   `npm install`

3. Configura el archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
````

4. Ejecuta el servidor de desarrollo
   `npm run dev`

---

## 🧾 `aguaexpress-backend` (Express + Sequelize + PostgreSQL)

```markdown
# AguaExpress - Backend

Backend de AguaExpress, desarrollado con Express y Sequelize. Gestiona usuarios, pedidos y autenticación para la aplicación móvil.

## 🚀 Tecnologías

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT
- Dotenv

## 📁 Estructura base

```

aguaexpress-backend/
├── config/
│   └── database.js
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── .env
├── package.json
└── index.js

````

## ⚙️ Instalación

1. Clona el repositorio  
   `git clone https://github.com/tuusuario/aguaexpress-backend.git`

2. Instala las dependencias  
   `npm install`

3. Crea el archivo `.env`:

```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=aguaexpress
DB_PORT=5432
SECRET_KEY=tu_clave_secreta
````

4. Corre migraciones si usas Sequelize CLI

5. Ejecuta el servidor
   `npm run dev`

