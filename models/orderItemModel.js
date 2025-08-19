// models/orderItemModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id_order_item: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_product: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {                 // cantidad de ese producto en el pedido
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  unitPrice: {                // precio unitario en el momento del pedido (congelado)
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {                 // quantity * unitPrice
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['id_order', 'id_product'] } // evita duplicados del mismo producto en un pedido
  ]
});

module.exports = OrderItem;
