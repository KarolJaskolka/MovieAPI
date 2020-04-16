const { Sequelize, sequelize} = require('../database/sequelize');
const Model = Sequelize.Model;

class User extends Model {}
User.init({
    userid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    login: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    firstname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phone: Sequelize.STRING,
    birth: Sequelize.DATEONLY,
    avatar: Sequelize.STRING
},  {
    sequelize,
    timestamps: false,
    modelName: 'user'
});

module.exports = User;