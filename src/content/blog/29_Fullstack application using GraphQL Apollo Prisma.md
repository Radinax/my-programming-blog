---
title: "GraphQL in the server with Prisma"
description: "GraphQL has different libraries that enhances the experience of the developer and helps us produce code easier. We can add Prisma as an ORM that enhances our connection with the client by adding resolvers to the queries."
category: ["backend", "graphql", "prisma"]
pubDate: "2023-12-01"
published: true
---

> Prisma is **an ORM that is used inside of GraphQL resolvers to query a database**. It works perfectly with all your favorite tools and libraries from the GraphQL ecosystem. You can use it with SDL-first and code-first GraphQL schemas and with any server library such as Apollo Server, Express, NestJS or Mercurius.

Let's start by setting up the server with Prisma.

The complete project can be found [here](https://github.com/Radinax/react-gamelist-management/tree/feature/graphql).

## Installing dependencies

```text
yarn add graphql-yoga
yarn add prisma-client-lib
yarn global add prisma
```

## File Structure

```text
prisma/
├── datamodel.prisma
└── prisma.yml
src
package.json
```

## GraphQL Yoga

We will use [graphql-yoga](https://github.com/prisma-labs/graphql-yoga) on the server side. So what is this library?

> It’s Fully-featured GraphQL Server with focus on easy setup, performance & great developer experience

It’s based on the following libraries:

- `express`/`apollo-server`: Performant, extensible web server framework
- `graphql-subscriptions`/`subscriptions-transport-ws`: GraphQL subscriptions server
- `graphql.js/graphql-tools`: GraphQL engine & schema helpers
- `graphql-playground`: Interactive GraphQL IDE

This means it will do a lot of the work under the hood instead of manually doing everything from scratch.

## Get everything starting

- Create folder of project, inside do `npm init` and `git init`.
- Create a `src` folder with a `index.js` file inside
- `yarn add graphql-yoga nodemon`

Inside the index.js file we will put the following code:

```javascript
const { GraphQLServer } = require("graphql-yoga");

// Contains GraphQL type definitions
const typeDefs = `
  type Query {
    info: String!
  }
`;
// Contains resolvers for the fields specified in typeDefs
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log("Server running at https://localhost:4000"));
```

Inside our package.json we will add in our scripts:

```javascript
"scripts": {
  "server": "nodemon src/index.js"
}
```

Now, if we write on the terminal `yarn server` it will activate in our `https://localhost:4000` showing a playground.

## Prisma

Let us add [Prisma](https://www.prisma.io/).

```text
yarn add prisma
```

> Prisma makes database access easy with an auto-generated and type-safe query builder that’s tailored to your database schema. It provides an alternative to traditional ORMs and SQL query builders. Start with a new database or introspect an existing one to get started.

Where an ORM means:

> in computer science is a programming technique for converting data between incompatible type systems using object-oriented programming languages. This creates, in effect, a “virtual object database” that can be used from within the programming language.

Let’s create a folder named **prisma** in our root and add two files:

`datamodel.prisma`: It’s where we will add our types and create associations and hook up the database. **This is what the database will receive**.

```graphql
type Link {
  id: ID! @id
  createdAt: DateTime! @createdAt
  description: String!
  url: String!
}
```

`prisma.yml`: It’s where we will instruct `prisma` how to hit an endpoint and the infrastructure setup.

```graphql
endpoint: ''

datamodel: datamodel.prisma

generate:
  - generator: javascript-client
    output: ../src/generated/prisma-client
```

Now we deploy it from the command line with `prisma deploy` and it will give us the following options:

- `Demo server + MySQL database`: Free demo environment hosted in Prisma Cloud (requires login)
- `Use other server`: Manually provide endpoint of a running Prisma server
- `Use existing database`: Connect to existing database
- `Create new database`: Set up a local database using Docker

We will use the `demo server` for now, you can login using your Github account when prompted.

Now it will provide you the endpoint of your server!

Next we use `prisma generate` on the terminal to generate a folder inside `src` called `generated` which is the name we used in our `prisma.yml` file, inside that folder there will be a number of files of schemas and types definition that help us connect with MySQL.

## Finishing touches

With our prisma model hooked up, we can erase the links array, instead with our feed method we can access the context we passed as parameter and from it we can access Prisma, which gives us access to our links which are stored in the database.

```javascript
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    // feed: () => links
    feed: (root, args, context, info) => {
      return context.prisma.links();
    },
  },
  // Rest of code here
};
```

Now in our mutation we can refactor it to use the create link mutation that Prisma generates for us, which takes an url and description, which we can get from the `args`.

```javascript
const resolvers = {
  // Rest of code here
  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description,
      });
    },
  },
};
```

Now we want to add a context property to our server and then require the prisma client and assign it to the context property.

```javascript
const { prisma } = require("prisma-client-lib");

const server = new GraphQLServer({
  typeDefs: "./src//schema.graphql",
  resolvers,
  context: { prisma },
});
```

Now in your terminal you should see your Prisma Admin address, go there to check your database, now activate `yarn server` and perform a mutation, hit the play button and check your `prisma` admin to see it gets updated!

## Authentication in Prisma

Now we’re going to add some modifications to the code we used by adding authentication, we will start on the backend first updating our `datamodel`, use the command `prisma deploy` to generate the update, then make the necessary changes to the schema `typeDefs` in sync with the changes in `datamodel` and then write the respective resolvers.

### Updating the `datamodel`

In `datamodel.prisma` we add the following information:

```graphql
type Link {
  id: ID! @id
  createdAt: DateTime! @createdAt
  description: String!
  url: String!
  postedBy: User
}

type User {
  id: ID! @id
  name: String!
  email: String! @unique
  password: String!
  links: [Link!]!
}
```

On your terminal use `prisma deploy`.

### Updating your schema

In your schema add:

```graphql
type Link {
  id: ID! @id
  createdAt: DateTime! @createdAt
  description: String!
  url: String!
  postedBy: User // This is new
}

type Mutation {
  post(url: String!, description: String!): Link!
  signup(email: String!, password: String!, name: String!): AuthPayload // New
  login(email: String!, password: String!): AuthPayload // New
}

type AuthPayload {
  token: String
  user: User
}

type User {
  id: ID!
  name: String!
  email: String!
  links: [Link!]!
}
```

### Refactoring resolvers

The next step are resolvers, but with the way we’re handling things in our root index.js we will have too much information, so it’s better to handle the resolvers separately, so make the following changes on the folder structure on the root of your server:

```text
src/
└── resolvers/
    ├── Query.js
    ├── User.js
    ├── Mutations.js
    └── Link.js
```

Now inside Query.js we add feed:

```javascript
function feed(parent, args, context, info) {
  return context.prisma.links();
}

module.exports = {
  feed,
};
```

Next comes our Mutations.js:

```javascript
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils"); // We add this in a second

async function signup(parent, args, context, info) {
  const hashedPassword = await bcrypt.hash(args.password, 10);
  const { password, ...user } = await context.prisma.createUser({
    ...args,
    password: hashedPassword,
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  const { password, ...user } = await context.prisma.user({
    email: args.email,
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

module.exports = {
  signup,
  login,
  post,
};
```

Lets explain step by step:

**signup**

- We encrypt the password using a library we will install soon.
- Use prisma-client to store the new User in the database by instanciating createUser.
- Generate a JWT signed with APP_SCRET. We need to install jwt for this.
- Finally we return the token and the user.

**login**

- We instantiate the user by getting its email only and throw an error if the user doesn’t exist.
- We compare the input’d password to the one in the database, if they don’t match throw another error.
- We return token and user.

### Adding a `utils` with the token

Create a utils.js inside the root of your server and add:

```javascript
const jwt = require("jsonwebtoken");
const APP_SECRET = "GraphQL-is-aw3some";

function getUserId(context) {
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error("Not authenticated");
}

module.exports = {
  APP_SECRET,
  getUserId,
};
```

In our GraphQL Server which comes from graphql-yoga we’re accessing a request object on the context. However, when initializing the context, we’re really only attaching the prisma client instance to it - there’s no request object yet that could be accessed.

```javascript
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: (request) => {
    return {
      ...request,
      prisma,
    };
  },
});
```

### Authentication in post mutation

Lets fix our post resolver in Mutation.js:

```javascript
function post(parent, args, context, info) {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  });
}
```

- We’re now using getUserId which is stored in the JWT set at the Authorization header of the incoming HTTP request.
- We also use userId to connect the Link to be created with the User who is creating it.

### Resolving relations

We need to ensure User and Link gets properly resolved. Since we added **postedBy** on **Link** and **links** on **User** we need to implement them in our GraphQL server.

On Link.js:

```javascript
function postedBy(parent, args, context) {
  return context.prisma.link({ id: parent.id }).postedBy();
}

module.exports = {
  postedBy,
};
```

In this resolver we’re fetching Link using prisma client instance and invoke the postBy.

In User.js:

```javascript
function links(parent, args, context) {
  return context.prisma.user({ id: parent.id }).links();
}

module.exports = {
  links,
};
```

### Adding everything

Inside your root index.js replace your old resolvers with the new one:

```javascript
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
};
```

### Testing our work!

Lets test the signup feature:

```graphql
mutation {
  signup(name: "Alice", email: "alice@prisma.io", password: "graphql") {
    token
    user {
      id
    }
  }
}
```

Doing this answers us with a token, then we open another tab and we add the following query:

```graphql
mutation {
  post(
    url: "www.graphqlconf.org"
    description: "An awesome GraphQL conference"
  ) {
    id
  }
}
```

But where it says **HTTP HEADERS** on the bottom left of your screen add the token:

```javascript
{
  "Authorization": "Bearer INSERT_TOKEN_HERE"
}
```

And you get for response, great! Now we sign up! Now lets check the login with the data we used to sign up, send another query:

```graphql
mutation {
  login(email: "alice@prisma.io", password: "graphql") {
    token
    user {
      email
      links {
        url
        description
      }
    }
  }
}
```

## Subscriptions in Prisma

In the previous post we focused on how to add authentications to our server, we created a signup feature which provided a token we use to validate the user to post links. This time we need to add subscriptions, which are real time events whenever something occurs, like when a user logins, this is important especially for our client side with Apollo and React so the client can react accordingly.

### Subscribing new Link elements

Add this to your schema:

```graphql
type Subscription {
  newLink: Link
}
```

And for your resolver add a file called Subscription.js to your resolvers folder:

```javascript
function newLinkSubscribe(parent, args, context, info) {
  return context.prisma.$subscribe.link({ mutation_in: ["CREATED"] }).node();
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  newLink,
};
```

What this means is that when you create a link you proxie a subscription from the Prisma API.

Now add it to the root index.js.

### Testing your subscription

Activate the server and open two different windows in your browser, one will act as a permanent websocket connection to the server, while the next one will send a post mutation to trigger the subscription.

Subscription:

```graphql
subscription {
  newLink {
    id
    url
    description
    postedBy {
      id
      name
      email
    }
  }
}
```

Put it in your playground.

Which is waiting for an event to happen, which we will trigger with the following mutation, but before we need to be authenticated! So lets do it:

```graphql
mutation {
  login(email: "alice@prisma.io", password: "graphql") {
    token
    user {
      email
      links {
        url
        description
      }
    }
  }
}
```

With the token, add it to your HTTP headers and then make the post mutation:

```graphql
mutation {
  post(url: "www.graphqlweekly.com", description: "Post to show subscription") {
    id
  }
}
```

Which gives us the data we just posted.

## Summary of how to add a server with Prisma

- Create project folder and inside open your code editor, then write `npm init`.
- `yarn add graphql-yoga nodemon prisma-client-lib`
- Add `nodemon` and in your `package.json` add a script `“server”: “nodemon node src/index.js”`,
- Add `graphql-yoga`, `prisma-client-lib` and add globally `prisma`.
- Create a folder called `prisma` on root and add two files named `datamodel.prisma` and `prisma.yml`.
- Create a `src` folder and add an `index.js` and `schema.graphql` files inside.
- Inside `schema.graphql` define your `typeDefs`.
- In your index.js file import `GraphQLServer` from `graphql-yoga` and create a `new GraphQLServer` which takes the `typeDefs` which accepts the route of the `schema.graphql` file, a context which takes `prisma` from `prisma-client-lib` and `resolvers`.
- Next define your `resolvers` and `typeDefs`.
- Define in your `prisma.yml` file the EP as empty string, `datamodel.prisma` file and the generate information needed.
- In your `datamodel.prisma` you define your types.
- In your terminal use `prisma deploy` and select demo for a simple project with MySQL.
- That’s it!

## Conclusion

Today we learned how to use the Prisma ORM! Its a very interesting way of handling data with the resolvers and then connecting with a database.

See you on the next post.

Sincerely,

**End. Adrian Beria**
