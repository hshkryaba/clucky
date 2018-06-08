const config = require('../config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.db.dbname, config.db.dbuser, config.db.dbpass, {
  host: config.db.dbhost,
  port: config.db.dbport,
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
