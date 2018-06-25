const { db, DataTypes } = require('../db/db_sequelize_connection.js');

const Answer = db.define('answer', {
  answer: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Answer;
