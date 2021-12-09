const mysql = require('mysql');
const session = require('express-session');
var MySQLStore = require('express-mysql-session')(
  session
);

require('dotenv').config();



var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

});

var options = {
  checkExpirationInterval: 900000,
  endConnectionOnClose: true,
  clearExpired: true,
};
var sessionStore = new MySQLStore(
  options,
  connection
);

module.exports = { connection, sessionStore };
