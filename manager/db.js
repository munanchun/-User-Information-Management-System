const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost', // 数据库主机地址
  user: 'root', // 数据库用户名
  password: '127229', // 数据库密码
  database: 'vx', // 数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();