import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // 数据库用户名
  password: '123456', // 数据库密码
  database: 'gomoku_db', // 数据库名称
});

export default pool.promise(); // 使用 ESM 导出
