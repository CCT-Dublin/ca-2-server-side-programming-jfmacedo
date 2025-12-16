const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ca2_database",
  waitForConnections: true,
  connectionLimit: 10
});
