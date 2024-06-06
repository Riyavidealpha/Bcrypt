const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Auth = sequelize.define('auth', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
module.exports = Auth;