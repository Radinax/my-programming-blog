---
title: "Create a Backend with Bun, Hono and DrizzleORM"
description: "This post is for how to create a backend application using Bun, Hono, SQLite and DrizzleORM. A different take on the usual Node/Express projects"
category: ["typescript", "node", "backend"]
pubDate: "2024-06-12"
published: true
---

## Table of contents

## Introduction

Lets check why I use Bun:

- **Performance**: Bun is generally faster than Node.js, thanks to its use of the JavaScriptCore (JSC) engine and its focus on optimization. This can lead to quicker startup times and faster execution of your code.
- **Simplified Workflow**: Bun is an all-in-one toolkit that integrates a package manager, bundler, and test runner alongside the JavaScript runtime. This can streamline your development process by reducing the number of tools you need to manage.
- **Faster Package Management**: Bun's built-in package manager is known for its speed, often exceeding npm in installation times.
- **Modern JavaScript Support**: Bun natively supports modern JavaScript features like top-level await, classes, and optional chaining, eliminating the need for transpilation in many cases.

Now lets check the framework Hono:

- **Performance**: Hono is known for its impressive speed, often exceeding Express in benchmarks. This is due to its lightweight design and efficient routing algorithms. This can be particularly beneficial for high-traffic applications or those requiring real-time responsiveness.
- **Scalability**: Hono's architecture is built for scalability. It excels in handling a large number of concurrent requests efficiently. This makes it a strong choice for applications that anticipate significant growth.
- **Microservices Architecture**: Hono integrates well with a microservices approach, where your application is broken down into smaller, independent services. Its modular design allows for easier development and deployment of these services.
- **Edge Computing**: Hono is well-suited for edge computing environments, where applications run closer to users geographically. This reduces latency and improves user experience, particularly for globally distributed audiences.

And finally why use DrizzleORM compared to Sequelize or TypeORM:

- **Type Safety (Especially with TypeScript):** DrizzleORM shines with TypeScript integration. It allows you to define your database schema with types, leading to better code maintainability and catching errors early during development.
- **Flexibility:** DrizzleORM offers a balance between Object Relational Mappers (ORMs) and query builders. You can write raw SQL queries when needed, while also benefiting from an ORM-like experience for basic operations.
- **Performance:** DrizzleORM is known for its speed and efficiency. It avoids unnecessary data abstraction layers, potentially leading to faster queries compared to some ORMs.
- **Serverless and Edge Compatibility:** DrizzleORM is designed to work in serverless environments and edge computing platforms. This makes it a good choice for modern architectures where applications are distributed across different locations.

Its the stack I prefer to use for creating Node projects now, lets see how can we start creating them step by step!

## Setup

- Download `bun`: https://bun.sh/ or just install:

```bash
npm install -g bun
```

- Create a Node Project

```bash
mkdir my-hono-project
cd my-hono-project
```

- Initialize `bun`

```bash
bun init
```

Awesome! Now we created a project with index.ts, package.json, README.md and tsconfig.json!

- Install `hono`:

```bash
bun install hono
```

- In your `index.ts` file, this will contain the core logic of your Hono server.

```typescript
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return new Response("Hello from Hono and Bun!");
});
```

This route handles GET requests to the root path (`/`) and returns a simple response.

You can add more routes for different HTTP methods (GET, POST, PUT, etc.) and define their logic within the callback function.

- In the terminal run `bun --watch index.ts`

There we go! An easy way to create a Typescript Node App without installing several packages like in Express! Now lets do some fun stuff.

## Setting DrizzleORM

- Lets start installing

```bash
bun install drizzle-orm
bun install drizzle
bun install drizzle-kit -D
```

- Create a file called `drizzle.config.ts` and add the following:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:./sqlite.db",
  },
  verbose: true,
  strict: true,
});
```

- Lets add the db folder shown above and inside add an `index.ts` file

```typescript
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate as migrator } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "bun:sqlite";
import { join } from "node:path";
import * as schema from "./schema";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema, logger: true });

export function migrate() {
  migrator(db, { migrationsFolder: join(import.meta.dirname, "migrations") });
}
```

- Now lets work on the `schema.ts` file, first lets add `bun install cuid` for handling our IDs, and now lets add the following to the file:

```typescript
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export type Users = InferSelectModel<typeof users>;
```

## Routes

At the most basic level we have created a table of users with id, username and password, then using `InferSelectModel` we get its type to use elsewhere.

- Now lets create a route `routes/users.ts` and add the following libraries:

```bash
bun add @hono/zod-validator
bun install zod
```

Then we import the following into the file and create the router:

```typescript
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";

const router = new Hono();
```

## Zod

Next we create the type validation using zod:

```typescript
const credentialsSchema = z.object({
  username: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(20),
});
```

We haven't used Zod yet in this blog, lets see step by step what all this means:

**1. Zod for Validation:**

- `z` is an alias for the Zod library, which is used to validate data structures in TypeScript applications.

**2. credentialsSchema Definition:**

- `const credentialsSchema = z.object({})`: This line declares a constant named `credentialsSchema` and assigns it the result of calling `z.object`. The `z.object` function creates a schema that expects an object as input.

**3. Validating Username:**

- `username: z.string().trim().toLowerCase().email()`: This part of the schema defines the validation rules for the `username` property within the object. It's a chain of method calls:
  - `z.string()`: This specifies that the `username` property should be a string.
  - `.trim()`: This ensures any leading or trailing whitespace characters are removed from the username.
  - `.toLowerCase()`: This converts the entire username to lowercase.
  - `.email()`: This attempts to validate the username using an email address format check. However, it's important to note that this basic check might not catch all invalid email formats..

**4. Validating Password:**

- `password: z.string().min(8).max(20)`: This defines the validation rules for the `password` property.

  - `z.string()`: Similar to the username, this specifies that the `password` property should be a string.
  - `.min(8)`: This enforces a minimum length of 8 characters for the password.
  - `.max(20)`: This sets a maximum length of 20 characters for the password.

- Now lets create our signup endpoint:

```typescript
router.post("/signup", zValidator("json", credentialsSchema), async (c) => {
  const { username, password } = c.req.valid("json");
  const hashedPassword = await Bun.password.hash(password, "argon2d");

  try {
    await db.insert(users).values({ username, password: hashedPassword });
    return c.body(null, 201);
  } catch (err) {
    console.error(err);
    return c.body(null, 500);
  }
});
```

## Endpoint explanation

Lets explore this EP step by step:

**1. Route Definition:**

- `router.post("/signup", ...)`: This line defines a POST route handler on the path `/signup` using the `router` object (likely imported from Hono).

**2. Zod Validation Middleware (`zValidator`):**

- `zValidator("json", credentialsSchema)`: This part applies Zod validation as middleware before the actual route handler function.
  - `"json"`: This argument specifies that the validation expects the request body to be in JSON format.
  - `credentialsSchema`: This refers to the `credentialsSchema` defined earlier, which outlines the validation rules for username and password.

**3. Route Handler Function:**

- `async (c) => {...}`: This is the asynchronous function that executes when a POST request hits the `/signup` route. The parameter `c` represents the Hono context object.

**4. Accessing Validated Data:**

- `const { username, password } = c.req.valid("json")`: Inside the route handler, you can access the validated data from the request body using `c.req.valid("json")`. This assumes the middleware successfully validated the JSON request body against the `credentialsSchema`. Zod extracts the validated values of `username` and `password` and assigns them to separate constants.

**5. Password Hashing:**

- `const hashedPassword = await Bun.password.hash(password, "argon2d")`: This line utilizes Bun's built-in password hashing functionality. It uses the `argon2d` algorithm (a secure hashing function) to hash the received password for secure storage in the database.

**6. Database Interaction (Assuming `db` is a database connection):**

- `try...catch` block: The code attempts to insert the user data into the database.
  - `await db.insert(users).values({ username, password: hashedPassword })`: This line (assuming `db` is a database connection object and `users` is a table name) inserts a new row into the `users` table with the validated and hashed `username` and `password`.

**7. Response:**

- **Success (201 Created):** If the insertion is successful (`try` block), the code responds with a status code of 201 (Created) using `c.body(null, 201)`. This indicates successful user creation.
- **Error (500 Internal Server Error):** If an error occurs during insertion (`catch` block), the code logs the error with `console.error(err)` and responds with a status code of 500 (Internal Server Error) using `c.body(null, 500)`. This informs the client that something went wrong on the server side.

- Finally the route looks like this:

```typescript
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";

const router = new Hono();

const credentialsSchema = z.object({
  username: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(20),
});

router.post("/signup", zValidator("json", credentialsSchema), async (c) => {
  const { username, password } = c.req.valid("json");
  const hashedPassword = await Bun.password.hash(password, "argon2d");

  try {
    await db.insert(users).values({ username, password: hashedPassword });
    return c.body(null, 201);
  } catch (err) {
    console.error(err);
    return c.body(null, 500);
  }
});

export default router;
```

- We import it into `index.ts`:

```typescript
import { Hono } from "hono";
import usersRoute from "./routes/users";
import { migrate } from "./db";

// Apply migrations
migrate();

const app = new Hono();

app.route("/", usersRoute);

export default app;
```

And we have our first endpoint! But we need to work on the migrations now

## Migrations

Migrations are a version-controlled approach to updating your database schema. They involve writing scripts (migration files) that define changes like adding tables, modifying columns, or adding constraints. A migration runner tool executes these scripts in order, ensuring all environments have the same up-to-date database structure, simplifying deployments, and allowing you to roll back changes if necessary.

Lets create our DB first inside our rootfile `sqlite.db`, it will be empty for now.

Next on the terminal we run the command `bun drizzle-kit generate`, which automatically creates migration files based on your DrizzleORM schema definitions. This saves you time and reduces errors compared to manual script writing, ensuring your database schema stays in sync with your application's evolving needs.

And finally run `bun --watch index.ts` and we have our app running!

## Conclusion

This is the first step into creating a backend application using Bun, Hono and DrizzleORM, its very quick to setup and performance wise its very fast. For our next post we go more into creating more endpoints.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
