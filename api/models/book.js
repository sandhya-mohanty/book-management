const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Book extends Model {}

Book.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    genre: { type: DataTypes.STRING, allowNull: false },
    isbn: { type: DataTypes.STRING, allowNull: false, unique: true },
    coverImage: { type: DataTypes.STRING, allowNull: true },
    averageRating: { type: DataTypes.FLOAT, defaultValue: 0 },
  },
  { sequelize, modelName: 'Book' }
);

module.exports = Book;
