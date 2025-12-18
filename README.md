# CA2 Server-Side Programming (Node.js + Express + MySQL)

This project implements a simple data submission system with server-side validation and MySQL persistence.  
It also includes a CSV import script that validates each row and reports errors with row numbers.

## Tech Stack
- Node.js
- Express
- MySQL
- csv-parser
- Nodemon (dev)

## Features
- HTML form to submit user data
- Server-side validation
- Save valid records to MySQL database
- CSV bulk import with per-row validation and error reporting (row numbers)

## Validation Rules
- **First name / Second name:** accepts real-world names (letters, spaces, hyphens, accents)
- **Email:** basic email format validation
- **Phone number:** 9 or 10 digits (users may omit the leading zero)
- **Eircode:** `LNNXXXX` (7 characters)  
  Example: `D06CX45`  
  Rows that do not match this format are rejected during CSV import to preserve data integrity.

## Setup

### 1) Install dependencies
```bash
npm install
