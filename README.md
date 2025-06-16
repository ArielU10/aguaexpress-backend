
```markdown
# AguaExpress - Frontend

Este es el frontend web (modo app) de **AguaExpress**, desarrollado con React + Vite. La aplicación permite a los usuarios (clientes y administrador) realizar y gestionar pedidos de botellones de agua.

---

## 🚀 Tecnologías

- React
- Vite
- Axios
- React Router
- Context API (para autenticación y estado global)
- Tailwind CSS (opcional para estilos)
- dotenv

---

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

---

## ⚙️ Instalación

1. Clona el repositorio  
   ```bash
   git clone https://github.com/tuusuario/aguaexpress-frontend.git
````

2. Instala las dependencias

   ```bash
   npm install
   ```

3. Configura el archivo `.env`:

   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. Ejecuta el servidor de desarrollo

   ```bash
   npm run dev
   ```

---

## ✅ Estado del proyecto

Este frontend es parte del proyecto integrador universitario **AguaExpress**, enfocado en pedidos móviles de agua embotellada para microempresas. Está diseñado para ser intuitivo, ligero y de fácil mantenimiento.

