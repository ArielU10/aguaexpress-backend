const bcrypt = require('bcrypt');
const { User, Order, Address } = require('../models/tableRelations');

async function createDefaultAdmin() {
  try {
    // 1. Verificar si ya existe un usuario admin por email
    const existingAdmin = await User.findOne({ where: { email: 'admin@admin.com' } });
    if (existingAdmin) {
      console.log('✅ Admin ya existe. No se creó nuevamente.');
      return;
    }

    // 2. Crear nuevo admin
    const plainPassword = 'admin123'; // Puedes cambiarla por algo más seguro
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await User.create({
      fullName: 'Admin AguaExpress',
      phone: '0998000597',
      cedula: '1726727546', // ✅ NUEVO CAMPO AGREGADO
      email: 'admin@admin.com',
      password: hashedPassword,
      gender: 'Masculino',
      birthDate: '1998-03-04',
      role: 'admin'
    });

    console.log('🎉 Usuario admin creado exitosamente');
  } catch (error) {
    console.error('❌ Error al crear admin por defecto:', error.message);
  }
}

module.exports = createDefaultAdmin;
