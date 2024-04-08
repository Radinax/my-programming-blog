---
title: "TypeOrm Node REST API CRUD with Postgres"
description: "This post is a bit more personal, in my job we're using TypeOrm and I would like to learn more about it, so I decided to start learning it! We use it with GraphQL but for now I will make this post using REST."
category: ["backend", "node", "express", "sql", "postgresql"]
pubDate: "2023-12-20"
published: true
---

# TypeORM.

> TypeORM is an [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8). Its goal is to always support the latest JavaScript features and provide additional features that help you to develop any kind of application that uses databases - from small applications with a few tables to large scale enterprise applications with multiple databases.

# Building Project

Let's go by steps:

## Initial Setup

Initialize Project:

```bash
npm init
```

Install `express`:

```bash
npm i express
```

Create a folder called `src/index.ts`

Now configure `TypeScript`:

```bash
npm i typescript -D
npx tsc --init
```

Which creates a `tsconfig.json`. Search for `rootDir: "./src"` and `ourDir: "./dist"`.

```bash
npx tsc
```

Which creates the `dist` folder.

Lets install the following library which acts like `nodemon`

```bash
npm i ts-node-dev -D
```

Inside package.json:

```json
"scripts": {
    "dev": "ts-node-dev --respawn src/index.ts"
    "build": "tsc",
    "start": "node dist/index.js"
}
```

Install the following:

```bash
npm i express morgan cors
npm i @types/express @types/morgan @types/cors -D
```

Inside your `src/index.ts`:

```typescript
import express from "express"
import morgan from "morgan"
import cors from "cors"

const app = express()

app.use(morgan('dev))
app.use(cors())

app.listen(3000)
console.log('Server is ', 3000)
```

## Setting TypeOrm

Install the following according to their documentation:

```bash
npm install typeorm --save
// If error use the bottom one
npm install typeorm --legacy-peer-deps
npm install @types/node --save-dev
npm install reflect-metadata pg --save
```

Go back to `src/index.ts`:

```typescript
import express from "express"
import morgan from "morgan"
import cors from "cors"

const app = express()

app.use(morgan('dev))
app.use(cors())

app.listen(3000)
console.log('Server is ', 3000)
```

Inside your `tsconfig.json`:

```json
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
"strictPropertyInitialization": false,
```

Create a file `src/db.ts` to make the connections:

```typescript
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  username: "postgres",
  password: "", // your pass 17:06
  port: 5432,
  database: "typeormdb",
  entities: [],
  logging: true,
});
```

You can use DBeaver or pgAdmin to create a new database you can call `typeormdb`.

Create a file called `src/app.ts` and add the following code:

```typescript
import express from "express"
import morgan from "morgan"
import cors from "cors"

const app = express()

app.use(morgan('dev))
app.use(cors())

export default app;
```

And inside your `src/index.ts`:

```typescript
import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./db";

async function main() {
  try {
    await AppDataSource.initialize();
    app.listen(3000);
    console.log("Server is ", 3000);
  } catch (error) {}
}

main();
```

## Entities

Create a folder `src/entities/User.ts`:

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column({ unique: true })
  email: string;
  @Column({
    default: true,
  })
  active: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
```

We used `decorators`:

> A Decorator is **a special kind of declaration that can be attached to a class declaration, method, accessor, property, or parameter**. Decorators use the form @expression , where expression must evaluate to a function that will be called at runtime with information about the decorated declaration.

Now inside your `db.ts` add:

```typescript
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  username: "postgres",
  password: "", // your pass 17:06
  port: 5432,
  database: "typeormdb",
  entities: [User],
  synchronize: true,
  logging: true,
});
```

Doing `npm run start` will create this column!

## Create User

Create a folder and inside `src/routes/user.routes.ts`:

```typescript
import { Router } from "express";
import { createUser } from "../controllers/user.controllers";

const router = Router();

router.post("/users", createUser);

export default router;
```

Create a folder and inside `src/controllers/users.controllers.ts`

```typescript
import { Request, Response } from "express";

export const createUser = (req: Request, res: Response) => {
  res.send("Hello");
  console.log(req.body);
};
```

Inside `app.ts`:

```typescript
import express from "express"
import morgan from "morgan"
import cors from "cors"
import userRoutes from "./routes/user.routes"

const app = express()

app.use(morgan('dev))
app.use(cors())
app.use(express.json())

app.use(userRoutes)

export default app;
```

With `Thunder Client` which is a postman like plugin you can install on your vscode, you can make a post request towards the route `/users`:

- POST: http://localhost:3000/users

- JSON:

```json
{
  "firstname": "ryan",
  "lastname": "ray"
}
```

And you will get as response `Hello` and on your terminal the body of the request sent.

Edit your `user.controller.ts`

```typescript
import { Request, Response } from "express";
import { User } from "../entities/User";

export const createUser = (req: Request, res: Response) => {
  const { firstname, lastname } = req.body;

  const user = new User();
  user.firstname = firstname;
  user.lastname = lastname;

  await user.save();

  return res.json(user);
};
```

And now you will see on your console something like this:

```javascript
User {
    firstname: 'ryan',
    lastname: 'ray',
    id: 1,
    active: true,
    createdAt: 2022-04-04T19:44:38.938Z,
    updatedAt: 2022-04-04T19:44:38.938Z,
}
```

If you check your DB you will see this record!

Now lets add some error handling:

```typescript
import { Request, Response } from "express";
import { User } from "../entities/User";

export const createUser = (req: Request, res: Response) => {
  try {
    const { firstname, lastname } = req.body;

    const user = new User();
    user.firstname = firstname;
    user.lastname = lastname;

    await user.save();

    return res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
```

## Read User

Inside `user.routes.ts`:

```typescript
import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controllers";

const router = Router();

router.post("/users", createUser);
router.get("/users", getUsers);

export default router;
```

Where getUsers is:

```typescript
import { Request, Response } from "express"
import { User } from "../entities/User"

export const createUser = async (req: Request, res: Response) => {
    try {
        const { firstname, lastname } = req.body

        const user = new User()
        user.firstname = firstname
        user.lastname = lastname

        await user.save()

        return res.json(user)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        }
    }
}


export const getUsers = async (req: Request, res: Response) => {
    try {
        await users = await User.find()
        return res.json(users)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        }
    }
}
```

This EP returns all the users in the DB!

## Update User

Inside `user.routes.ts`:

```typescript
import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
} from "../controllers/user.controllers";

const router = Router();

router.post("/users", createUser);
router.get("/users", getUsers);
router.put("/users/:id", updateUser);

export default router;
```

Where updateUser is:

```typescript
import { Request, Response } from "express";
import { User } from "../entities/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname } = req.body;

    const user = new User();
    user.firstname = firstname;
    user.lastname = lastname;

    await user.save();

    return res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstname, lastname } = req.body;
    const user = await User.findOneBy({ id: parseInt(id) });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    /*
        You can also do this
            user.firstname = firstname
            user.lastname = lastname
        */
    await User.update(
      { id: parseInt(id) },
      {
        firstname,
        lastname,
      }
    );

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
```

## Delete User

Inside `user.routes.ts`:

```typescript
import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers";

const router = Router();

router.post("/users", createUser);
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
```

Where deleteUser is:

```typescript
import { Request, Response } from "express";
import { User } from "../entities/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname } = req.body;

    const user = new User();
    user.firstname = firstname;
    user.lastname = lastname;

    await user.save();

    return res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstname, lastname } = req.body;
    const user = await User.findOneBy({ id: parseInt(id) });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    /*
        You can also do this
            user.firstname = firstname
            user.lastname = lastname
        */
    await User.update(
      { id: parseInt(id) },
      {
        firstname,
        lastname,
      }
    );

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOneBy({ id: parseInt(id) });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    const result = await User.delete({ id: parseInt(id) });

    if (result.affected === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
```

## Get userById

Inside `user.routes.ts`:

```typescript
import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers";

const router = Router();

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
```

Where getUserById is:

```typescript
import { Request, Response } from "express";
import { User } from "../entities/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname } = req.body;

    const user = new User();
    user.firstname = firstname;
    user.lastname = lastname;

    await user.save();

    return res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstname, lastname } = req.body;
    const user = await User.findOneBy({ id: parseInt(id) });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    /*
        You can also do this
            user.firstname = firstname
            user.lastname = lastname
        */
    await User.update(
      { id: parseInt(id) },
      {
        firstname,
        lastname,
      }
    );

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOneBy({ id: parseInt(id) });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    const result = await User.delete({ id: parseInt(id) });

    if (result.affected === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOneBy({ id: parseInt(id) });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    return res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
```

# Conclusion

We managed to learn TypeOrm! Its quite easy to use, same as Prisma was. For this case it was a simple CRUD.

For the next post we will talk about TypeOrm with GraphQL.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
