const config = require('../config');
const Sequelize = require('sequelize');
const { DataTypes, Deferrable, Op, QueryTypes, TableHints } = Sequelize;

const db = new Sequelize(config.db.dbname, config.db.dbuser, config.db.dbpass, {
  host: config.db.dbhost,
  port: config.db.dbport,
  dialect: 'mysql',
  logging: false && console.dir,
  operatorsAliases: false,

  define: {
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci'
    },
    timestamps: true,
    paranoid: false,
    underscored: true,
    freezeTableName: false
  },

  query: {
    plain: false,
    raw: false
  },

  sync: { force: false },

  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err.code || '' + ' ' + err.message);
  });

module.exports = { db, DataTypes, Deferrable, Op, QueryTypes, TableHints };
