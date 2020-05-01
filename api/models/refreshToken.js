const { Sequelize, sequelize } = require('../database/sequelize');

module.exports = sequelize.define('refreshtoken', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    token : Sequelize.STRING
},{
    timestamps: false
})