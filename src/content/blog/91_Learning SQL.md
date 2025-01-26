---
title: "Learning SQL"
description: "Today we will learn about SQL in a beginner friendly way"
category: ["backend", "sql", "concept"]
pubDate: "2025-01-23"
published: true
---

## Table of contents

---

# Introduction

SQL (Structured Query Language) is a standard programming language used for managing and manipulating relational databases. It allows you to perform tasks such as querying data, updating records, inserting new data, and deleting data.

---

# Beginner guide

Below is a beginner-friendly guide to SQL:

---

## 1. What is SQL?

SQL is used to interact with relational database management systems (RDBMS) like MySQL, PostgreSQL, Oracle, SQL Server, and SQLite. It is declarative, meaning you tell the database **what** you want, and the database figures out **how** to do it.

---

## 2. Basic SQL Commands

Here are the most common SQL commands:

### a. SELECT

Used to retrieve data from a database.

```sql
SELECT column1, column2 FROM table_name;
```

- Example: Get all names from a `users` table.

```sql
SELECT name FROM users;
```

- To select all columns, use `*`:

```sql
SELECT * FROM users;
```

### b. WHERE

Filters records based on a condition.

```sql
SELECT column1, column2 FROM table_name WHERE condition;
```

- Example: Get users with the name "John".

```sql
SELECT * FROM users WHERE name = 'John';
```

### c. INSERT INTO

Adds new records to a table.

```sql
INSERT INTO table_name (column1, column2) VALUES (value1, value2);
```

- Example: Add a new user.

```sql
INSERT INTO users (name, age) VALUES ('Alice', 25);
```

### d. UPDATE

Modifies existing records in a table.

```sql
UPDATE table_name SET column1 = value1 WHERE condition;
```

- Example: Update the age of a user named "Alice".

```sql
UPDATE users SET age = 26 WHERE name = 'Alice';
```

### e. DELETE

Removes records from a table.

```sql
DELETE FROM table_name WHERE condition;
```

- Example: Delete a user named "Bob".

```sql
DELETE FROM users WHERE name = 'Bob';
```

### f. CREATE TABLE

Creates a new table in the database.

```sql
CREATE TABLE table_name (
    column1 datatype,
    column2 datatype,
    ...
);
```

- Example: Create a `users` table.

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT
);
```

### g. ALTER TABLE

Modifies an existing table (e.g., add or delete columns).

```sql
ALTER TABLE table_name ADD column_name datatype;
```

- Example: Add an `email` column to the `users` table.

```sql
ALTER TABLE users ADD email VARCHAR(100);
```

### h. DROP TABLE

Deletes an entire table.

```sql
DROP TABLE table_name;
```

- Example: Delete the `users` table.

```sql
DROP TABLE users;
```

---

## 3. Filtering and Sorting Data

### a. AND, OR, NOT

Combine multiple conditions in a `WHERE` clause.

```sql
SELECT * FROM users WHERE age > 20 AND name = 'John';
```

### b. ORDER BY

Sorts the result set in ascending (`ASC`) or descending (`DESC`) order.

```sql
SELECT * FROM users ORDER BY age DESC;
```

### c. LIMIT

Restricts the number of rows returned.

```sql
SELECT * FROM users LIMIT 10;
```

---

## 4. Aggregating Data

### a. COUNT

Counts the number of rows.

```sql
SELECT COUNT(*) FROM users;
```

### b. SUM

Calculates the sum of a numeric column.

```sql
SELECT SUM(age) FROM users;
```

### c. AVG

Calculates the average of a numeric column.

```sql
SELECT AVG(age) FROM users;
```

### d. MIN and MAX

Finds the minimum and maximum values in a column.

```sql
SELECT MIN(age), MAX(age) FROM users;
```

### e. GROUP BY

Groups rows that have the same values into summary rows.

```sql
SELECT name, COUNT(*) FROM users GROUP BY name;
```

### f. HAVING

Filters groups based on a condition (used with `GROUP BY`).

```sql
SELECT name, COUNT(*) FROM users GROUP BY name HAVING COUNT(*) > 1;
```

---

## 5. Joins

Joins are used to combine rows from two or more tables based on a related column.

### a. INNER JOIN

Returns records that have matching values in both tables.

```sql
SELECT users.name, orders.order_id
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```

### b. LEFT JOIN

Returns all records from the left table and matched records from the right table.

```sql
SELECT users.name, orders.order_id
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

### c. RIGHT JOIN

Returns all records from the right table and matched records from the left table.

```sql
SELECT users.name, orders.order_id
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;
```

### d. FULL OUTER JOIN

Returns all records when there is a match in either left or right table.

```sql
SELECT users.name, orders.order_id
FROM users
FULL OUTER JOIN orders ON users.id = orders.user_id;
```

---

## 6. Subqueries

A subquery is a query nested inside another query.

```sql
SELECT name FROM users WHERE id IN (SELECT user_id FROM orders WHERE amount > 100);
```

---

## 7. Indexes

Indexes improve the speed of data retrieval.

```sql
CREATE INDEX idx_name ON users (name);
```

---

## 8. Transactions

Transactions ensure data integrity by grouping multiple operations into a single unit.

```sql
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

---

# Conclusion

SQL is a very important subject to know at a theoretical level to understand how to handle databases, these days we have ORMs that make the work easy for us, but sometimes we need to use raw SQL to get exactly what we want or for debugging purposes when using an ORM which is very popular in Javascript, but for other environments we might not be so lucky and we will need the knowledge.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
