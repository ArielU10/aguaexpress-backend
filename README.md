
````markdown
# AguaExpress - Backend

Este es el backend de **AguaExpress**, desarrollado con Node.js, Express y Sequelize. Gestiona usuarios, autenticación y pedidos para la aplicación móvil de una microempresa de reparto de agua.

---

## 🚀 Tecnologías

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT (autenticación)
- Dotenv (variables de entorno)

---

## 📁 Estructura sugerida

```text
aguaexpress-backend/
├── config/
│   └── database.js
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── .env
├── .gitignore
├── package.json
└── index.js
````

---

## ⚙️ Instalación

1. Clona el repositorio

   ```bash
   git clone https://github.com/tuusuario/aguaexpress-backend.git
   ```

2. Instala las dependencias

   ```bash
   npm install
   ```

3. Crea un archivo `.env` con las siguientes variables:

   ```env
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=aguaexpress
   DB_PORT=5432
   SECRET_KEY=tu_clave_secreta
   ```

4. (Opcional) Ejecuta las migraciones si usas Sequelize CLI

---

## 🚀 Scripts

```bash
npm run dev    # Ejecuta el servidor con nodemon
npm start      # Ejecuta el servidor en producción
```

---

## ✅ Estado del proyecto

Este backend forma parte del proyecto universitario **AguaExpress**, enfocado en digitalizar el proceso de pedidos de agua embotellada para negocios pequeños. Se diseñó con arquitectura MVC y está listo para escalar en futuras versiones.

```

```
