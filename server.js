const path = require("path");
const express = require("express");
const helmet = require("helmet");
const { ensureTable, insertUser } = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"]
      }
    }
  })
);

app.use(express.static(path.join(__dirname, "public")));

const nameRegex = /^[A-Za-z0-9]{1,20}$/;
const phoneRegex = /^\d{10}$/;
const eircodeRegex = /^\d[A-Za-z0-9]{5}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePayload(body) {
  const errors = [];

  const first_name = (body.first_name || "").trim();
  const last_name = (body.last_name || "").trim();
  const email = (body.email || "").trim();
  const phone_number = (body.phone_number || "").trim();
  const eircode = (body.eircode || "").trim();

  if (!nameRegex.test(first_name)) errors.push("Invalid first_name");
  if (!nameRegex.test(last_name)) errors.push("Invalid last_name");
  if (!emailRegex.test(email)) errors.push("Invalid email");
  if (!phoneRegex.test(phone_number)) errors.push("Invalid phone_number");
  if (!eircodeRegex.test(eircode)) errors.push("Invalid eircode");

  return { errors, cleaned: { first_name, last_name, email, phone_number, eircode } };
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
});

app.post("/submit", async (req, res) => {
  const { errors, cleaned } = validatePayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  try {
    await insertUser(cleaned);
    return res.json({ ok: true, message: "Record inserted successfully" });
  } catch (err) {
    console.error("Error inserting user:", err.message);
    return res.status(500).json({ ok: false, error: "Server error inserting record" });
  }
});

async function start() {
  try {
    await ensureTable();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
}

start();
