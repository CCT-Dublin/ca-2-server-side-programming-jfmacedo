const fs = require("fs");
const csv = require("csv-parser");
const { insertUser } = require("./database");

// Regex rules (same as backend)
const phoneRegex = /^\d{9,10}$/;
const eircodeRegex = /^[A-Za-z0-9]{6}$/;

let rowNumber = 1; // header
let inserted = 0;
let errors = [];

fs.createReadStream("personal_information.csv")
.pipe(csv({
    mapHeaders: ({ header }) => header.replace(/^\uFEFF/, "").trim(),
    mapValues: ({ value }) => (value ? value.trim() : value)
  }))  
  .on("data", async (row) => {
    rowNumber++;

const first_name = row.first_name;
const second_name = row.second_name || row.last_name;
const email = row.email;
const phone_number = row.phone;
const eircode = row.eir_code || row.eircode;


    let rowErrors = [];

    if (!first_name || !/^[A-Za-zÀ-ÿ\s-]{1,40}$/.test(first_name))
        rowErrors.push("Invalid first name");
      
    if (!second_name || !/^[A-Za-zÀ-ÿ\s-]{1,40}$/.test(second_name))
        rowErrors.push("Invalid second name");            

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      rowErrors.push("Invalid email");

    if (!phoneRegex.test(phone_number))
      rowErrors.push("Invalid phone number");

    if (!eircodeRegex.test(eircode))
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
    }

    try {
      await insertUser({
        first_name,
        second_name,
        email,
        phone_number,
        eircode
      });
      inserted++;
    } catch (err) {
      errors.push({
        row: rowNumber,
        errors: ["Database insert failed"]
      });
    }
  })
  .on("end", () => {
    console.log("CSV Import Finished");
    console.log("Inserted records:", inserted);
    console.log("Errors:", errors);
  });
