# CA2 Server-Side Programming (Node.js + Express + MySQL)

# Project Overview

This project is a full server-side data submission system implementation built with Node.js, Express, and MySQL. Besides HTML form submission, it also supports bulk CSV import. The validation is done both on the client and server sides. In addition, the system is protected by secure headers and the database inserts are reliable and asynchronous.
The project is like a bug fixing journey of a real-world, which includes module format issues, async pitfalls, and database schema mismatches. It finishes with a neat, stable CommonJS setup.



# Tech Stack

* Node.js
* Express.js
* MySQL (mysql2/promise)
* csv-parser (CSV processing)
* Helmet (security headers)
* Nodemon (development)


# Features

* HTML form served by Express (/)
* Client-side validation + JSON fetch submission
* Server-side validation for all fields
* Persistent storage in MySQL
* CSV bulk import with:
    * Header normalization
    * Per-row validation
    * Error reporting with row numbers
    * Safe async inserts using Promise.allSettled


# Validation Rules

# First Name / Second Name

* Accepts real-world names
* Letters (A–Z, a–z), spaces, hyphens and accents
* Length: 1 to 40 characters

# Email

* Basic email format validation

# Phone Number

* Exactly 10 digits

# Eircode

* **Exactly 6 characters**
* Exactly 6 characters
* Must start with a number

Regex used:

```
/^\d[A-Za-z0-9]{5}$/
```

These rules are aligned across form.html, server.js, and CSV import.

# Database Structure

Database: `ca2_database`

Table: `mysql_table`

Fields:

* `id` (INT, Primary Key, Auto Increment)
* `first_name` (VARCHAR)
* `last_name` (VARCHAR)
* `email` (VARCHAR)
* `phone_number` (CHAR(10))
* `eircode` (CHAR(6))
* `created_at` (TIMESTAMP)


# Setup Instructions

# 1. Install dependencies

```bash
npm install
```

### 2. Configure MySQL

* Create database `ca2_database`
* Create table `mysql_table` according to the schema above
* Ensure MySQL credentials are correctly configured in `database.js`

# 3. Run the server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3000
```

# 4. CSV Import

To import data from `personal_information.csv`:

```bash
npm run import:csv
```

Expected output example:

```
CSV Import Finished
Inserted records: 200
Errors: []
```


# Key Technical Issues Solved #

# ES Modules vs CommonJS #

Problems such as:pool.query is not a function
does not provide an export named 'default'


pool.query is not a function
does not provide an export named 'default'

Fix: The whole codebase was modernized to CommonJS only.

# Asynchronous CSV Import Bug #

Inserts were done asynchronously
Script completed before DB writes

Fix:
Saves insert promises on a per-row basis
Everything was done after the stream ended with an await on Promise.allSettled()

# MySQL Authentication Error #

Access denied for user 'root'@'localhost' (using password: NO)

Fix:
Corrected credentials in database.js
Rechecked the working schema and the destination table

# Project Status #

* Fully functional
* Form submission works
* CSV import works
* Validation consistent
* Data persists correctly
* Server stable on localhost

Author
* João Filipe Silva de Macedo
* Student number: 2024535
