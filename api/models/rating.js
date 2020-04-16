const { Sequelize, sequelize} = require('../database/sequelize');
const Model = Sequelize.Model;

const Movie = require('../models/movie');
const User = require('../models/user');

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
        allowNull: false,
        references: {
            model: 'users',
            key: 'userid'
        }
    },
    movieid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'movies',
            key: 'movieid'
        }
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

Rating.belongsTo(Movie, { foreignKey: 'movieid' });
Movie.hasMany(Rating, { foreignKey: 'movieid' });
Rating.belongsTo(User, { foreignKey: 'userid' });
User.hasMany(Rating, { foreignKey: 'userid' });

module.exports = Rating;