---
title: "Nest JS Hands On"
description: "Checking out Nest JS as it was required in a project"
category: ["typescript"]
pubDate: "2025-01-21"
published: true
---

## Table of contents

---

# Introduction

Let's build a CRUD API with NestJS and TypeScript using **SQLite** without Drizzle ORM. Instead, we'll use the `sqlite3` package directly to interact with the database since we want to test NestJS as isolated as possible to see what it can offer to us as its required in a several job posts as of 2025.

Docs: https://docs.nestjs.com/
Repo: https://github.com/Radinax/nestjs-sqlite-crud

---

# Setup

Here we will add the libraries necesary to setup our project including the DB.

## Set Up a New NestJS Project

Create a new NestJS project if you don’t already have one:

```bash
npm i -g @nestjs/cli
nest new nestjs-sqlite-crud
cd nestjs-sqlite-crud
```

---

## Install Required Dependencies

Install the `sqlite3` package for database interaction:

```bash
npm install sqlite3
npm install @nestjs/config
```

---

## Set Up SQLite Database

Create an SQLite database file (`sqlite.db`) and a `users` table. You can use a tool like [DB Browser for SQLite](https://sqlitebrowser.org/) or run the following SQL commands:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL
);
```

I used the tool to create the DB and put it in the root of the project, then used its SQL command space to write the above query to create a simple table

---

# Create Services

## Create a Database Service

Create a service to handle database operations. Generate a new service:

```bash
nest generate service database
```

Update the `database.service.ts` file:

```typescript
// src/database/database.service.ts
import { Injectable } from "@nestjs/common";
import * as sqlite3 from "sqlite3";

@Injectable()
export class DatabaseService {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database("sqlite.db"); // Connect to SQLite database
  }

  async query(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
```

---

## Create a Database Module

```bash
nest generate module database
```

Update the `database.module.ts` file:

```javascript
// src/database/database.module.ts
import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService], // Export the service so it can be used in other modules
})
export class DatabaseModule {}
```

# Create a CRUD Module

Generate a new module for your CRUD operations:

```bash
nest generate module users
nest generate service users
nest generate controller users
```

---

## Implement the CRUD Service

Update the `users.service.ts` file:

```typescript
// src/users/users.service.ts
import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const sql = "SELECT * FROM users";
    return this.databaseService.query(sql);
  }

  async findOne(id: number) {
    const sql = "SELECT * FROM users WHERE id = ?";
    return this.databaseService.query(sql, [id]);
  }

  async create(name: string, age: number) {
    const sql = "INSERT INTO users (name, age) VALUES (?, ?)";
    await this.databaseService.run(sql, [name, age]);
    return { name, age };
  }

  async update(id: number, name: string, age: number) {
    const sql = "UPDATE users SET name = ?, age = ? WHERE id = ?";
    await this.databaseService.run(sql, [name, age, id]);
    return { id, name, age };
  }

  async delete(id: number) {
    const sql = "DELETE FROM users WHERE id = ?";
    await this.databaseService.run(sql, [id]);
    return { id };
  }
}
```

---

## Implement the CRUD Controller

Update the `users.controller.ts` file:

```typescript
// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  async create(@Body() body: { name: string; age: number }) {
    return this.usersService.create(body.name, body.age);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() body: { name: string; age: number }
  ) {
    return this.usersService.update(+id, body.name, body.age);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.usersService.delete(+id);
  }
}
```

---

## Implement the CRUD Module

Update the `users.module.ts` file:

```javascript
// src/users/users.module.ts
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DatabaseModule } from "../database/database.module"; // Import the DatabaseModule

@Module({
  imports: [DatabaseModule], // Add DatabaseModule here
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

---

# Run the Application

Start the NestJS application:

```bash
npm run start:dev
```

And everything should work without errors if you followed step by step!

---

# Test the API

Use tools like Postman or `curl` to test the API:

- **GET** `/users` - Fetch all users.
- **GET** `/users/1` - Fetch a user with ID 1.
- **POST** `/users` - Create a new user.
  ```json
  {
    "name": "Adrian Gomez",
    "age": 34
  }
  ```
- **PUT** `/users/1` - Update a user with ID 1.
  ```json
  {
    "name": "Jose Perez",
    "age": 25
  }
  ```
- **DELETE** `/users/1` - Delete a user with ID 1.

---

# Final code structure

```bash
src/
├── database/
│   ├── database.module.ts
│   ├── database.service.ts
├── users/
│   ├── users.controller.ts
│   ├── users.module.ts
│   ├── users.service.ts
├── app.module.ts
├── sqlite.db
└── main.ts
```

# Conclusion

Building a CRUD API with NestJS and SQLite is a great way to get hands-on experience with modern backend development. By following this guide, you've learned how to set up a NestJS project, interact with an SQLite database, and implement basic CRUD operations.

Using raw SQL queries without an ORM like Drizzle gives you full control over your database interactions, making it a great choice for those who prefer writing SQL directly or working on smaller projects where an ORM might be overkill (for me it makes coding faster). Plus, with NestJS's modular architecture, you can easily extend this project by adding new features, integrating authentication, or even swapping out SQLite for a more robust database like PostgreSQL or MySQL, but my preference is SQLite for the moment.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
