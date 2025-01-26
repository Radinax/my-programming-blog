---
title: "Learning SQL: Questions and answers"
description: "Today we will check some of the common questions and answers about SQL that are done on interviews"
category: ["backend", "sql", "concept"]
pubDate: "2025-01-25"
published: true
---

## Table of contents

---

# Introduction

In the real world, interview questions usually share some common ones frequently asked, for FANG companies people usually study a whole year or use books to prepare for anything they could ask and crack those questions open. Here I want to show some common questions asked for senior developers and the logic behind.

---

# 1. Advanced SQL Queries

## Write a query to find the second highest salary in a table.

```sql
SELECT MAX(salary)
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

- **Explanation:** This query uses a subquery to first find the highest salary, then finds the maximum salary that is less than the highest salary.

---

## How would you find duplicate records in a table?

```sql
SELECT column_name, COUNT(*)
FROM table_name
GROUP BY column_name
HAVING COUNT(*) > 1;
```

- **Explanation:** This query groups records by the specified column and uses `HAVING` to filter groups with more than one occurrence, indicating duplicates.

This one can be a bit tricky, let's use an example:

```sql
-- Sample Customer Table
CREATE TABLE customers (
    id INT,
    name VARCHAR(50),
    city VARCHAR(50)
);

-- Insert Sample Data
INSERT INTO customers VALUES
(1, 'John Smith', 'New York'),
(2, 'Jane Doe', 'Chicago'),
(3, 'John Smith', 'Boston'),
(4, 'Mike Brown', 'New York'),
(5, 'John Smith', 'Los Angeles'),
(6, 'Jane Doe', 'Miami');
```

### Query Breakdown

```sql
SELECT name, COUNT(*)
FROM customers
GROUP BY name
HAVING COUNT(*) > 1;
```

### Expected Result

```
name         COUNT(*)
-----------------------
John Smith   3
Jane Doe     2
```

---

## Write a query to find employees who have the same salary.

```sql
SELECT e1.name, e1.salary
FROM employees e1
JOIN employees e2 ON e1.salary = e2.salary AND e1.id <> e2.id;
```

- **Explanation:** This self-join compares the `employees` table with itself to find rows where the salary matches but the employee IDs are different.

Let's check this in more detail.

This SQL query finds **employees with identical salaries** but different employee IDs (essentially, duplicate salary records).

### Detailed Breakdown

1. `FROM employees e1`:

   - First table alias for employees
   - Starting point of the query

2. `JOIN employees e2`:

   - Self-join (joining the table with itself)
   - Allows comparing each employee record with every other record

3. `ON e1.salary = e2.salary`:

   - Matches rows with the same salary
   - Finds salary duplicates across different employees

4. `AND e1.id <> e2.id`:
   - Ensures the matched rows are from different employees
   - Prevents matching an employee with themselves
   - `<>` means "not equal to"

### Example Scenario

```
employees table:
ID | Name    | Salary
1  | Alice   | 50000
2  | Bob     | 60000
3  | Charlie | 50000
4  | David   | 70000
```

**Result of Query:**

```
Name    | Salary
Alice   | 50000
Charlie | 50000
```

### Learnings

- Identifies employees with matching salaries
- Useful for salary comparisons
- Prevents self-matching with `e1.id <> e2.id`

---

## How would you retrieve the top 5 most recent orders for each customer?

```sql
SELECT customer_id, order_id, order_date
FROM (
    SELECT customer_id, order_id, order_date,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
    FROM orders
) AS ranked_orders
WHERE rn <= 5;
```

- **Explanation:** This query uses a **window function** (`ROW_NUMBER()`) to rank orders by date for each customer, then filters to the top 5.

As usual, let's check this one in detail:

### Detailed Breakdown

1. Inner Subquery:

   ```sql
   SELECT customer_id, order_id, order_date,
          ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
   ```

   - `ROW_NUMBER()`: Assigns a unique sequential number to each row
   - `OVER (PARTITION BY customer_id)`: Resets numbering for each customer
   - `ORDER BY order_date DESC`: Numbers rows from most recent to oldest
   - Creates a new column `rn` with the row ranking

2. Outer Query:
   ```sql
   WHERE rn <= 5
   ```
   - Filters to keep only the top 5 rows (most recent orders) for each customer

### Example Scenario

```
orders table:
customer_id | order_id | order_date
1           | 101      | 2023-01-01
1           | 102      | 2023-02-15
1           | 103      | 2023-03-20
1           | 104      | 2023-04-10
1           | 105      | 2023-05-05
1           | 106      | 2023-06-01
```

**Result:**

```
customer_id | order_id | order_date
1           | 106      | 2023-06-01
1           | 105      | 2023-05-05
1           | 104      | 2023-04-10
1           | 103      | 2023-03-20
1           | 102      | 2023-02-15
```

### Learnings

- Retrieves most recent orders
- Works across multiple customers
- Efficient way to get top N records per group

---

# 2. Database Design

## How would you design a database schema for a blog platform?

- **Tables:**
  - `users`: Stores user information (e.g., `user_id`, `username`, `email`).
  - `posts`: Stores blog posts (e.g., `post_id`, `user_id`, `title`, `content`, `created_at`).
  - `comments`: Stores comments on posts (e.g., `comment_id`, `post_id`, `user_id`, `content`, `created_at`).
  - `tags`: Stores tags for categorizing posts (e.g., `tag_id`, `tag_name`).
  - `post_tags`: A junction table for many-to-many relationships between `posts` and `tags`.

---

## What is normalization, and why is it important?

- **Normalization** is the process of organizing a database to reduce redundancy and improve data integrity.
- **Levels:**
  - **1NF:** Each column contains atomic values, and each row is unique.
  - **2NF:** All non-key columns depend on the entire primary key.
  - **3NF:** All columns depend only on the primary key, not on other non-key columns.
- **Why it’s important:** It minimizes data duplication, ensures consistency, and simplifies maintenance.

---

## When would you denormalize a database?

- **Use cases:**
  - **Read-heavy systems:** Denormalization can improve read performance by reducing the need for joins.
  - **Reporting/analytics:** Pre-aggregated data can speed up complex queries.
- **Trade-offs:** Increased storage requirements and potential data inconsistency.

---

# 3. Performance Optimization

## How would you optimize a slow SQL query?

- **Steps:**
  1. Use `EXPLAIN` to analyze the query execution plan.
  2. Add indexes on columns used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
  3. Avoid `SELECT *` and fetch only necessary columns.
  4. Rewrite subqueries as joins where possible.
  5. Use pagination (e.g., `LIMIT` and `OFFSET`) for large datasets.

---

## What are indexes, and how do they work?

- **Indexes** are data structures that improve the speed of data retrieval.
- **Types:**
  - **B-tree indexes:** Default for most databases, efficient for equality and range queries.
  - **Hash indexes:** Fast for equality comparisons but not range queries.
- **Trade-offs:** Indexes speed up reads but slow down writes (inserts/updates).

---

## What is query caching, and how does it improve performance?

- **Query caching** stores the results of a query in memory so that subsequent executions of the same query can be served faster.
- **Use cases:** Read-heavy applications with repetitive queries.
- **Limitations:** Cache invalidation can be challenging when data changes frequently.

---

# 4. Joins and Relationships

## Explain the difference between `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, and `FULL OUTER JOIN`.

- **INNER JOIN:** Returns only matching rows from both tables.
- **LEFT JOIN:** Returns all rows from the left table and matching rows from the right table (nulls for non-matching rows).
- **RIGHT JOIN:** Returns all rows from the right table and matching rows from the left table (nulls for non-matching rows).
- **FULL OUTER JOIN:** Returns all rows from both tables, with nulls for non-matching rows.

---

## How would you handle a many-to-many relationship in SQL?

- Use a **junction table** (e.g., `student_course`) to link the two tables.
- Example:
  ```sql
  CREATE TABLE student_course (
      student_id INT,
      course_id INT,
      PRIMARY KEY (student_id, course_id)
  );
  ```

---

# 5. Transactions and Concurrency

## What is a transaction, and why is it important?

- A **transaction** is a sequence of operations performed as a single logical unit of work.
- **ACID properties:**
  - **Atomicity:** All operations succeed or fail together.
  - **Consistency:** The database remains in a valid state.
  - **Isolation:** Transactions are isolated from each other.
  - **Durability:** Committed changes are permanent.

---

## How would you handle deadlocks in a database?

- **Strategies:**
  - Use a consistent locking order.
  - Implement retry logic in the application.
  - Set a timeout for transactions.

---

# 6. Advanced SQL Features

## What are window functions, and how are they used?

- **Window functions** perform calculations across a set of rows related to the current row.
- Example:
  ```sql
  SELECT name, salary, RANK() OVER (ORDER BY salary DESC) AS rank
  FROM employees;
  ```

---

# 7. Real-World Scenarios

## How would you handle a database migration?

- **Steps:**
  1. Backup the database.
  2. Write migration scripts (e.g., schema changes, data transformations).
  3. Test the migration in a staging environment.
  4. Use tools like Flyway or Liquibase for version control.
  5. Rollback plan in case of failure.

---

# 8. Database-Specific Questions

## What are the differences between MySQL and PostgreSQL?

- **MySQL:** Faster for simple queries, widely used in web applications.
- **PostgreSQL:** More advanced features (e.g., JSON support, full-text search), better for complex queries.

---

# 9. Debugging and Troubleshooting

## How would you debug a query that returns incorrect results?

- **Steps:**
  1. Check the `WHERE` clause for logical errors.
  2. Verify joins and ensure correct relationships.
  3. Use `EXPLAIN` to analyze the query plan.
  4. Test subqueries independently.

---

# 10. Soft Skills and Architecture

## How do you decide when to use SQL vs. NoSQL?

- **SQL:** Structured data, complex queries, ACID compliance.
- **NoSQL:** Unstructured data, high scalability, flexible schema.

---

# Conclusion

There are some interesting patterns here you can learn, while there could be more questions involved, these usually be similar to the ones you will be asked in interviews.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
