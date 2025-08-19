const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id_product: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(30),
    unique: true,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('botellon', 'botella', 'dispenser'),
    allowNull: false
  },
  capacity_ml: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_returnable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'products',
  timestamps: true // createdAt, updatedAt
});

module.exports = Product;
