const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Importar para asociar luego

const Order = sequelize.define('Order', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  deliveryTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pendiente', 'en camino', 'entregado'),
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'orders',
  timestamps: true
});

// Relación: Un usuario tiene muchos pedidos
User.hasMany(Order, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
Order.belongsTo(User, {
  foreignKey: 'userId'
});

module.exports = Order;
