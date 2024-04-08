---
title: "Data Fetching in 2023"
description: "In Frontend fetching data from an API provided by a public one or from a server, is one of the most common things to do, let's check the methods we're using in 2023!"
category: ["react", "frontend"]
pubDate: "2023-11-23"
published: true
---

We will focus more on React for this article, using the tools and libraries used in 2023 to perform this task.

## Fetching data from a public API

> An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build or use such a connection or interface is called an API specification

Javascript has the `fetch()` method that allows us to make HTTP request to a private or public API.

Let's us check the following example:

```react
import { useState, useEffect } from "react";

const App = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts`)
            .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            }
            return response.json();
       		})
            .then((data) => {
        		setData(data)
            	setErrorMessage(null)
	        })
            .catch((err) => {
     			setErrorMessage(err.message)
            	setData(null)
	        })
        	.finally(() => setIsLoading(false))
    }, []);

    const loading = isLoading && <div>A moment please...</div>
    const error = errorMessage && <div>{`There was an error - ${errorMessage}`}</div>
    const listItems = data && data.map(({ id, title }) => (
        <li key={id}><h3>{title}</h3></li>
    ))

    return (
        <div className="App">
            <h1>API Posts</h1>
            {loading}
            {error}
            <ul>{listItems}</ul>
        </div>
    );
}
```

In the `useEffect` block we're doing a traditional promise handling using `.then` which has to be followed by a `catch` to get the errors followed by the `finally` block to set `isLoading` to false.

## Async/Await

> In computer programming, the async/await pattern is a syntactic feature of many programming languages that allows an asynchronous, non-blocking function to be structured in a way similar to an ordinary synchronous function.

For 99.999% of use-cases `async/await` is just syntax sugar for the `Promise` API so that code can be written in a more synchronous fashion.

However, since Node 12/Chrome 68 `async/await` is the [recommended method for handling asynchronous operations](https://v8.dev/blog/fast-async#conclusion) by the team that creates the V8 engine.

Some optimizations were made that made it slightly consistently faster than the "thenable" `Promise` API, it's stack traces are handled in a more developer-friendly fashion, they're easier to read and understand, and they're kind of the future of asynchronous code in the V8 API. All of the native support and features moving forward will be based around `async/await`, such as stuff here today that will be expanded on like [async iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of).

Another note to add is that if you're using Node 14/Chrome 85 or below, unhandled rejected promises can cause [memory leaks unless you intervene](https://github.com/mcollina/make-promises-safe/blob/master/README.md#the-unhandledrejection-problem). This is not an issue when using `async/await`.

Javascript is functionally scoped, with each function creating it's own little world. In OOP this may not be as much of a concern as you'll likely be querying on `this`... but even then within your method using the Promise; you now have all these little enclaves of scope which you have to be inherently aware of.

No more. `async`/`await` allows you to write all of your functionality within the same functional plain, no need to worry about overwriting something somewhere but not elsewhere, or passing in handlers that don't have access to variables. You can handle everything where it stands not where it's going to be.

Let's check how to use it:

```javascript
useEffect(() => {
  const getData = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=10`
      );
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      let actualData = await response.json();
      setData(actualData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };
  getData();
}, []);
```

This time we can control what happens inside our `try` block and handle errors inside our `catch` block

With a try catch, **you can handle an exception that may** include logging, retrying failing code, or gracefully terminating the application. Without a try catch, you run the risk of encountering unhandled exceptions.

## Axios Library

I will make an in depth `axios` post, but for now let's see how we can use it to do a `GET` request.

`npm i axios`

Using it is as simple as:

```javascript
useEffect(() => {
  const getData = async () => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_limit=10`
      );
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };
  getData();
}, []);
```

Notice we don't have to convert it to `JSON`.

## GraphQL API endpoint

I will be making an extensive series about GraphQL, but for now let's check how perform a `GET` request here. `GraphQL` is unique in the sense that we ask for the EXACT data we need in a particular component.

We need to do a bit of setup here, let's install the libraries:

`npm install @apollo/client graphql`

Inside our `src/index.js` file in a `CRA` we wrap the application inside `ApolloProvider` where we add the `URL` and we cache the data:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

import App from "./App";

const client = new ApolloClient({
  uri: "https://api.spacex.land/graphql/",
  cache: new InMemoryCache(),
});

const rootElement = document.getElementById("root");

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  rootElement
);
```

Inside our component:

```javascript
import React from "react";
import { useQuery, gql } from "@apollo/client";

const FILMS_QUERY = gql`
  {
    launchesPast(limit: 10) {
      id
      mission_name
    }
  }
`;

export default function App() {
  const { data, loading, error } = useQuery(FILMS_QUERY);

  if (loading) return "Loading...";
  if (error) return <pre>{error.message}</pre>;

  return (
    <div>
      <h1>SpaceX Launches</h1>
      <ul>
        {data.launchesPast.map((launch) => (
          <li key={launch.id}>{launch.mission_name}</li>
        ))}
      </ul>
    </div>
  );
}
```

`useQuery` is very similar to `react-query` so you might be familiar with this.

In the public API `https://api.spacex.land/graphql/` we're adding a query to request the data inside `launchesPast` with a limit of 10 objects with properties of `id` and `mission_name`.

## Simple fetch with react-fetch-hook

We can install it `npm i react-fetch-hook` and import it `import useFetch from "react-fetch-hook";` and to use:

```javascript
export default function App() {
  const { isLoading, data, error } = useFetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10"
  );
  return (
    // ...
  );
}
```

Very similar to `react-query`!

## React Query

Now let's check the most popular library for fetching data which can help also by caching and refetching.

`npm i react-query`

Now we wrap our `src/index.js` from a `CRA` on a `QueryClientProvider`

```javascript
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
  // ...
);
```

And to use is as simple as:

```javascript
import axios from "axios";
import { useQuery } from "react-query";

const fetchPosts = async () => {
    const res = await fetch('https://api.github.com/repos/tannerlinsley/react-query')
    return res.json()
}

export default function App() {
  const { isLoading, error, data } = useQuery("posts", fetchPosts);
  console.log(data)
  return (
    // ...
  );
}
```

There is a final one called `rtk-query` that comes with `Redux Toolkit` where I already make an extensive post about, you can check it [here](https://react-graphql-nextjs-blog.vercel.app/post/rtk-query)

## Conclusion

We got to learn how to fetch data in Frontend in React in 2021! These tools go beyond only doing a simple fetch, it helps us by caching data and doing refetchs.

Other libraries like `axios` helps us a lot with their incredible useful `interceptors` where we can cancel requests and add tokens to our HTTP requests which we will be seeing in the future.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
