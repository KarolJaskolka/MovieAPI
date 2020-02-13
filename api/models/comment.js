const Movie = require('../models/movie');
const User = require('../models/user');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sequelize = new Sequelize(process.env.DATABASE, process.env.LOGIN, process.env.PASS, {
    host: process.env.HOST,
    dialect: 'postgres'
});

class Comment extends Model {}
Comment.init({
    commentid: {
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
    threadid: {
        type: Sequelize.INTEGER,
        references: {
            model: 'comments',
            key: 'commentid'
        }
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: Sequelize.DATE
},  {
    sequelize,
    timestamps: false,
    modelName: 'comment'
});

Comment.belongsTo(Movie, { foreignKey: 'movieid'});
Comment.belongsTo(User, { foreignKey: 'userid'});
Comment.hasOne(Comment, { foreignKey: 'threadid' });

module.exports = Comment;