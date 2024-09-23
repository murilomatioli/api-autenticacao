const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  celular: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fixo: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

module.exports = User;
