const { db, DataTypes } = require('../db/db_sequelize_connection.js');

const Vote = db.define('vote', {
  vote: {
    type: DataTypes.ENUM('like', 'dislike'),
    allowNull: false
  }
});

module.exports = Vote;
