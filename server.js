const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware for reading form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// POST route to receive the form
app.post("/submit", (req, res) => {
  const { first_name, second_name, email, phone_number, eircode } = req.body;

  const errors = [];

  if (!/^[A-Za-z0-9]{1,20}$/.test(first_name))
    errors.push("Invalid first name");

  if (!/^[A-Za-z0-9]{1,20}$/.test(second_name))
    errors.push("Invalid second name");

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    errors.push("Invalid email");

  if (!/^\d{10}$/.test(phone_number))
    errors.push("Invalid phone number");

  if (!/^[0-9][A-Za-z0-9]{5}$/.test(eircode))
    errors.push("Invalid eircode");

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  // For now, we're only returning success
  res.json({
    success: true,
    message: "Server-side validation passed"
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
