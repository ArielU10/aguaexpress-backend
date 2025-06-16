// -------------------- IMPORTACIONES --------------------
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes'); // 👈 asegúrate que coincide el nombre real

// -------------------- MODELOS --------------------
require('./models/User');
require('./models/Order');

// -------------------- CONFIGURACIÓN --------------------
const app = express();
const PORT = 3000;

// -------------------- MIDDLEWARES --------------------
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// -------------------- RUTAS --------------------
app.get('/', (req, res) => {
  res.send('✅ Backend AguaExpress funcionando');
});

app.use('/api', userRoutes);
app.use('/api', orderRoutes);
app.use('/api/auth', authRoutes); // login: POST /api/auth/login

// -------------------- SINCRONIZACIÓN Y SERVIDOR --------------------
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('📦 Modelos sincronizados');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al iniciar el servidor o conectar la DB:', err.message);
  });
