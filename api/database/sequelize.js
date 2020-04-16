const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE, process.env.LOGIN, process.env.PASS, {
  host: process.env.HOST,
  dialect: 'postgres'
});

module.exports = {
    'Sequelize': Sequelize,
    'sequelize': sequelize
};