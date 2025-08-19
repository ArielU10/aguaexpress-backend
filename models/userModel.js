const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[0-9]{7,15}$/
    }
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      is: /^[0-9]{10}$/
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Prefiero no Decirlo', 'Otro'),
    allowNull: true
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('client', 'admin'),
    allowNull: false,
    defaultValue: 'client'
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
