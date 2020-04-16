const { Sequelize, sequelize} = require('../database/sequelize');
const Model = Sequelize.Model;

class Movie extends Model {}
Movie.init({
    movieid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
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
    rating: Sequelize.NUMBER, // derived data, I think thats how sites like imdb works
    poster: Sequelize.STRING
},  {
    sequelize,
    timestamps: false,
    modelName: 'movie'
});

module.exports = Movie;