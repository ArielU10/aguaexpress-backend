const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Address = sequelize.define('Address', {
  id_address: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  label: {
    type: DataTypes.ENUM('Casa', 'Trabajo', 'Otro'),
    allowNull: true
  },
  mainStreet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  secondaryStreet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sector: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_user' 
}
}, {
  tableName: 'addresses',
  timestamps: false
});

module.exports = Address;
