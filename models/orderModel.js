const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id_order: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  deliveryTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      'pendiente',
      'confirmado',
      'preparado',
      'en_camino',
      'entregado',
      'cancelado_cliente',
      'cancelado_admin',
      'fallido_no_encontrado'
    ),
    defaultValue: 'pendiente'
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_address: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deliveryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  instructions: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('efectivo', 'transferencia'),
    allowNull: false,
    defaultValue: 'efectivo'
  }
}, {
  tableName: 'orders',
  timestamps: true // 🔹 crea createdAt y updatedAt automáticamente
});


module.exports = Order;
