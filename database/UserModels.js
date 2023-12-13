const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../bin/database');

const User = sequelize.define('users', {
    // Model attributes are defined here
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,

    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    access_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    firm_name: {
        type: DataTypes.STRING,
        allowNull: false

    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false

    },
    password: {
        type: DataTypes.STRING,
        allowNull: false

    },
    has_mail: {
        type: DataTypes.BOOLEAN,
        allowNull: true

    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    last_received_mail: {
        type: DataTypes.DATE,
        allowNull: true
    },
    last_picked_up: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    // Other model options go here
});

module.exports = { User }
