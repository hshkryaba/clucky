const { db, DataTypes } = require('../db/db_sequelize_connection.js');

const Question = db.define('question', {
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  views: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    allowNull: false
  }
});

module.exports = Question;
