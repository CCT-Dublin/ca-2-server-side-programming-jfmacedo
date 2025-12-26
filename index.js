const fs = require("fs");
const path = require("path"); 
const csv = require("csv-parser");
const { insertUser } = require("./database");

const nameRegex = /^[A-Za-z0-9]{1,20}$/;
const phoneRegex = /^[0-9]{10}$/;
const eircodeRegex = /^[0-9][A-Za-z0-9]{5}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let rowNumber = 1;
let inserted = 0;
let errors = [];
let insertPromises = [];


fs.createReadStream(path.join(__dirname, "personal_information.csv"))
  .on("error", (err) => {
    console.error("Erro ao abrir o CSV:", err.message);
  })
  .pipe(csv({
    mapHeaders: ({ header }) => header.replace(/^\uFEFF/, "").trim(),
    mapValues: ({ value }) => (value ? value.trim() : value)
  }))
  .on("data", async (row) => {
    rowNumber++;

    // Mapping the CSV fields to what we need
    const first_name = row.first_name;
    const last_name = row.last_name || row.last_name;
    const email = row.email;
    const phone_number = row.phone;
    const eircode = row.eir_code || row.eircode;

    let rowErrors = [];

    // Validations
    if (!first_name || !/^[A-Za-zÀ-ÿ\s-]{1,40}$/.test(first_name))
      rowErrors.push("Invalid first name");

    if (!last_name || !/^[A-Za-zÀ-ÿ\s-]{1,40}$/.test(last_name))
      rowErrors.push("Invalid last name");

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      rowErrors.push("Invalid email");

    if (!phoneRegex.test(phone_number))
      rowErrors.push("Invalid phone number");

    if (!eircode || !eircodeRegex.test(eircode))
      rowErrors.push("Invalid eircode");

    if (rowNumber === 2) {
      console.log("CSV headers detected:", Object.keys(row));
      console.log("First row sample:", row);
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: rowNumber,
        errors: rowErrors
      });
      return;
    } else {
 
      console.log(`Row ${rowNumber}:`);
      console.log(row);
    }
    
    const insertPromise = insertUser({
      first_name,
      last_name,
      email,
      phone_number,
      eircode
    })
    .then(() => {
      inserted++;
    })
    .catch(() => {
      errors.push({
        row: rowNumber,
        errors: ["Database insert failed"]
      });
    });
    
    insertPromises.push(insertPromise);
    
  })
  .on("end", async () => {
    await Promise.allSettled(insertPromises);
  
    console.log("CSV Import Finished");
    console.log("Inserted records:", inserted);
    console.log("Errors:", errors);
  });
  