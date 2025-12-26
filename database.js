// Import mysql2 with promise support
const mysql = require("mysql2/promise");

// Creating a connection pool to make the handling of multiple database requests more efficient
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "salobro123",
  database: process.env.DB_NAME || "ca2_database",
  waitForConnections: true,
  connectionLimit: 10
});

// Function that ensures the required table exists before inserting any data
async function ensureTable() {
  
  const sql = `
    CREATE TABLE IF NOT EXISTS mysql_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(20) NOT NULL,
      last_name VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone_number CHAR(10) NOT NULL,
      eircode CHAR(6) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

    // Execute the CREATE TABLE query
  await pool.query(sql);
}

async function insertUser({ first_name, last_name, email, phone_number, eircode }) {
  const sql = `
    INSERT INTO mysql_table (first_name, last_name, email, phone_number, eircode)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [first_name, last_name, email, phone_number, eircode];
  await pool.execute(sql, values);
}

// Make the pool available for export along with the function that checks the table
module.exports = { pool, ensureTable, insertUser };
