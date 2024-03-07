---
title: "React Query"
description: "React Query is often described as the missing data-fetching library for React, but in more technical terms, it makes fetching, caching, synchronizing and updating server state in your React applications a breeze."
category: ["react", "frontend", "tanstack"]
pubDate: "2023-11-16"
published: true
---

> React Query is often described as the missing data-fetching library for React, but in more technical terms, it makes fetching, caching, synchronizing and updating server state in your React applications a breeze.

## When to use

When you're doing a request to an API in a React application but not using Redux, then use `React Query`.

## Why use them?

Out of the box, React applications **do not** come with an opinionated way of fetching or updating data from your components so developers end up building their own ways of fetching data. This usually means cobbling together component-based state and effect using React hooks, or using more general purpose state management libraries to store and provide asynchronous data throughout their apps.

While most traditional state management libraries are great for working with client state, they are **not so great at working with async or server state**. This is because **server state is totally different**. For starters, server state:

- Is persisted remotely in a location you do not control or own
- Requires asynchronous APIs for fetching and updating
- Implies shared ownership and can be changed by other people without your knowledge
- Can potentially become "out of date" in your applications if you're not careful

Once you grasp the nature of server state in your application, **even more challenges will arise** as you go, for example:

- Caching... (possibly the hardest thing to do in programming)
- Deduping multiple requests for the same data into a single request
- Updating "out of date" data in the background
- Knowing when data is "out of date"
- Reflecting updates to data as quickly as possible
- Performance optimizations like pagination and lazy loading data
- Managing memory and garbage collection of server state
- Memoizing query results with structural sharing

If you're not overwhelmed by that list, then that must mean that you've probably solved all of your server state problems already and deserve an award. However, if you are like a vast majority of people, you either have yet to tackle all or most of these challenges and we're only scratching the surface!

React Query is hands down one of the _best_ libraries for managing server state. It works amazingly well **out-of-the-box, with zero-config, and can be customized** to your liking as your application grows.

React Query allows you to defeat and overcome the tricky challenges and hurdles of _server state_ and control your app data before it starts to control you.

On a more technical note, React Query will likely:

- Help you remove **many** lines of complicated and misunderstood code from your application and replace with just a handful of lines of React Query logic.
- Make your application more maintainable and easier to build new features without worrying about wiring up new server state data sources
- Have a direct impact on your end-users by making your application feel faster and more responsive than ever before.
- Potentially help you save on bandwidth and increase memory performance

## Installation

For `React Query`:

`npm i react-query`

## Configuration

```javascript
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

const fetchData = async () => {
  const res = await fetch(
    "https://api.github.com/repos/tannerlinsley/react-query"
  );
  return res.json();
};

function Example() {
  const { isLoading, error, data } = useQuery("repoData", fetchData);

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
}
```

As you can see we only need to wrap our `App` component with the `QueryClientProvider` which needs the `QueryClient()` as props and every component inside will be able to make use of React Query capacity!

`useQuery` takes two properties, one is a `title` for the request which is a string, second is a the async request, which can be either using the `fetch` API or `axios` which will be going in depth in another post.

And just like that we can easily use React Query! Now let's us check some cool tools.

## React Query Dev Tools

This is an NPM package we install `npm i react-query-devtools`, you can import this inside your `App.js` file:

```javascript
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevTools } from "react-query-devtools";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
      <ReactQueryDevTools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

Which produces a very interesting menu we can access by pressing the icon on the `http://localhost:3000` on the bottom right.

`useQuery` can allow a third parameter, which is an object:

```javascript
{
    staleTime: 2000,
    retry: 3, // Will retry failed requests 10 times before displaying an error
    cacheTime: 10, //
    onSuccess: () => console.log('data fetched successfully'),
    onError: () => console.log('ERROOOOOOR'),
}
```

These data are shown inside the Dev Tools, but also in the [documentation](https://react-query.tanstack.com/reference/useQuery) if you need it.

## Query Variables

A query function can be literally any function that **returns a promise**. The promise that is returned should either **resolve the data** or **throw an error**.

All of the following are valid query function configurations:

```javascript
useQuery(["todos"], fetchAllTodos);
useQuery(["todos", todoId], () => fetchTodoById(todoId));
useQuery(["todos", todoId], async () => {
  const data = await fetchTodoById(todoId);
  return data;
});
useQuery(["todos", todoId], ({ queryKey }) => fetchTodoById(queryKey[1]));
```

On our example:

```javascript
const fetchData = async (key, page) => {
  const res = await fetch(
    `https://api.github.com/repos/tannerlinsley/react-query/?page=${page}`
  );
  return res.json();
};

function Example() {
  const [page, setPage] = React.useState(1);
  const { isLoading, error, data } = useQuery(["repoData", page], fetchData);

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
      <button onClick={() => setPage(page + 1)}>Next</button>
      <button onClick={() => setPage(page - 1)}>Prev</button>
    </div>
  );
}
```

There we pass a variable to our request, we implemented two simple buttons to see more data from our API.

## Pagination

Lets take a look at this code:

```javascript
import React from "react";
import axios from "axios";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

async function fetchProjects(page = 0) {
  const { data } = await axios.get("/api/projects?page=" + page);
  return data;
}

function Example() {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(0);

  const { status, data, error, isFetching, isPreviousData } = useQuery(
    ["projects", page],
    () => fetchProjects(page),
    { keepPreviousData: true, staleTime: 5000 }
  );

  // Prefetch the next page!
  React.useEffect(() => {
    if (data?.hasMore) {
      queryClient.prefetchQuery(["projects", page + 1], () =>
        fetchProjects(page + 1)
      );
    }
  }, [data, page, queryClient]);

  return (
    <div>
      <p>
        In this example, each page of data remains visible as the next page is
        fetched. The buttons and capability to proceed to the next page are also
        supressed until the next page cursor is known. Each page is cached as a
        normal query too, so when going to previous pages, you'll see them
        instantaneously while they are also refetched invisibly in the
        background.
      </p>
      {status === "loading" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        <div>Error: {error.message}</div>
      ) : (
        // `data` will either resolve to the latest page's data
        // or if fetching a new page, the last successful page's data
        <div>
          {data.projects.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </div>
      )}
      <div>Current Page: {page + 1}</div>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button> <button
        onClick={() => {
          setPage((old) => (data?.hasMore ? old + 1 : old));
        }}
        disabled={isPreviousData || !data?.hasMore}
      >
        Next Page
      </button>
      {
        // Since the last page's data potentially sticks around between page requests,
        // we can use `isFetching` to show a background loading
        // indicator since our `status === 'loading'` state won't be triggered
        isFetching ? <span> Loading...</span> : null
      }{" "}
      <ReactQueryDevtools initialIsOpen />
    </div>
  );
}
```

It's very similar to what we did before but in a more complete fashion, there are a few new things:

`{ keepPreviousData: true, staleTime: 5000 }`: This piece of code as it names suggest cache the previous data and specifying a longer `staleTime` means queries will not re-fetch their data as often.

```javascript
async function fetchProjects(page = 0) {
  const { data } = await axios.get("/api/projects?page=" + page);
  return data;
}

// Prefetch the next page!
React.useEffect(() => {
  if (data?.hasMore) {
    queryClient.prefetchQuery(["projects", page + 1], () =>
      fetchProjects(page + 1)
    );
  }
}, [data, page, queryClient]);
```

- If data for this query is already in the cache and **not invalidated**, the data will not be fetched
- If a `staleTime` is passed eg. `prefetchQuery('todos', fn, { staleTime: 5000 })` and the data is older than the specified staleTime, the query will be fetched
- If no instances of `useQuery` appear for a prefetched query, it will be deleted and garbage collected after the time specified in `cacheTime`.

## Conclusion

We got to learn a very powerful tool in `react-query`! It's quite fascinating to use, especially when you combine it with `useReducer` + `useContext`. you can have a very solid state management system if you don't need Redux.

But when we need Redux, in my opinion, there is a better way to work with a similar package named `RTK Query`! Which comes with `@reduxjs/toolkit`.

For small apps we can use `react-query` with `useReducer` + `useContext`, for medium to bigger applications, we should use `Redux Toolkit` with `RTK Query`, which we will learn more on the next article.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
