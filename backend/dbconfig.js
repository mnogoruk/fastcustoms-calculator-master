const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host:  "127.0.0.1",
  port:  "3306",
  user:  "root",
  password: "1111",
  database: "fastcustoms",
  connectionLimit: 100
};

const pool = mysql.createPool(config);
pool.execute("SET time_zone='+03:00';");

module.exports = pool;
