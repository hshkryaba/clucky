const config = require('../config');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: config.db.dbhost,
  port: config.db.dbport,
  database: config.db.dbname,
  user: config.db.dbuser,
  password: config.db.dbpass
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
