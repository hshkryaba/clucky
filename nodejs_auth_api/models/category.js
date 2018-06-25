const { db, DataTypes } = require('../db/db_sequelize_connection.js');

const Category = db.define('category', {
  name: {
    type: DataTypes.STRING(128),
    allowNull: false
  }
});

module.exports = Category;
