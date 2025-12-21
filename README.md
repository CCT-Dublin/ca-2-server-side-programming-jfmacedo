# CA2 Server-Side Programming (Node.js + Express + MySQL)

## Project Overview

This project implements a complete **server-side data submission system** using **Node.js, Express, and MySQL**. It allows users to submit data via an HTML form and also supports **bulk CSV import** with full server-side validation and database persistence.

The project was developed step by step, addressing real-world issues such as validation errors, database authentication problems, and asynchronous behavior in Node.js.


## Tech Stack

* **Node.js**
* **Express.js**
* **MySQL**
* **csv-parser** (CSV processing)
* **Nodemon** (development)


## Features

* HTML form for manual data submission
* Server-side validation for all fields
* Persistent storage in MySQL database
* CSV bulk import with:

  * Header normalization
  * Per-row validation
  * Error reporting with row numbers
  * Safe asynchronous database inserts


## Validation Rules

### First Name / Second Name

* Accepts real-world names
* Letters (A–Z, a–z), spaces, hyphens and accents
* Length: 1 to 40 characters

### Email

* Basic email format validation

### Phone Number

* **9 or 10 digits**
* Leading zero is optional

### Eircode

* **Exactly 6 characters**
* Accepts **uppercase or lowercase**
* Accepts **letters and/or numbers only**

Regex used:

```
/^[A-Za-z0-9]{6}$/
```

This rule was chosen to match the provided dataset and keep validation simple and consistent.


## Database Structure

Database: `ca2_database`

Table: `mysql_table`

Fields:

* `id` (INT, Primary Key, Auto Increment)
* `first_name` (VARCHAR)
* `second_name` (VARCHAR)
* `email` (VARCHAR)
* `phone_number` (CHAR(10))
* `eircode` (CHAR(6))
* `created_at` (TIMESTAMP)


## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure MySQL

* Create database `ca2_database`
* Create table `mysql_table` according to the schema above
* Ensure MySQL credentials are correctly configured in `database.js`

### 3. Run the server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3000
```

### 4. CSV Import

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


## Key Technical Challenges Solved

### Asynchronous CSV Import Issue

Initially, CSV rows were processed asynchronously, but the script finished before database inserts completed.

**Solution:**

* Collect insert promises
* Ensure all inserts complete before finishing the import

This guarantees accurate insertion counts and reliable database persistence.

### Database Authentication Error

Encountered:

```
Access denied for user 'root'@'localhost' (using password: NO)
```

**Solution:**

* Properly configured MySQL credentials in the database connection

## Project Status

Fully functional

* Form submission works
* CSV import works
* Data is validated and persisted
* Errors are properly reported


## Author

João Filipe Silva de Macedo
Studant number: 2024535

