const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sequelize = new Sequelize(process.env.DATABASE, process.env.LOGIN, process.env.PASS, {
    host: process.env.HOST,
    dialect: 'postgres'
});

class Rating extends Model {}
Rating.init({
    ratingid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    movieid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    stars: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    date: Sequelize.DATE
},  {
    sequelize,
    timestamps: false,
    modelName: 'rating'
});

module.exports = Rating;