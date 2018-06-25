const { db, DataTypes } = require('../db/db_sequelize_connection.js');

const Tag = db.define('tag', {
  name: {
    type: DataTypes.STRING(128),
    allowNull: false
  }
});

module.exports = Tag;
