---
title: "[Roadmap_Node] 9_Working with Databases"
description: "We're go over how to work with databases in Node JS from a superficial but conceptual level"
category: ["node"]
pubDate: "2024-04-07T09:00:00-04:00"
published: true
---

## Table of content

# Introduction

Here's a breakdown of working with databases in Node.js:

**1. Choosing a Database:**

- **Relational Databases (SQL):** Structured data storage with tables, rows, and columns. Ideal for complex queries and data relationships (e.g., MySQL, PostgreSQL, Oracle).
- **NoSQL Databases:** More flexible data models for unstructured or semi-structured data. Suitable for large datasets or frequent updates (e.g., MongoDB, Cassandra, Redis).

**2. Database Drivers:**

- Node.js doesn't have built-in database access functionalities. You'll need to use a database driver specific to your chosen database type. Popular options include:
  - `mysql` and `mysql2` for MySQL
  - `pg` for PostgreSQL
  - `mongoose` for MongoDB (ODM - Object Document Mapper)
  - `sequelize` for MySQL, PostgreSQL, and others (ORM - Object Relational Mapper)

**3. Connecting to the Database:**

- Use the chosen driver's API to establish a connection to your database server. Connection details (host, port, username, password) are typically stored in environment variables or a configuration file for security reasons.

**4. CRUD Operations (Create, Read, Update, Delete):**

- Drivers provide methods for performing CRUD operations on your data. These methods often involve writing queries specific to the database type (SQL for relational databases or document-oriented queries for NoSQL).

**5. Promises or Async/Await:**

- Asynchronous programming is essential for database interactions in Node.js. Use Promises or Async/Await to handle the asynchronous nature of database operations and avoid blocking the main thread.

**Example (Using `mysql` driver for a simple SELECT query):**

```javascript
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "your_database",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to database!");

    const query = "SELECT * FROM users";
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
      } else {
        console.log("Fetched user data:", results);
      }
    });

    connection.end(); // Close the connection after the query
  }
});
```

**Important Considerations:**

- **Error Handling:** Implement proper error handling mechanisms to gracefully handle database errors and provide informative messages.
- **Security:** Sanitize user input to prevent SQL injection attacks (for relational databases) and other security vulnerabilities.
- **Connection Pooling:** Consider using connection pooling for performance optimization in production environments, reducing the overhead of creating new connections frequently.

**By understanding these concepts and following best practices, you can effectively work with databases in your Node.js applications!**

# Connecting to Databases (MongoDB, MySQL)

Node.js provides a powerful platform for building web applications, and interacting with databases is a crucial aspect of many applications. Here's a breakdown of how to connect to popular databases like MongoDB and MySQL in Node.js:

**1. Choosing the Right Database:**

- **MongoDB:** A NoSQL document database that stores data in flexible JSON-like documents. Ideal for applications with large unstructured datasets or frequent updates.
- **MySQL:** A relational database that stores data in structured tables with rows and columns. Well-suited for applications requiring complex queries and strong data relationships.

**2. Database Drivers:**

Node.js itself doesn't have built-in database access. You'll need to use a database driver specific to your chosen database type. Here are popular options:

- **MongoDB:**
  - **Mongoose (ODM - Object Document Mapper):** Provides a layer of abstraction over the native MongoDB driver, allowing you to interact with data using JavaScript objects.
  - **Native MongoDB Driver:** Offers a lower-level API for direct interaction with MongoDB.
- **MySQL:**
  - **mysql`or`mysql2`:** Popular drivers for interacting with MySQL databases.

**3. Installation:**

Use npm or yarn to install the required driver package for your chosen database:

```bash
npm install mongoose  # For MongoDB (Mongoose)
npm install mysql2    # For MySQL
```

**4. Connection Setup:**

**MongoDB (Mongoose):**

```javascript
const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/your_database_name"; // Replace with your connection details

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));
```

**MySQL (`mysql2`):**

```javascript
const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "your_database_name",
});

connection
  .getConnection()
  .then((conn) => {
    console.log("Connected to MySQL!");
    // Use the connection object (`conn`) for queries
  })
  .catch((err) => console.error("Error connecting to MySQL:", err));
```

**5. Performing CRUD Operations:**

**MongoDB (Mongoose):**

Use Mongoose's schema and model features to define your data structure and perform CRUD operations:

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// Create a new user
User.create({ name: "John Doe", email: "john.doe@example.com" })
  .then((user) => console.log("User created:", user))
  .catch((err) => console.error("Error creating user:", err));

// Find all users
User.find()
  .then((users) => console.log("Users:", users))
  .catch((err) => console.error("Error fetching users:", err));
```

**MySQL (`mysql2`):**

Use prepared statements (recommended for security) or string interpolation (with caution) to execute queries:

```javascript
connection
  .query("SELECT * FROM users")
  .then(([rows]) => console.log("Users:", rows))
  .catch((err) => console.error("Error fetching users:", err));

// Insert a new user (prepared statement example)
const newUser = { name: "Jane Doe", email: "jane.doe@example.com" };
connection
  .query("INSERT INTO users SET ?", newUser)
  .then(() => console.log("User inserted!"))
  .catch((err) => console.error("Error inserting user:", err));
```

**Important Considerations:**

- **Error Handling:** Implement robust error handling to gracefully handle database errors and provide informative messages.
- **Security:**
  - **MongoDB:** Mongoose helps prevent some injection attacks, but always validate user input.
  - **MySQL:** Always use prepared statements to prevent SQL injection vulnerabilities.
- **Connection Pooling:** Consider using connection pooling for performance optimization, especially in production environments, to avoid the overhead of creating new connections frequently.

**Remember:** These are basic examples. Real-world applications will likely involve more complex queries, data manipulation, and error handling practices.

# Mongoose (for MongoDB)

Mongoose is a popular Object Document Mapper (ODM) library for Node.js that simplifies interacting with MongoDB databases. It provides a layer of abstraction over the native MongoDB driver, allowing you to work with data using JavaScript objects instead of raw queries. Here's a breakdown of Mongoose in Node.js:

**Benefits of Using Mongoose:**

- **Improved Developer Experience:** Mongoose offers a more intuitive way to interact with MongoDB data using JavaScript objects and schemas. This reduces the need for writing complex MongoDB queries directly.
- **Schema Validation:** Define your data structure using Mongoose schemas, which enforce data integrity and validation rules.
- **Middleware:** Mongoose supports pre- and post- hooks (middleware) that allow you to perform actions like data manipulation or validation before or after data is saved or retrieved from the database.
- **Promises and Async/Await:** Mongoose operations are asynchronous, and it integrates well with Promises and Async/Await for cleaner code flow.

**Core Concepts in Mongoose:**

1. **Schema:** A blueprint that defines the structure of your data documents in MongoDB. You specify properties (fields) and their data types.

2. **Model:** A Mongoose model is essentially a compiled version of your schema that provides functions for CRUD (Create, Read, Update, Delete) operations on your data.

3. **CRUD Operations:** Mongoose provides intuitive methods for performing CRUD operations on your data using the model:

   - `create()` - Insert a new document into the collection.
   - `find()` - Retrieve documents based on criteria (queries).
   - `findById()` - Find a document by its unique ID.
   - `update()` or `updateOne()` - Update an existing document.
   - `deleteOne()` or `deleteMany()` - Delete documents.

**Example (Simple Mongoose Usage):**

```javascript
const mongoose = require("mongoose");

// Define a schema for User documents
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// Compile the schema into a model
const User = mongoose.model("User", userSchema);

// Create a new user
const newUser = new User({ name: "John Doe", email: "john.doe@example.com" });
newUser
  .save()
  .then((user) => console.log("User created:", user))
  .catch((err) => console.error("Error creating user:", err));

// Find all users
User.find()
  .then((users) => console.log("Users:", users))
  .catch((err) => console.error("Error fetching users:", err));
```

**Additional Features:**

- **Middleware (Hooks):** Mongoose allows you to define pre-save, post-save, etc., hooks to perform logic before or after specific operations.
- **Virtual Fields:** Define virtual fields that are not stored in the database but can be derived from other properties.
- **Validations:** Use Mongoose schema validation to enforce data integrity and type checking.
- **Population:** Mongoose provides features for efficiently populating documents with related data from other collections.

**Mongoose is a powerful tool that streamlines working with MongoDB in Node.js applications. It offers a productive and robust way to manage your data and interact with your MongoDB database.**

Here are some additional points to consider:

- Mongoose works on top of the official MongoDB Node.js driver, providing a higher-level abstraction.
- While Mongoose simplifies development, you can still access the underlying MongoDB driver if needed for more granular control.
- For very simple applications, the native MongoDB driver might be sufficient. However, Mongoose's features become increasingly valuable as your data models and application complexity grow.

# Sequelize (for MySQL)

Sequelize is a popular Object-Relational Mapper (ORM) library for Node.js that simplifies interacting with relational databases like MySQL. It acts as a bridge between your Node.js application and your MySQL database, allowing you to define data models and perform CRUD (Create, Read, Update, Delete) operations using JavaScript objects and functions.

**Benefits of Using Sequelize:**

- **Model-based Approach:** Define your data models using Sequelize, which represent your database tables. This promotes better code organization and maintainability.
- **Automatic SQL Generation:** Sequelize handles generating the necessary SQL queries based on your model definitions and the operations you perform. This reduces the need for writing raw SQL code.
- **Relationships:** Sequelize allows you to define relationships between your models, reflecting the relationships between tables in your database (e.g., one-to-many, many-to-many).
- **Promises and Async/Await:** Sequelize integrates well with Promises and Async/Await for cleaner asynchronous code.

**Core Concepts in Sequelize:**

1. **Model:** A Sequelize model represents a database table. You define the model's structure by specifying properties (columns) and their data types.

2. **Instance:** An instance of a model represents a single row of data in the corresponding database table.

3. **Associations:** Define relationships between your models using Sequelize's association methods (e.g., `hasOne`, `belongsTo`, `belongsToMany`). This allows you to model complex data relationships.

4. **CRUD Operations:** Sequelize provides methods for performing CRUD operations on your data using the model:

   - `create()` - Insert a new row into the table.
   - `findAll()` or `findOne()` - Retrieve rows based on criteria (queries).
   - `update()` or `save()` - Update an existing row.
   - `destroy()` - Delete a row.

**Example (Simple Sequelize Usage):**

```javascript
const Sequelize = require("sequelize");

// Connect to MySQL database
const sequelize = new Sequelize(
  "your_database_name",
  "your_username",
  "your_password",
  {
    dialect: "mysql",
    host: "localhost",
  }
);

// Define a model for the 'users' table
const User = sequelize.define("User", {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
});

// Create the table in the database (if it doesn't exist)
sequelize
  .sync()
  .then(() => console.log("Models synced successfully!"))
  .catch((err) => console.error("Error syncing models:", err));

// Create a new user
User.create({ name: "John Doe", email: "john.doe@example.com" })
  .then((user) => console.log("User created:", user))
  .catch((err) => console.error("Error creating user:", err));

// Find all users
User.findAll()
  .then((users) => console.log("Users:", users))
  .catch((err) => console.error("Error fetching users:", err));
```

**Additional Features:**

- **Querying:** Sequelize supports building complex queries using its query builder API.
- **Transactions:** Manage database transactions for data integrity.
- **Validations:** Define data validations at the model level to enforce data integrity.
- **Hooks:** Utilize model hooks (similar to Mongoose) to perform logic before or after specific operations.

**Sequelize is a powerful tool for working with MySQL databases in Node.js applications. It offers a structured and efficient way to manage your data and interact with your MySQL database.**

Here are some additional things to consider:

- Sequelize supports other relational databases besides MySQL, including PostgreSQL, SQLite, and Microsoft SQL Server.
- The choice between Mongoose (for MongoDB) and Sequelize (for relational databases) depends on your specific database type and project requirements.
- While Sequelize simplifies working with databases, it's still recommended to understand basic SQL concepts for writing complex queries if needed.

# Differences between ORM and ODM

Both Object-Relational Mapper (ORM) and Object Document Mapper (ODM) are tools that bridge the gap between your programming language objects and database storage. They provide a way to interact with databases using a more object-oriented approach, simplifying data access and manipulation in your application. However, they differ in their approach based on the underlying database structure:

**1. Relational vs. Document Databases:**

- **Relational Databases:** Store data in structured tables with rows and columns. Relationships between data exist through foreign keys. (e.g., MySQL, PostgreSQL)
- **Document Databases:** Store data in flexible JSON-like documents that can have varying structures. (e.g., MongoDB)

**2. ORM vs. ODM: Key Differences:**

Here's a table summarizing the key differences between ORMs and ODMs:

| Feature        | ORM                                                              | ODM                                                      |
| -------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| Database Type  | Relational databases (tables, rows, columns)                     | Document databases (flexible JSON-like documents)        |
| Data Modeling  | Models represent database tables and their relationships         | Models represent document structures                     |
| Data Schema    | More rigid schema enforcement                                    | Flexible schema, data can vary within a collection       |
| SQL Generation | Automatic SQL generation based on model operations               | No direct SQL generation, uses database-specific queries |
| Relationships  | Explicitly defined using association methods (e.g., one-to-many) | Implicitly defined within documents (e.g., references)   |

**3. Choosing Between ORM and ODM:**

- **Use ORM if:**
  - You're working with a relational database with a well-defined schema.
  - You need strong data integrity and consistency across your tables.
  - Your application relies on complex queries involving joins between tables.
- **Use ODM if:**
  - You're working with a document database with a flexible schema.
  - You need to store data with varying structures within a collection.
  - Your application prioritizes ease of use and rapid development over rigid schema enforcement.

**Here's an analogy:**

- **ORM:** Like a filing cabinet with folders and sub-folders for organized document storage.
- **ODM:** Like a box that can hold various documents in different formats, offering flexibility but potentially less organization.

**In conclusion, both ORMs and ODMs are valuable tools for working with databases in your Node.js applications. The best choice depends on the type of database you're using and the specific needs of your project.**

# Database Migrations and Seeders

## Database Migrations and Seeders in Node.js

In Node.js applications that interact with databases, managing schema changes and initial data population can be crucial tasks. Here's an overview of database migrations and seeders in Node.js:

**1. Database Migrations:**

- Migrations are a way to track and apply changes to your database schema over time.
- They ensure that your database structure remains consistent across different development environments (local, staging, production).
- Migrations typically involve writing code (often SQL statements) that define the desired schema changes.

**Benefits of Migrations:**

- **Version Control:** Track database schema changes along with your application code.
- **Repeatable Deployments:** Ensure consistent database structure across environments.
- **Team Collaboration:** Developers can work on schema changes without affecting others.

**2. Sequelize Migrations (Example):**

Sequelize, a popular ORM for Node.js with relational databases, provides built-in support for migrations. Here's a simplified example:

- Define migration files (e.g., `20240409-add-user-email.js`).
- Inside the file, use Sequelize methods like `addColumn` or `createTable` to define schema changes.
- Use `sequelize db:migrate` command to execute pending migrations and update your database schema.

**3. Database Seeders:**

- Seeders are scripts used to populate your database with initial data for testing or development purposes.
- This data can include users, products, or any other entities you need in your database.
- Seeders are typically executed once when setting up your development or testing environment.

**Benefits of Seeders:**

- **Rapid Development:** Quickly set up a development environment with sample data.
- **Testing:** Provide consistent test data for your application.
- **Demonstration:** Showcase application functionality with pre-populated data.

**4. Sequelize Seeders (Example):**

Sequelize also provides support for seeders. Here's a simplified example:

- Define seeder files (e.g., `users.js`).
- Use Sequelize model methods like `create` to insert data into your tables.
- Use `sequelize db:seed` command to execute the seeder and populate your database.

**5. Important Considerations:**

- **Data Safety:** Seeders are typically used in development or testing environments. Be cautious with using them in production to avoid accidentally populating your production database with unintended data.
- **Data Seeding Strategy:** Decide what data is essential for your development or testing needs and seed accordingly.
- **Version Control:** Consider including seeder files in your version control to ensure consistent data across development environments.

**In conclusion, database migrations and seeders are essential tools for managing schema changes and initial data population in your Node.js applications. They promote better code organization, maintainability, and a smoother development workflow.**

# Database migration and seeding example

## Example: Migrations and Seeders with Sequelize

Here's an example using Sequelize to demonstrate both migrations and seeders:

**1. Project Setup:**

- Initiate a Node.js project and install Sequelize:

```bash
npm init -y
npm install sequelize
```

- Create a directory named `migrations` to store migration files.
- Create another directory named `seeders` to store seeder files.

**2. Database Connection (config.js):**

Create a `config.js` file to store your database connection details:

```javascript
module.exports = {
  development: {
    username: "your_username",
    password: "your_password",
    database: "your_database_name",
    dialect: "mysql", // Replace with your dialect (e.g., 'mysql', 'postgres')
    host: "localhost",
  },
  test: {
    username: "your_test_username",
    password: "your_test_password",
    database: "your_test_database_name",
    dialect: "mysql",
    host: "localhost",
  },
};
```

**3. User Model (models/user.js):**

Create a `user.js` file to define your User model:

```javascript
const DataTypes = require("sequelize");
const sequelize = require("../config").development; // Replace with your environment

const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
});

module.exports = User;
```

**4. Migration Example (migrations/20240409-add-user-email.js):**

Create a migration file named `20240409-add-user-email.js` (following a date-based naming convention):

```javascript
const DataTypes = require("sequelize");
const sequelize = require("../config").development; // Replace with your environment

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn("Users", "email", {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn("Users", "email");
  },
};
```

This migration adds an `email` column to the `Users` table. The `up` function executes the migration, and the `down` function allows you to revert the changes if needed.

**5. Seeder Example (seeders/users.js):**

Create a seeder file named `users.js`:

```javascript
const User = require("../models/user");

const users = [
  { name: "John Doe", email: "john.doe@example.com" },
  { name: "Jane Doe", email: "jane.doe@example.com" },
];

const seedUsers = async () => {
  for (const user of users) {
    await User.create(user);
  }
};

seedUsers()
  .then(() => console.log("Users seeded successfully!"))
  .catch((err) => console.error("Error seeding users:", err));

module.exports = seedUsers;
```

This seeder defines some sample `users` data and then loops through it, creating each user in the database using the `User.create` method.

**6. Running Migrations and Seeders:**

- Use the following commands to manage migrations and seeders:

  - `sequelize db:migrate` - Runs pending migrations to update your database schema.
  - `sequelize db:seed` - Runs the defined seeders to populate your database with sample data.

**Remember:**

- Replace the placeholder connection details in `config.js` with your actual database credentials.
- Adjust the migration and seeder code to match your specific database schema and data requirements.

This example demonstrates a basic implementation of migrations and seeders using Sequelize. You can extend this concept to manage more complex schema changes and data seeding needs in your Node.js applications.

# Conclusion

Today we learned about DB, but only at a superficial level which is to complement what we learned in previous posts, while MongoDB as a non-relational DB is easier to digest, SQL or relational DB is a whole other roadmap in itself we need to tackle another day. For now we can rely on ORM to translate our requirements to the relational DB SQL as instructions.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
