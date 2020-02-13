const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sequelize = new Sequelize(process.env.DATABASE, process.env.LOGIN, process.env.PASS, {
    host: process.env.HOST,
    dialect: 'postgres'
});

class Movie extends Model {}
Movie.init({
    movieid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // unique name for prettier GET request, 
    // because movies' titles are not unique in real world
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    director: Sequelize.STRING,
    genre: Sequelize.STRING,
    releasedate: Sequelize.DATEONLY,
    duration: Sequelize.INTEGER, // minutes
    description: Sequelize.STRING,
    rating: Sequelize.NUMBER

},  {
    sequelize,
    timestamps: false,
    modelName: 'movie'
});

module.exports = Movie;