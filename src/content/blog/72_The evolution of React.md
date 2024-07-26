---
title: "The evolution of React JS: React Router V7 and SSR done right"
description: "We're gonna give a summary of React Conference by Ryan Florence about React Router V7 and how it implements SSR, SSG and CSR all in one!"
category: ["typescript", "reactjs"]
pubDate: "2024-07-26"
published: true
---

This is gonna be a quick one, the idea is to give a summary of the conference of React 2024 going on right now, one in particular that caught my attention was the one done showcasing how to enhance your forms using React Server Action.

This is from React conference in 2024:

https://www.youtube.com/watch?v=ZcwA0xt8FlQ

Here is the repo: https://github.com/ryanflorence/demo-notes-app/tree/rr7

## Defining routes in RR7

For starters, let's check how we define routes now:

```javascript
import { defineConfig } from "vite";
import { vitePlugin as react } from "@react-router/dev";
import inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      appDirectory: "src",
      ssr: false, // THIS TURNS ON OR OFF THE SSR FEATURE
      future: {
        unstable_singleFetch: true,
      },
      // below is SSG
      //prerender() {
      //  return ["/store"]
      //},
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route("", "containers/Home.tsx", { index: true });
          route("/login", "containers/Login.tsx");
          route("/signup", "containers/Signup.tsx");
          route("/settings", "containers/Settings.tsx");
          route("/notes/new", "containers/NewNote.tsx");
          route("/notes/:id", "containers/Notes.tsx");
          route("*", "Routes.tsx");
        });
      },
    }),
    inspect(),
  ],
});
```

What we're doing now is switch the features of [Remix](https://remix.run/) and Vite Plugin towards React Router and we get the above!

But, how do we define our routes then? Easy!

```javascript
import { Route, Routes } from "react-router";
import NotFound from "./containers/NotFound.tsx";

export default function Links() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}
```

By defining it inside Vite config, it will get read automatically because its code splitting the route we define in the vite config.

Now for the big update, lets check `clientLoader`.

## Client Loader

This new function is meant to handle asynchronous operations and it will always run BEFORE the component gets rendered, which is big because we don't have to do it inside the component itself and do the usual check operations for errors and have the code get dirty, now we can do it separately!

Let's check first how it looks like:

```javascript
export async function clientLoader({ request, params }: CLFA) {
  await requireAuth(request);
  const note = await API.get("notes", `/notes/${params.id}`, {});
  if (note.attachment) {
    note.attachmentURL = await Storage.vault.get(note.attachment);
  }
  return note;
}
```

This will always run before `Notes`. We can read this by using `useLoaderData` from React Router and we read its typing. Below we show how the component looks like:

```javascript
export default function Notes() {
  const note = useLoaderData<typeof clientLoader>();
  const fetcher = useFetcher();

  function formatFilename(str: string) {
    return str.replace(/^\w+-/, "");
  }

  const confirm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      e.preventDefault();
    }
  };

  return (
    <div className="Notes">
      {note && (
        <fetcher.Form method="post" encType="multipart/form-data">
          <Stack gap={3}>
            <Form.Group controlId="content">
              <Form.Control
                defaultValue={note.content}
                size="lg"
                as="textarea"
                name="content"
                required
              />
            </Form.Group>
            <Form.Group className="mt-2" controlId="file">
              <Form.Label>Attachment</Form.Label>
              {note.attachment && (
                <p>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={note.attachmentURL}
                  >
                    {formatFilename(note.attachment)}
                  </a>
                </p>
              )}
              <input
                type="hidden"
                name="attachment"
                defaultValue={note.attachment}
              />
              <Form.Control type="file" name="newAttachment" />
            </Form.Group>
            <Stack gap={1}>
              <LoaderButton
                size="lg"
                type="submit"
                name="intent"
                value="save"
                isLoading={fetcher.formData?.get("intent") === "save"}
              >
                Save
              </LoaderButton>
              <LoaderButton
                size="lg"
                variant="danger"
                name="intent"
                value="delete"
                isLoading={fetcher.formData?.get("intent") === "delete"}
                onClick={confirm}
              >
                Delete
              </LoaderButton>
            </Stack>
          </Stack>
        </fetcher.Form>
      )}
    </div>
  );
}
```

## React Server Components

In the Vite config we can turn `ON` the SSR option and it enables the rendering in the server, for example we can do:

```javascript
export async function loader() {
  let products = await getTopProducts()
  return (
    <div>
      {products.map((product: Product) => (
        <div key={product.handle}>
          <h2>{product.title}</h2>
          <Carousel media={product.media.edges} />
        </div>
      ))}
    </div>
  )
}

export default function Store() {
  let products = useLoaderData() as any

  return (
    <div>
      <h1>Store</h1>
      {products}
    </div>
  )
}
```

Do note that we switch from `clientLoader` to `loader` which indicates that we're rendering it on the server and not the client.

This is absolutely FANTASTIC! We can finally use SSR without resorting only to NextJS and all its functionalities and performance issues that bring more pain that gain, with due experience you usually get around it, and its needed to be learned in 2024, but this new option will be really great in the future. But this also means we need, as a community, to define the correct way to work with these new features as this is not a framework like NextJS anymore and its a library, we need to take into account scalability when we define the way to structure our projects.

React Server Components and SSR are coming to Vanilla React in the form of React Router V7!

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
