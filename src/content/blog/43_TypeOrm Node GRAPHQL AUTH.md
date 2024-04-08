---
title: "Apollo Server with TypeScript for Auth"
description: "In the previous post we checked how to use TypeORM, Node, GraphQL with PostgreSQL, this time we will add Apollo Server into the mix to produce a robust service for the Frontend to consume."
category: ["backend", "node", "express", "sql", "postgresql"]
pubDate: "2023-12-22"
published: true
---

# Building Project

Let's go by steps:

## Initial Setup

Initialize Project:

```bash
npm init -y
```

Install the following libraries:

```bash
npm i apollo-server-express reflect-metadata pg express dot-env graphql typeorm cors argon2 type-graphql express-session
```

Lets go over what each of these do:

- `reflect-metadata`: **Allows you to do runtime reflection on types**. The native (non reflect-metadata) version of type inference is much poorer than reflect-metadata and consists only of `typeof` and `instanceof`.

- `pg`: Non-blocking PostgreSQL client for Node.js. Pure JavaScript and optional native libpq bindings.

- `express`: Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

- `dot-env`: Loads environment variables from .env file.

- `graphql`: GraphQL.js is a general-purpose library and can be used both in a Node server and in the browser.

- `typeorm`: Is a TypeScript ORM (object-relational mapper) library that makes it easy to link your TypeScript application up to a relational database database.

- `cors`: CORS is shorthand for **Cross-Origin Resource Sharing**. It is a mechanism to allow or restrict requested resources on a web server depend on where the HTTP request was initiated. This policy is used to secure a certain web server from access by other website or domain.

- `argon2`: is **a password-hashing function**. An alternative to `bcrypt` and the is know by the community as the superior choice.

- `type-graphql`: Create GraphQL schema and resolvers with TypeScript, using classes and decorators.

- `express-session`: an HTTP server-side framework used to create and manage a session middleware

- `apollo-server-express`: Apollo Server is **an open-source, spec-compliant GraphQL server that's compatible with any GraphQL client, including Apollo Client**. It's the best way to build a production-ready, self-documenting GraphQL API that can use data from any source.

Create a folder called `src/index.ts`

```bash
npm i typescript @types/express-session ts-node-dev @types/cors @types/express @types/node reflect-metadata -D
npx tsc --init
```

Which creates a `tsconfig.json`. Search for `rootDir: "./src"` and `ourDir: "./dist"`.

Now configure `TypeScript` by enabling inside your `tsconfig.json` the `experimentalDecorators` and `emitDecoratorMetadata` as true for both cases.

Now do:

```bash
npx tsc
```

Which creates the `dist` folder.

Inside package.json:

```json
"scripts": {
    "dev": "ts-node-dev src/index.ts",
    "watch": "tsc -w",
    "build": "tsc -p .",
    "start": "node dist/index.js"
}
```

## Basic Configuration

Let's setup our DB first, create a file `src/db.ts`:

```typescript
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "usersdb",
  synchronize: false,
  ssl: false,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: [],
});
```

## GRAPHQL Setup

## Building the basic

For starters lets create three folders inside `src` called, `config`, `entity` and `resolvers`.

Now create `src/app.ts`:

```typescript
import express from "express";
import { ApolloServer } from "apollo-server-express";

const app = express();

const server = new ApolloServer({
  schema,
});

server.applyMiddleware({ app, path: "/graphql" });
```

Create `resolvers/ping.ts` which we will use to test our API code mostly:

```typescript
import { Query, Resolver } from "type-graphql";

@Resolver()
export class PingResolver {
  @Query(() => String)
  ping() {
    return "Pong!";
  }
}
```

Import this inside `app.ts`:

```typescript
import express from "express"
import { ApolloServer } from "apollo-server-express"
import { PingResolver } from "./resolvers/ping"
import { BuildSchema } from "type-graphql"

const startServer = async () => {
    const app = express()
    const server = new ApolloServer({
        schema: await BuildSchema({
            resolvers: [PingResolver]
        }),
        context: ({ req, res } => ())
    })
}


server.applyMiddleware({app, path: "/graphql"})
```

Now go inside `index.ts`:

```typescript
import "reflect-metadata";
import { startServer } from "./app";

async function main() {
  const app = awaitstartServer();
  app.listen(3000);
  console.log("Server on port", 3000);
}

main();
```

## Using TypeORM

Create `config/typeorm.ts`:

```typescript
import { createConnection } from "typeorm";

export async function connect() {
  await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "", // we will create this bellow
  });
}
```

## Setting MySQL

Connect to MySQL (mysql workbench works but I will use XAMPP and activating APACHE and mySQL options). Inside `myPHPAdmin` create a new table and call it whatever you want, I will call it `usersdb`

Inside `config/typeorm.ts` add the database name to the connection:

```typescript
import { createConnection } from "typeorm";
import path from "path";

export async function connect() {
  await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "usersdb",
    entities: [path.join(__dirname, "../entity/**/**.ts")],
    synchronyze: true,
  });
}
```

Now go inside `index.ts` and import our connection:

```typescript
import "reflect-metadata";
import { connect } from "./config/typeorm";
import { startServer } from "./app";

async function main() {
  connect();
  const app = awaitstartServer();
  app.listen(3000);
  console.log("Server on port", 3000);
}

main();
```

Now run `npm run dev` and it will work!

Then enter and `USE usersdb;` and it will show a message saying "Database changed"

Create a file `src/db.ts`:

```typescript
import { createConnection } from "typeorm";

export const connectDB = async () => {
  await createConnection({
    type: "mysql",
    username: "root", // USE YOURS!
    password: "password",
    port: 3306,
    host: "localhost",
    database: "usersdb",
    entities: [], // we fill it later
    synchronize: false,
    ssl: false,
  });
};
```

Create a file `src/app.ts` and add everything in `index.ts`:

```typescript
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema";

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);

export default app;
```

Now inside `index.ts`:

```typescript
import app from "./app";
import { connectDB } from "./db";

async function main() {
  try {
    await connectDB();
    app.listen(3000);
    console.log("Server is ", 3000);
  } catch (error) {
    console.error(error);
  }
}

main();
```

Now we need to configure the DB, go inside the DB terminal:

```sql
ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'password'
```

Hit enter and `flush privileges` and `npm run dev`.

## Setting Entity

Create `src/Entities/Users.ts`:

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  username: string;
  @Column()
  password: string;
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

Inside your `tsconfig.json`:

```json
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
"strictPropertyInitialization": false,
```

Go into `db.ts`:

```typescript
import { createConnection } from "typeorm";
import { Users } from "./Entities/Users";

export const connectDB = async () => {
  await createConnection({
    type: "mysql",
    username: "root", // USE YOURS!
    password: "password",
    port: 3306,
    host: "localhost",
    database: "usersdb",
    entities: [Users],
    synchronize: false, // change to true
    ssl: false,
  });
};
```

Go to MySQL terminal `show databases;` and `use usersdb;` and `show tables;`, this shows you haven't created tables.

Now make `synchronize` as true and save (which will reset your terminal), then hit `show tables;` and now it will show!

Next do `describe users;` and you can see all the data inside.

## Create User

Inside `src/schema/typeDefs/User.ts`:

```typescript
import { GraphQLObjectType, GraphQLID } from "graphql"


export new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {  type: GraphQLID},
        name: {  type: GraphQLString},
        username: {  type: GraphQLString},
        password: {  type: GraphQLString},
    },
})
```

Inside `src/schema/Mutations/User.ts`:

```typescript
import { GraphQLString } from "graphql"
import { Users } from "../../Entities/Users"
import bcrypt from "bcryptjs"

import { UserType } from "../typeDefs/User"

export const CREATE_USER = {
    type: UserType,
    args: {
        name: {  type: GraphQLString},
        username: {  type: GraphQLString},
        password: {  type: GraphQLString},
    },
    async resolve(_: any, args: any) {
        const { name, username, password } = args

        const encryptPassword = await bcrypt.hash(password, 10)

        const result = await Users.insert({
            name,
            username,
            password: encryptPassword,
        })

        return {
            ...args
            id: result.identifiers[0].id,
            password: encryptPassword
        }
    }
}
```

Inside `src/schema/index.ts`:

```typescript
import { GraphqlSchema GraphQLObjectType } from "graphql"
import { GREETING } from "./Queries/Greeting"
import { CREATE_USER } from "./Mutations/User"

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        greeting: GREETING
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: CREATE_USER,
    },
})

export const schema = new GraphqlSchema({
    query: RootQuery,
    mutation: Mutation
})
```

Inside `localhost:3000/graphql`:

```graphql
mutation {
  createUser(name: "ryan", username: "ryan123", password: "ryan123") {
    id
    name
    username
    password
  }
}
```

It returns:

```json
{
  "data": {
    "createUser": {
      "id": "0",
      "name": "ryan",
      "username": "ryan123",
      "password": "asdfasdgfafhafgasdfsdfdfad"
    }
  }
}
```

The password is encrypted.

## GET ALL Users

Create `src/schema/Queries/User.ts`

```typescript
import { GraphQLList } from "graphql";
import { UserType } from "../typeDefs/User";
import { Users } from "../../Entities/Users";

export const GET_ALL_USERS = {
  type: new GraphQLList(UserType), // UserType[]
  async resolver() {
    const result = await Users.find();
    return result;
  },
};
```

Go to `src/Schema/index.ts`:

```typescript
import { GraphqlSchema GraphQLObjectType } from "graphql"
import { GREETING } from "./Queries/Greeting"
import { GET_ALL_USERS } from "./Queries/User.ts"
import { CREATE_USER } from "./Mutations/User"

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        greeting: GREETING,
        getAllUsers: GET_ALL_USERS,
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: CREATE_USER,
    },
})

export const schema = new GraphqlSchema({
    query: RootQuery,
    mutation: Mutation
})
```

Inside `localhost:3000/graphql`:

```graphql
query {
  getAllUsers {
    id
    name
    username
    password
  }
}
```

## GET User By Id

Create `src/schema/Queries/User.ts`

```typescript
import { GraphQLList } from "graphql";
import { UserType } from "../typeDefs/User";
import { Users } from "../../Entities/Users";

export const GET_ALL_USERS = {
  type: new GraphQLList(UserType), // UserType[]
  async resolver() {
    const result = await Users.find();
    return result;
  },
};

export const GET_USER = {
  type: UserType,
  args: {
    id: { type: GraphQLID },
  },
  async resolver(_: any, args: any) {
    const result = await Users.findOne(args.id);
    return result;
  },
};
```

Go to `src/Schema/index.ts`:

```typescript
import { GraphqlSchema GraphQLObjectType } from "graphql"
import { GREETING } from "./Queries/Greeting"
import { GET_ALL_USERS, GET_USER } from "./Queries/User.ts"
import { CREATE_USER } from "./Mutations/User"

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        greeting: GREETING,
        getAllUsers: GET_ALL_USERS,
        getUser: GET_USER,
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: CREATE_USER,
    },
})

export const schema = new GraphqlSchema({
    query: RootQuery,
    mutation: Mutation
})
```

Inside `localhost:3000/graphql`:

```graphql
query {
  getUser(id: 1) {
    id
    name
    username
    password
  }
}
```

# DELETE User

Inside `src/schema/Mutations/User.ts`:

```typescript
import { GraphQLString, GraphQLBoolean } from "graphql"
import { Users } from "../../Entities/Users"
import bcrypt from "bcryptjs"

import { UserType } from "../typeDefs/User"

export const CREATE_USER = {
    type: UserType,
    args: {
        name: {  type: GraphQLString},
        username: {  type: GraphQLString},
        password: {  type: GraphQLString},
    },
    async resolve(_: any, args: any) {
        const { name, username, password } = args

        const encryptPassword = await bcrypt.hash(password, 10)

        const result = await Users.insert({
            name,
            username,
            password: encryptPassword,
        })

        return {
            ...args
            id: result.identifiers[0].id,
            password: encryptPassword
        }
    }
}

export const DELETE_USER = {
    type: GraphQLBoolean,
    args: {
        id: { type: GraphQLID },
    },
    async resolver(_:any, { id }: any) {
        const result = await Users.delete(id)
        if (result.affected === 1) return true
        return false
    }
}
```

Go to `src/Schema/index.ts`:

```typescript
import { GraphqlSchema GraphQLObjectType } from "graphql"
import { GREETING } from "./Queries/Greeting"
import { GET_ALL_USERS, GET_USER } from "./Queries/User.ts"
import { CREATE_USER, DELETE_USER } from "./Mutations/User"

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        greeting: GREETING,
        getAllUsers: GET_ALL_USERS,
        getUser: GET_USER,
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: CREATE_USER,
        deleteUser: DELETE_USER,
    },
})

export const schema = new GraphqlSchema({
    query: RootQuery,
    mutation: Mutation
})
```

Inside `localhost:3000/graphql`:

```graphql
mutation {
  deleteUser(id: "7")
}
```

## UPDATE User

Create `src/schema/typeDefs/Message.ts`:

```typescript
import { GraphQLString, GraphQLBoolean, GraphqlObjectType } from "graphql";

export const MessageType = new GraphqlObjectType({
  name: "Message",
  fields: {
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  },
});
```

Inside `src/schema/Mutations/User.ts`:

```typescript
import {
    GraphQLString,
    GraphQLBoolean,
    GraphQLInputObjectType
} from "graphql"
import { Users } from "../../Entities/Users"
import bcrypt from "bcryptjs"

import { UserType } from "../typeDefs/User"
import { MessageType } from "../typeDefs/Message"

export const CREATE_USER = {
    type: UserType,
    args: {
        name: {  type: GraphQLString},
        username: {  type: GraphQLString},
        password: {  type: GraphQLString},
    },
    async resolve(_: any, args: any) {
        const { name, username, password } = args

        const encryptPassword = await bcrypt.hash(password, 10)

        const result = await Users.insert({
            name,
            username,
            password: encryptPassword,
        })

        return {
            ...args
            id: result.identifiers[0].id,
            password: encryptPassword
        }
    }
}

export const DELETE_USER = {
    type: GraphQLBoolean,
    args: {
        id: { type: GraphQLID },
    },
    async resolver(_:any, { id }: any) {
        const result = await Users.delete(id)
        if (result.affected === 1) return true
        return false
    }
}


export const UPDATE_USER = {
    type: MessageType,
    args: {
        id: { type: GraphQLID },
        input: {
            type: new GraphQLInputObjectType({
                name: "UserInput",
                fields: {
                    name: {  type: GraphQLString},
                    username: {  type: GraphQLString},
                    oldPassword: {  type: GraphQLString},
                    newPassword: {  type: GraphQLString},
                }
            })
        }

    },
    async resolve(_: any, { id, input }: any) {
        const userFound = await Users.findOne(id)

        if(!userFound) return {
            success: false,
            message: "User not found"
        }

        const isMatch = await bcrypt.compare(input.oldPassword, userFound.password)

        if (!isMatch) return {
            success: false,
            message: "Old password is incorrect"
        }

        const hashedPass = await bcrypt.hash(input.newPassword, 10)

        const result = await Users.update({id}, {
            username: input.username,
            name: input.name,
            password: hashedPass
        })

        if (result.affected === 0) return {
            success: false,
            message: "No rows were affected"
        }

        return {
            success: true,
            message: "User updated successfully"
        }
    }
}
```

Go to `src/Schema/index.ts`:

```typescript
import { GraphqlSchema GraphQLObjectType } from "graphql"
import { GREETING } from "./Queries/Greeting"
import { GET_ALL_USERS, GET_USER } from "./Queries/User.ts"
import {
    CREATE_USER,
    DELETE_USER,
    UPDATE_USER,
} from "./Mutations/User"

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        greeting: GREETING,
        getAllUsers: GET_ALL_USERS,
        getUser: GET_USER,
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: CREATE_USER,
        deleteUser: DELETE_USER,
        updateUser: UPDATE_USER,
    },
})

export const schema = new GraphqlSchema({
    query: RootQuery,
    mutation: Mutation
})
```

Inside `localhost:3000/graphql`:

```graphql
mutation {
  updateUser(
    id: "7"
    input: {
      name: "Jose"
      userName: "El Jose"
      oldPassword: "password"
      newPassword: "eljosepassword"
    }
  ) {
    success
    message
  }
}
```

# ENV Variables

Do `npm run build`, after that inside `package.json`:

```json
"scripts": {
    ...,
    "start": "node dist/index.js"
}
```

Create `.gitignore`:

```textile
dist
node_modules
.env
```

Now `git init` and `.env`:

```textile
DB_PASSWORD=password // use yours!
DB_USERNAME=root
DB_HOST=localhost
DB_PORT=3306
DB_NAME=usersdb
```

Now create `src/config.ts`:

```typescript
import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 3000;

export const DB_NAME = process.env.DB_NAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_USERNAME = process.env.DB_USERNAME;
```

This will load env variables in your computer.

Inside your `db.ts`:

```typescript
import { createConnection } from "typeorm"
import { Users } from "./Entities/Users"

import {
    DB_NAME,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_USERNAME
} "./config"

export const connectDB = async () => {
    await createConnection({
        type: 'mysql',
        username: DB_USERNAME,
        password: DB_PASSWORD,
        port: Number(DB_PORT),
        host: DB_HOST,
        database: DB_NAME,
        entities: [Users],
        synchronize: false,
        ssl: false,
    })
}
```

Now go inside your `index.ts`:

```typescript
import app from "./app";
import { connectDB } from "./db";

import { PORT } from "./config";

async function main() {
  try {
    await connectDB();
    app.listen(PORT);
    console.log("Server is ", PORT);
  } catch (error) {
    console.error(error);
  }
}

main();
```

Now `git add .`, `git commit -am "Initial commit"`, `git push origin main`.

## DEPLOY

Use DIGITAL OCEAN or any other.

- Digital Ocean App Platform for deploying the app.

- Digital Ocean Manage Database for deploying the DB.

# Conclusion

We managed to learn TypeOrm! Its quite easy to use, same as Prisma was. For this case it was a simple CRUD.

We created a simple GRAPHQL app, it has more steps than the REST API, but it brings the benefit of only sending to the frontend what is required which is a big improvement over REST.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
