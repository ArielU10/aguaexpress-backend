// -------------------- IMPORTACIONES --------------------
require('dotenv').config(); // cargar .env lo primero
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./config/database');

// ⭐ IMPORTAR RELACIONES DE BD - DEBE IR ANTES DE LAS RUTAS
require('./models/tableRelations');

// -------------------- RUTAS --------------------
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const addressRoutes = require('./routes/addressRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const createDefaultAdmin = require('./controllers/createDefaultAdmin');

// -------------------- CONFIGURACIÓN --------------------
const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// -------------------- MIDDLEWARES --------------------
app.use(morgan(isProd ? 'combined' : 'dev'));

// CORS: en prod, restringe; en dev, permite todo
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.includes('*') ? true : allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// -------------------- RUTAS BÁSICAS --------------------
app.get('/', (_req, res) => res.send('✅ Backend AguaExpress funcionando'));
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

// -------------------- MONTAR RUTAS API --------------------
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// -------------------- 404 Y ERRORES --------------------
app.use((_req, res) => res.status(404).json({ message: 'Recurso no encontrado' }));
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

// -------------------- INICIO DEL SERVIDOR --------------------
(async () => {
  try {
    // 1) Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos verificada');

    // 2) Sync controlado por entorno (solo una vez en prod con DB_SYNC=true)
    if (!isProd || process.env.DB_SYNC === 'true') {
      await sequelize.sync({ alter: true });
      console.log('🛠️ Tablas sincronizadas (sync activado)');
    } else {
      console.log('🔒 Producción: sin sync automático (usa migraciones)');
    }

    // Mostrar tablas/modelos cargados
    console.log('📋 Modelos registrados:');
    Object.keys(sequelize.models).forEach((modelName) => {
      console.log(`   • ${sequelize.models[modelName].tableName}`);
    });

    // 3) Crear/verificar admin por defecto
    try {
      await createDefaultAdmin();
      console.log('👤 Usuario administrador verificado/creado');
    } catch (e) {
      console.warn('⚠️ Error creando admin por defecto:', e?.message || e);
    }

    // 4) Levantar servidor
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://0.0.0.0:${PORT}`);
      console.log(`🌐 API base: /api`);
      console.log('📊 Endpoints principales:');
      console.log('   • POST /api/auth/login - Iniciar sesión');
      console.log('   • GET  /api/products - Listar productos');
      console.log('   • POST /api/orders - Crear pedido');
      console.log('   • GET  /api/addresses - Listar direcciones');
    });

    // Graceful shutdown (opcional pero recomendado)
    const shutdown = () => {
      console.log('\n🛑 Recibida señal de apagado, cerrando servidor...');
      server.close(async () => {
        try {
          await sequelize.close();
          console.log('🔌 Conexión a BD cerrada. Bye!');
          process.exit(0);
        } catch (e) {
          console.error('❌ Error cerrando BD:', e);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    // 🔎 Diagnóstico ampliado para detectar el motivo exacto
    console.error('❌ Error al iniciar:', err?.message);
    console.error('🔍 Stack:', err?.stack);
    console.error('ℹ️ NODE_ENV:', process.env.NODE_ENV);
    console.error('ℹ️ Tiene DATABASE_URL:', !!process.env.DATABASE_URL);

    try {
      if (process.env.DATABASE_URL) {
        const u = new URL(process.env.DATABASE_URL);
        console.error(
          `ℹ️ DB host: ${u.hostname}, db: ${u.pathname.slice(1)}, sslmode: ${u.searchParams.get('sslmode')}`
        );
      }
    } catch (e) {
      console.error('⚠️ No se pudo parsear DATABASE_URL para logging:', e?.message);
    }

    process.exit(1);
  }
})();
