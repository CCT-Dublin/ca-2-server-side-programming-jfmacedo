const mysql = require("mysql2/promise");

// Adjust if necessary (username, password, database)
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "salobro123",
  database: "ca2_database",
  waitForConnections: true,
  connectionLimit: 10
});

// Create the table if it doesn't exist
async function ensureTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(20) NOT NULL,
      second_name VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone_number CHAR(10) NOT NULL,
      eircode CHAR(6) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(sql);
}

// Enter valid data.
async function insertUser(data) {
  await ensureTable();

  const sql = `
    INSERT INTO users (first_name, second_name, email, phone_number, eircode)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    data.first_name,
    data.second_name,
    data.email,
    data.phone_number,
    data.eircode
  ];

  await pool.execute(sql, values);
}

module.exports = { insertUser };
