---
title: "Remix: React Framework part 1"
description: "Remix is a full stack web framework that lets you focus on the user interface and work back through web standards to deliver a fast, slick, and resilient user experience."
category: ["react", "frontend", "remix"]
pubDate: "2023-11-15"
published: true
---

## What is Remix?

It's a fullstack react framework by the creators of React Router.

- Server-side Rendered React
- File System Routing
- Nested Routes
- Loaders & Actions (Server Functions)
- Easy Access to `<head>` tags and Document
- Error Handling and Error Boundary
- TypeScript & Types
- Built in Support for Cookies and Sessions

## Installation

`npx create-remix@latest`

Where we get the following file structure:

```text
src/
├── app/
│   ├── routes/
│   │   ├── demos/
│   │   │   ├── about/
│   │   │   │   ├── index.jsx
│   │   │   │   └── whoa.jsx
│   │   │   ├── params/
│   │   │   │   ├── $id.jsx
│   │   │   │   └── index.jsx
│   │   │   ├── about.jsx
│   │   │   ├── actions.jsx
│   │   │   ├── correct.jsx
│   │   │   └── params.jsx
│   │   └── index.jsx
│   ├── styles/
│   │   ├── demos/
│   │   │   └── about.css
│   │   ├── dark.css
│   │   └── global.css
│   ├── entry.client.jsx
│   ├── entry.server.jsx
│   └── root.jsx
├── build/
├── node_modules/
├── public/
├── jsconfig.json
├── package-lock.json
├── package.json
├── README.md
└── remix.config.js
```

## Starting from scratch

Go to `src/app/root.jsx` and delete everything.

Add this:

```javascript
export default function App() {
  return <h1>My App</h1>;
}
```

Go to your `localhost:3000` and notice how you only get:

```html
<!DOCTYPE html>
<h1>My App</h1>
```

This file is where we create out `html` tags and headers:

```javascript
import { Outlet, LiveReload, Link } from "remix";

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

function Document({ children, title }) {
  return (
    <html lang="en">
      <head>
        <title>{title ? title : "Remix Blog"}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}
```

Now this looks better! Remix doesn't bring live reload, so we need to import it and add it only in development.

Inside the styles folder delete everything leaving only `styles/global.css` , you can add the `global.css` file in the repository.

Returning to our `src/app/root.jsx` we can finish it up with:

```javascript
import { Outlet, LiveReload, Link, Links, Meta } from "remix";
import globalStylesUrl from "~/styles/global.css";

export const links = () => [{ rel: "stylesheet", href: globalStylesUrl }];

export const meta = () => {
  const description = "A cool blog built with Remix";
  const keywords = "remix, react, javascript";

  return {
    description,
    keywords,
  };
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({ children, title }) {
  return (
    <html lang="en">
      <head>
        <Links />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <title>{title ? title : "Remix Blog"}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

function Layout({ children }) {
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
        </ul>
      </nav>
      <div className="">{children}</div>
    </>
  );
}
```

## Routing

Inside `routes` delete everything inside the file and add this:

```javascript
function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>
        Remix is a full stack web framework by the creators of React Router.
      </p>
    </div>
  );
}

export default Home;
```

You can use `_rfce` to get the template inside VS Code, we no longer need to import React.

Now inside routes create a posts file `src/app/routes/post.jsx`:

```javascript
function Posts() {
  return (
    <div>
      <h1>This is the posts route</h1>
    </div>
  );
}

export default Posts;
```

Now, if you go to `localhost:3000/posts` you can see the post information! This is called nested routing.

### Nested routes with Outlet

Inside `src/app/routes/posts/new.jsx` create that file and add the following:

```javascript
function NewPost() {
  return (
    <div>
      <h1>New Post</h1>
    </div>
  );
}

export default NewPost;
```

Now inside `src/app/routes/post.jsx` add an Outlet to enable nester routing:

```javascript
import { Outlet } from "remix";

function Posts() {
  return (
    <div>
      <h1>This is the posts route</h1>
      <Outlet />
    </div>
  );
}

export default Posts;
```

Now, if you go to `localhost:3000/posts/new` you can see the new post information! But notice it shows the content of `posts.jsx` and bellow it shows the `new.jsx` content, this is because of `Outlet`.

Let's leave only the Outlet inside the `post.jsx`

```javascript
import { Outlet } from "remix";

function Posts() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default Posts;
```

Inside the routes folder add an `index.jsx`, like `src/app/routes/posts/index.jsx`, this way we if we go to `localhost:3000/posts` we get the content from that `index.jsx` file:

```javascript
function PostItems() {
  return (
    <div>
      <h1>Posts</h1>
    </div>
  );
}

export default PostItems;
```

## Dynamic routes

Inside the routes folder add a `$postId,jsx` file, like `src/app/routes/posts/$postId.jsx`

```javascript
import { useParams } from "remix";

function Post() {
  const params = useParams();

  return (
    <div>
      <h1>Post {params.postId}</h1>
    </div>
  );
}

export default Post;
```

Now we can access the `id` of the URL, so for example, if we got `localhost:3000/posts/12345`, the `params.postId` would be `12345`.

## useLoaderData

This hook returns the JSON parsed data from your route loader function.

Go to `src/app/routes/posts/index.jsx`.

We can take data from the server and use that hook to obtain its data:

```javascript
import { useLoaderData, Link } from "remix";

export const loader = () => {
  const data = {
    posts: [
      { id: 1, title: "Post 1", body: "Test Body 1" },
      { id: 2, title: "Post 2", body: "Test Body 2" },
      { id: 3, title: "Post 3", body: "Test Body 3" },
    ],
  };
  return data;
};

function PostItems() {
  const { posts } = useLoaderData();
  return (
    <div>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="/posts/new" className="btn">
          New Post
        </Link>
      </div>
      <ul className="posts-list">
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={post.id}>
              <h3>{post.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostItems;
```

## Actions

The `useActionData` hook returns the JSON parsed data from your route action. It returns `undefined` if there hasn't been a submission at the current location yet.

Inside `localhost:3000/posts/new`:

```javascript
import { Link, redirect } from "remix";

export const action = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");

  const fields = { title, body };

  // @todo - submit to database

  return redirect("/posts");
};

function NewPost() {
  return (
    <>
      <div className="page-header">
        <h1>New Post</h1>
        <Link to=".posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title" />
            <input type="text" name="title" id="title" />
          </div>
          <div className="form-control">
            <label htmlFor="body" />
            <textarea type="text" name="body" id="body" />
          </div>

          <button type="submit" className="btn btn-block">
            Add Post
          </button>
        </form>
      </div>
    </>
  );
}

export default NewPost;
```

If we console.log that `form` variable inside `action`:

```javascript
RemixFormData {
    __params: URLSearchParams {
        'title' => 'deded',
         'body' => 'eeded'
    }
}
```

On the `form` HTML tag we don't need the `action` or the `onSubmit` because we're going to submit to the same page.

## Error Handling

Remix sets a new precedent in web application error handling that you are going to love. Remix automatically catches most errors in your code, on the server or in the browser, and renders the closest [`ErrorBoundary`](https://remix.run/docs/en/v1/api/conventions#errorboundary) to where the error occurred. If you're familiar with React's `componentDidCatch` and `getDerivedStateFromError` class component hooks, it's just like that but with some extra handling for errors on the server.

Remix will automatically catch errors and render the nearest error boundary for errors thrown while:

- rendering in the browser
- rendering on the server
- in a loader during the initial server rendered document request
- in an action during the initial server rendered document request
- in a loader during a client-side transition in the browser (Remix serializes the error and sends it over the network to the browser)
- in an action during a client-side transition in the browser

Inside the same `root.jsx` file:

```javascript
import { Outlet, LiveReload, Link, Links, Meta } from "remix";
import globalStylesUrl from "~/styles/global.css";

export const links = () => [{ rel: "stylesheet", href: globalStylesUrl }];

export const meta = () => {
  const description = "A cool blog built with Remix";
  const keywords = "remix, react, javascript";

  return {
    description,
    keywords,
  };
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({ children, title }) {
  return (
    <html lang="en">
      <head>
        <Links />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <title>{title ? title : "Remix Blog"}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

function Layout({ children }) {
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
        </ul>
      </nav>
      <div className="">{children}</div>
    </>
  );
}

export function ErrorBoundary({ error }) {
  console.log(error);
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  );
}
```

Now, if we remove `return redirect('/posts')` line in `new.jsx`, and then on the form submit something it will show an error on the screen with:

> You defined an action for "routes/posts/new" but didn't return anything from your `action` function. Please return a value or `null`

This will work for all routes when we do something wrong.

## Generating server data with Prisma and SQLite

Prisma is a `Next-generation Node.js and TypeScript ORM` which is an overlay to make queries to the DB, in this case `SQLite`.

An example of Prisma:

```javascript
await prisma.users.create({
  firstName: "Alice",
  email: "alice@prisma.io",
  active: true,
});
```

To use we install it first:

`npm i prisma @prisma/client`

`npx prisma init --datasource-provider sqlite`

Which will generate a `prisma` folder with a `schema.prisma` inside, where we add:

```text
model Post {
  id    String  @id @default(uuid())
  title String
  body  String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

Where `@id` is a Primary Key, the `uuid()` generates a unique ID for us and the `@default` just let us add a default value to the key.

Now we use:

`npx prisma db push`

Which will show in the console:

```text
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

Your database is now in sync with your schema. Done in 23ms
```

And this generates a `dev.db` file which should be added to your `.gitignore` file.

We need to get a `sqlite` vscode extension, then press `ctrl + p` and write `sqlite`, select the open database option, which will generate the DB on the left side of your editor on the bottom, where it will generate the following tree:

```text
dv.deb/
└── Post/
    ├── id: text
    ├── title: text
    ├── body: text
    ├── createdAt: datetime
    └── updatedAt: datetime
```

## Database seeder

> _Database seeding_ is populating a database with an initial set of data. It's common to load seed data such as initial user accounts or dummy data

On the `prisma` folder create a file called `seed.js` and add the following:

```javascript
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getPosts().map((post) => {
      return db.post.create({
        data: post,
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

On the console write `node prisma/seed` to populate the DB with initial data.

Now on the console do `npx prisma studio` and on port `5555` you will see the DB!

Now go to `package.json` and add:

```json
"prisma": {
    "seed": "node prisma/seed"
},
```

To, you guess it! Populate the DB.

Now create a folder inside `app` called `utils` and inside a file called `db.server.ts`, we want to make sure Remix runs this server side and avoid the server and client to stop running after every change.

```javascript
import { PrismaClient } from ".prisma/client";

let db: PrismaClient

declare global {
  var __db: PrismaClient | undefined
}

if(process.env.NODE_ENV === 'production') {
  db = new PrismaClient()
  db.$connect()
} else {
  if(!global.__db) {
    global.__db = new PrismaClient()
    global.__db.$connect()
  }
  db = global.__db
}

export { db }

```

Now we can import this file as `db` to READ, CREATE, UPDATE, DELETE.

## Read Posts using Loader

Lets go back to `src/app/routes/posts/index.jsx` and inside the loader we remove the dummy data.

```javascript
import { useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";

export const loader = async () => {
  const data = {
    posts: await db.post.findMany(),
  };
  return data;
};

function PostItems() {
  const { posts } = useLoaderData();
  return (
    <div>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="/posts/new" className="btn">
          New Post
        </Link>
      </div>
      <ul className="posts-list">
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={post.id}>
              <h3>{post.title}</h3>
              {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostItems;
```

On the `.findMany` we can add different fields to specify the data we truly want:

```javascript
const data = {
  posts: await db.post.findMany({
    take: 20,
    select: { id: true, title: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  }),
};
```

In this case we really don't need it, but it's to show that if you add this, it will work.

## Create posts using DB

Inside our `new.jsx` file:

```javascript
import { Link, redirect } from "remix";
import { db } from "~utils/db.server";

export const action = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");

  const fields = { title, body };

  const post = await db.post.create({
    data: fields,
  });

  return redirect(`/posts/${post.id}`);
};

function NewPost() {
  return (
    <>
      <div className="page-header">
        <h1>New Post</h1>
        <Link to=".posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title" />
            <input type="text" name="title" id="title" />
          </div>
          <div className="form-control">
            <label htmlFor="body" />
            <textarea type="text" name="body" id="body" />
          </div>

          <button type="submit" className="btn btn-block">
            Add Post
          </button>
        </form>
      </div>
    </>
  );
}

export function ErrorBoundary({ error }) {
  console.log(error);
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  );
}

export default NewPost;
```

We added these lines:

```javascript
const fields = { title, body };

const post = await db.post.create({
  data: fields,
});

return redirect(`/posts/${post.id}`);
```

Now, if we create a new post, it will take us to our new created post!

## Showing a specific post

Inside our `${postId}` file:

```javascript
import { Link, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

export const loader = async ({ params }) => {
  const post = await db.post.findUnique({
    where: { id: params.postId },
  });

  if (!post) throw new Error("Post not found");

  const data = { post };
  return data;
};

function Post() {
  const { post } = useLoaderData();

  return (
    <div>
      <div className="page-header">
        <h1>{post.title}</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">{post.body}</div>
    </div>
  );
}

export default Post;
```

Now we can see a detailed post.

## Delete a post

Inside the same `$postId` file:

```javascript
import { Link, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

export const loader = async ({ params }) => {
  const post = await db.post.findUnique({
    where: { id: params.postId },
  });

  if (!post) throw new Error("Post not found");

  const data = { post };
  return data;
};

export const action = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const post = await db.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) throw new Error("Post not found");

    await db.post.delete({ where: { id: params.postId } });
    return redirect("/posts");
  }
};

function Post() {
  const { post } = useLoaderData();

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
        <form method="POST">
          <input type="hidden" name="_method" value="delete" />
          <button className="btn btn-delete">Delete</button>
        </form>
      </div>
    </div>
  );
}

export default Post;
```

We add a form with the `POST` method which will have inside a delete button, we will add the name `method` which will get read by the `action`.

The action that gets activated by the `POST` method when clicked, will await the request and then it will check the `name` attribute which is `_method`, if it's equal to `delete` it will find the `postId` from the DB, if it doesn't exist it will throw an error, if not then it will delete it by doing a `query` and it redirects the user to the list of posts.

## Conclusion

While we still need to `Auth` to the application, we managed to create so far a very in depth application using Remix. It's a great SSR React Framework that offers a lot of cool tools saving us work, I still need to test this against bigger applications with more complex DB, but I'm liking what I'm seeing so far.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
