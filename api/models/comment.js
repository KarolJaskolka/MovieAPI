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
        allowNull: false
    },
    movieid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    threadid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    date: Sequelize.DATE
},  {
    sequelize,
    timestamps: false,
    modelName: 'comment'
});

module.exports = Comment;