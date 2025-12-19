import express from "express";
import helmet from "helmet";
import pool from "./database.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
    },
  })
);

pool.query("DESCRIBE mysql_table", (err) => {
  if (err) {
    console.error("Schema incorrect or table missing in MySQL!");
  } else {
    console.log("Schema verified – mysql_table is ready");
  }
});

// ROUTES
// ======================
app.post("/submit", async (req, res) => {
  try {
    const { first_name, second_name, email, phone_number, eircode } = req.body;

    if (!first_name || !second_name || !email || !phone_number || !eircode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const insertQuery = `
      INSERT INTO mysql_table (first_name, second_name, email, phone_number, eircode)
      VALUES (?, ?, ?, ?, ?)
    `;

    await pool.query(insertQuery, [
      first_name,
      second_name,
      email,
      phone_number,
      eircode,
    ]);

    return res.status(201).json({
      message: "Data submitted successfully",
      data: { first_name, second_name, email },
    });
  } catch (err) {
    console.error("Error inserting user:", err.message);
    return res.status(500).json({ error: "Server error inserting record" });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running ✔️");
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Check port failure
server.on("error", (err) => {
  console.error("Failed to start server:", err.message);
});
