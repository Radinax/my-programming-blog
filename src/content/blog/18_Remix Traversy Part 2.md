---
title: "Remix: React Framework part 2. Prisma and SQLite"
description: "This is the second part of our blog project using the Remix Framework! Let's focus on adding authentication and authorization to our app."
category: ["react", "frontend", "remix", "sql", "sqlite", "prisma"]
pubDate: "2023-11-20"
published: true
---

## File structure

```text
src/
├── app/
│   ├── routes/
│   │   ├── auth/
│   │   │   ├── login.jsx
│   │   │   └── logout.jsx
│   │   ├── posts/
│   │   │   ├── $postId.jsx
│   │   │   ├── index.jsx
│   │   │   └── new.jsx
│   │   ├── index.jsx
│   │   └── post.jsx
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   ├── db.server.ts
│   │   └── session.server.ts
│   ├── entry.client.jsx
│   ├── entry.server.jsx
│   └── root.jsx
├── prisma/
│   ├── dev.db
│   ├── schema.prisma
│   └── seed.js
├── .env
├── jsconfig.json
├── package.lock.json
├── package.json
├── README.md
└── remix.config.js
```

## Post validation

On `src/app/routes/posts/new.js`, let's bring from remix `useActionData` and `json`:

```javascript
import { Link, redirect, useActionData, json } from "remix";
import { db } from "~/utils/db.server";

function validateTitle(title) {
  if (typeof title !== "string" || title.length < 3) {
    return "Title should be at least 3 characters long";
  }
}

function validateBody(body) {
  if (typeof body !== "string" || body.length < 10) {
    return "Body should be at least 10 characters long";
  }
}

export const action = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");

  const fields = { title, body };

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return json({ fieldErrors, fields }, { status: 400 });
  }

  const post = await db.post.create({
    data: fields,
  });

  return redirect(`/posts/${post.id}`);
};

function NewPost() {
  const action = useActionData();
  return (
    <>
      <div className="page-header">
        <h1>New Post</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={action?.fields?.title}
            />
            <div className="error">
              <p>{action?.fieldErrors?.title && action?.fieldErrors?.title}</p>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Post Body</label>
            <textarea
              type="text"
              name="body"
              id="body"
              defaultValue={action?.fieldErrors?.body}
            />
            <div className="error">
              <p>{action?.fieldErrors?.body && action?.fieldErrors?.body}</p>
            </div>
          </div>

          <button type="submit" className="btn btn-block">
            Add Post
          </button>
        </form>
      </div>
    </>
  );
}
/*
export function ErrorBoundary({ error }) {
  console.log(error);
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  );
}
*/

export default NewPost;
```

We basically added this in our server:

```javascript
const fieldErrors = {
  title: validateTitle(title),
  body: validateBody(body),
};

if (Object.values(fieldErrors).some(Boolean)) {
  console.log(fieldErrors);
  return json({ fieldErrors, fields }, { status: 400 });
}
```

Which validates the length of our data inside the forms.

## Updating Prisma Model

Inside `src/prisma/schema.prisma` we need to add a model for our users:

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id    String  @id @default(uuid())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  username String @unique
  passwordHash String
  posts Post[]
}

model Post {
  id    String  @id @default(uuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  title String
  body  String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

What we're saying is that the Post `id` should have a relation with User `id`.

The `onDelete: Cascade` is for when we delete a Post, it will also delete the relationship with the User.

## Updating seed file

Inside `src/prisma/seed.js` we need to add a default user to our application:

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  const defaultUser = await prisma.user.create({
    data: {
      username: "Michael",
      // Hash for password - twixrox
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });
  await Promise.all(
    getPosts().map((post) => {
      const data = {
        userId: { userId: defaultUser.id, ...post },
      };
      return prisma.post.create({
        data,
      });
    })
  );
}

seed();

function getPosts() {
  return [
    {
      title: "JavaScript Performance Tips",
      body: `We will look at 10 simple tips and tricks to increase the speed of your code when writing JS`,
    },
    {
      title: "Tailwind vs. Bootstrap",
      body: `Both Tailwind and Bootstrap are very popular CSS frameworks. In this article, we will compare them`,
    },
    {
      title: "Writing Great Unit Tests",
      body: `We will look at 10 simple tips and tricks on writing unit tests in JavaScript`,
    },
    {
      title: "What Is New In PHP 8?",
      body: `In this article we will look at some of the new features offered in version 8 of PHP`,
    },
  ];
}
```

Remember to kill the terminal and use `npx prisma db push` to apply the changes on the DB. Next `node prisma/seed` and also remember you can use `npx prisma studio` for a cool UI to check the DB data.

## Login and Registration Form

Add on `src/app/root.jsx` inside the `nav` container:

```javascript
<li>
  <Link to="/auth/login">Login</Link>
</li>
```

Inside our `src/app/routes` folder, lets create a folder called `auth` with `login.jsx`:

```javascript
import { useActionData, json, redirect } from "remix";
import { db } from "~/utils/db.server";

function badRequest(data) {
  return json(data, { status: 400 });
}

export const action = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");

  const fields = {
    loginType,
    username,
    password,
  };

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return badRequest({ fieldErrors, fields });
  }
};

const Login = () => {
  const actionData = useActionData();
  return (
    <div className="auth-container">
      <div className="page-header">
        <h1>Login</h1>
      </div>

      <div className="page-content">
        <form method="POST">
          <fieldset>
            <legend>Login or Register</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>

            <label>
              <input type="radio" name="loginType" value="register" /> Register
            </label>
          </fieldset>

          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={actionData?.fields?.username}
            />

            <div className="error">
              {actionData?.fieldErrors?.username &&
                actionData?.fieldErrors?.username}
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue={actionData?.fields?.password}
            />

            <div className="error">
              {actionData?.fieldErrors?.password &&
                actionData?.fieldErrors?.password}
            </div>
          </div>

          <button className="btn btn-block" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

We add a `radioInput` with two options, a `username` text input and a `password` input with the respective type and we round it up with a button submitting the data.

We create an action where we get the submitted data, validate it and then, depending on the login type, we create a session for the user.

## User login session

Install `npm i bcrypt` so we can work with hashed passwords.

Inside our `.env` folder, let's add a `SESSION_SECRET` variable:

```javascript
SESSION_SECRET = "secret";
```

Inside `utils` folder we create a file `src/app/utils/session.server.ts`.

Inside we will create a `login` function that will check if the user submitted data is correct by checking if the username exists in the DB and checking with `bcrypt`, the hashed password.

Then we get our `.env` session variable and we create a cookie session storage where we store the cookie, then we create the user session using their `userId`.

```javascript
import bcrypt from "bcrypt";
import { db } from "./db.server";
import { createCookieSessionStorage, redirect } from "remix";

// Login user
export async function login({ username, password }) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) return null;

  // Check password
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) return null;

  return user;
}

// Get session secret
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("No Session Secret");
}

// Create session storage
const storage = createCookieSessionStorage({
  cookie: {
    name: "remixblog_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: true,
  },
});

// Create session
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// Get user session
export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// Get logged in user
export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    return null;
  }
}
```

Returning to our `src/app/routes/auth/login.jsx`, we add following code inside our `action` where we create the user session using the `createUserSession` function we just created:

```javascript
switch (loginType) {
  case "login": {
    // Find user
    const user = await login({ username, password });
    // Check user
    if (!user) {
      return badRequest({
        fields,
        fieldErrors: {
          username: "Invalid Credentials",
        },
      });
    }
    // Create user session
    return createUserSession(user.id, "/posts");
  }
  case "register": {
    // Check if user exists
    // Create user
    // Create user session
  }
  default: {
    return badRequest({
      fields,
      formError: "Login type is not valid",
    });
  }
}
```

## Adding logout functionality

Inside our `root.jsx` we bring the `useLoaderData` and `getUser`:

```javascript
export const loader = async ({ request }) => {
  const user = await getUser(request);
  const data = {
    user,
  };
  return data;
};
```

And inside our `Layout` function

```javascript
function Layout({ children }) {
  const { user } = useLoaderData();
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>

        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          {user ? (
            <li>
              <form action="/auth/logout" method="POST">
                <button className="btn" type="submit">
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          )}
          <li>
            <Link to="/auth/login">Login</Link>
          </li>
        </ul>
      </nav>
      <div className="">{children}</div>
    </>
  );
}
```

We get to add the logout button! Now let's work on creating the route, but first let's add the `logout` inside our `session.server.ts` file:

```javascript
// Log out user and destroy session
export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));

  return redirect("/auth/logout", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
```

Now inside our `src/app/routes/auth/logout.jsx` file:

```javascript
import { redirect } from "remix";
import { logout } from "~/utils/session.server";

export const action = async ({ request }) => {
  return logout(request);
};

export const loader = async () => {
  return redirect("/");
};
```

We can now logout completely!

## Registering a user

Inside our `src/app/routes/auth/login.jsx`, let's work on the `register` case in the switch case:

```javascript
case "register": {
    // Check if user exists
    const userExists = await db.user.findFirst({
        where: {
            username
        }
    })
    if(userExists) {
        return badRequest({
            fields,
            fieldErrors: {
                username: `User ${username} already exists`
            }
        })
    }
    // Create user
    const user = await register({ username, password })
    if(!user) {
        return badRequest({
            fields,
            formError: 'Something went wrong',
        })
    }
    // Create user session
    return createUserSession(user.id, "/posts");
}
```

Now inside our `session.server.ts` we need to create the data in our DB for the new user:

```javascript
// Register new user
export async function register({ username, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: {
      username,
      passwordHash,
    },
  });
}
```

## Add user to post

Inside `src/app/routes/posts/new.jsx`, we import `getUser`:

```javascript
import { getUser } from "~/utils/session.server";
```

And inside our action we get the user and send the `userId` when create a post:

```javascript
export const action = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");
  const user = await getUser(request);

  const fields = { title, body };

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return badRequest({ fieldErrors, fields });
  }

  const post = await db.post.create({
    data: {
      ...fields,
      userId: user.id,
    },
  });

  return redirect(`/posts/${post.id}`);
};
```

Open up `npx prisma studio`, create a post with a new user and check to see the `username` is there now!

## Delete access control for every user

Inside `src/app/routes/posts/$postId.jsx`:

```javascript

```

And inside our action we add a condition for the user to only being able to delete a post if it's his:

```javascript
export const action = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const user = await getUser(request);
    const post = await db.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) throw new Error("Post not found");

    if (user && post.userId === user.id) {
      await db.post.delete({ where: { id: params.postId } });
    }

    return redirect("/posts");
  }
};
```

Inside our loader and post we can disable the Delete button:

```javascript
export const loader = async ({ request, params }) => {
  const user = await getUser(request);
  const post = await db.post.findUnique({
    where: { id: params.postId },
  });

  if (!post) throw new Error("Post not found");

  const data = { post, user };

  return data;
};
```

Now inside the `Post` function we can get the user id and compare it with the post id to enable/disable the delete button:

```javascript
function Post() {
  const { post, user } = useLoaderData();

  return (
    <div>
      <div className="page-header">
        <h1>{post.title}</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">{post.body}</div>

      <div className="page-footer">
        {user.id === post.userId && (
          <form method="POST">
            <input type="hidden" name="_method" value="delete" />
            <button className="btn btn-delete">Delete</button>
          </form>
        )}
      </div>
    </div>
  );
}
```

## Conclusion

We created a fully functional blog using `Remix`! We added sessions, authorization and authentication based on cookies. Working with `Remix` is an interesting experience compared to `create-react-app` since we skip a lot of routing configuration with `react-router` and the interest folder structure that enables the routing system to work automatically inside our `routes` folder.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
