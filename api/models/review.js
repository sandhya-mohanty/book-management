// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
const User = require('./user');
const Book = require('./book');
const sequelize = require('../config/database');
const { DataTypes, Model } = require('sequelize');

class Review extends Model {}

Review.init(
  {
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: 'Review' }
);

Review.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(Book, { foreignKey: 'bookId', onDelete: 'CASCADE' });

module.exports = Review;
