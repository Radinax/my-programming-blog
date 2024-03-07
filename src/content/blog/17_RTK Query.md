---
title: "RTK Query"
description: "RTK Query is an advanced API interaction tool inspired by similar tools like React Query. But unlike React Query, RTK Query offers full integration with framework-agnostic Redux."
category: ["react", "frontend", "tanstack"]
pubDate: "2023-11-17"
published: true
---

> **RTK Query** is a powerful data fetching and caching tool. It is designed to simplify common cases for loading data in a web application, **eliminating the need to hand-write data fetching & caching logic yourself**.

## When to use

When you're using Redux Toolkit and doing data fetching, then you should use this tool which is already coming inside the redux toolkit library ds

## Why use them?

Web applications normally need to fetch data from a server in order to display it. They also usually need to make updates to that data, send those updates to the server, and keep the cached data on the client in sync with the data on the server. This is made more complicated by the need to implement other behaviors used in today's applications:

- Tracking loading state in order to show UI spinners
- Avoiding duplicate requests for the same data
- Optimistic updates to make the UI feel faster
- Managing cache lifetimes as the user interacts with the UI

The Redux core has always been very minimal - it's up to developers to write all the actual logic. That means that Redux has never included anything built in to help solve these use cases. The Redux docs have taught [some common patterns for dispatching actions around the request lifecycle to track loading state and request results](https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#async-request-status), and [Redux Toolkit's `createAsyncThunk` API](https://redux-toolkit.js.org/api/createAsyncThunk) was designed to abstract that typical pattern. However, users still have to write significant amounts of reducer logic to manage the loading state and the cached data.

Over the last couple years, the React community has come to realize that **"data fetching and caching" is really a different set of concerns than "state management"**. While you can use a state management library like Redux to cache data, the use cases are different enough that it's worth using tools that are purpose-built for the data fetching use case.

RTK Query takes inspiration from other tools that have pioneered solutions for data fetching, like `Apollo Client`, `React Query`, `Urql`, and `SWR`, but adds a unique approach to its API design:

- The data fetching and caching logic is built on top of Redux Toolkit's `createSlice` and `createAsyncThunk` APIs
- Because Redux Toolkit is UI-agnostic, RTK Query's functionality can be used with any UI layer
- API endpoints are defined ahead of time, including how to generate query parameters from arguments and transform responses for caching
- RTK Query can also generate React hooks that encapsulate the entire data fetching process, provide `data` and `isLoading` fields to components, and manage the lifetime of cached data as components mount and unmount
- RTK Query provides "cache entry lifecycle" options that enable use cases like streaming cache updates via websocket messages after fetching the initial data
- We have early working examples of code generation of API slices from OpenAPI and GraphQL schemas
- Finally, RTK Query is completely written in TypeScript, and is designed to provide an excellent TS usage experience

## Configuration

RTK Query is included within the installation of the core Redux Toolkit package. It is available via either of the two entry points below:

```javascript
import { createApi } from "@reduxjs/toolkit/query";

/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
import { createApi } from "@reduxjs/toolkit/query/react";
```

RTK Query includes these APIs:

- [`createApi()`](https://redux-toolkit.js.org/rtk-query/api/createApi): The core of RTK Query's functionality. It allows you to define a set of endpoints describe how to retrieve data from a series of endpoints, including configuration of how to fetch and transform that data. In most cases, you should use this once per app, with "one API slice per base URL" as a rule of thumb.
- [`fetchBaseQuery()`](https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery): A small wrapper around [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) that aims to simplify requests. Intended as the recommended `baseQuery` to be used in `createApi` for the majority of users.
- [`<ApiProvider />`](https://redux-toolkit.js.org/rtk-query/api/ApiProvider): Can be used as a `Provider` if you **do not already have a Redux store**.
- [`setupListeners()`](https://redux-toolkit.js.org/rtk-query/api/setupListeners): A utility used to enable `refetchOnMount` and `refetchOnReconnect` behaviors.'

## How to use

### Create the API request

Let's assume we're inside our API requests folder, we would add a file inside with the following request:

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Pokemon } from './types'

// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery } = pokemonApi
```

`reducerPath`: Remember that when you create a slice, you also add a name to it.

`baseQuery`: As the name suggest, it's the base URL you make the request to.

`endPoints`: We can add `params` to our URL when doing a specific request.

### Configure the store

The "API slice" also contains an auto-generated Redux slice reducer and a custom middleware that manages subscription lifetimes. Both of those need to be added to the Redux store:

```javascript
import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { pokemonApi } from "./services/pokemon";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
```

### Using the hook

Finally, import the auto-generated React hooks from the API slice into your component file, and call the hooks in your component with any needed parameters. RTK Query will automatically fetch data on mount, re-fetch when parameters change, provide `{data, isFetching}` values in the result, and re-render the component as those values change:

```javascript
import * as React from "react";
import { useGetPokemonByNameQuery } from "./services/pokemon";

export default function App() {
  // Using a query hook automatically fetches data and returns query values
  const { data, error, isLoading } = useGetPokemonByNameQuery("bulbasaur");
  // Individual hooks are also accessible under the generated endpoints:
  // const { data, error, isLoading } = pokemonApi.endpoints.getPokemonByName.useQuery('bulbasaur')

  // render UI based on data and loading state
}
```

## HTTP requests API

As we have seen previously, it's very easy to perform HTTP requests without using `rtk-query`, let's check an isolated example.

First let's define the state and the slice:

```javascript
const initialState = {
  news: [],
  isLoadingNews: false,
  loading: false,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    // GET
    getNews: (state) => {
      state.isLoadingNews = true;
    },
    getNewsSuccess: (state, { payload }) => {
      state.news = payload;
      state.isLoadingNews = false;
    },
    getNewsFailed: (state) => {
      state.isLoadingNews = false;
    },
    // POST
    postNews: (state) => {
      state.isLoadingNews = true;
    },
    postNewsSuccess: (state, { payload }) => {
      state.news = payload;
      state.isLoadingNews = false;
    },
    postNewsFailed: (state) => {
      state.isLoadingNews = false;
    },
  },
});

export const newsReducer = newsSlice.reducer;

export const {
  // GET
  getNews,
  getNewsSuccess,
  getNewsFailed,
  // POST
  postNews,
  postNewsSuccess,
  postNewsFailed,
} = newsSlice.actions;

export const newsSelector = (state) => state.newsReducer.news;
export const loadingNewsSelector = (state) => state.newsReducer.isLoadingNews;
```

In our Redux Store:

```javascript
const rootReducer = combineReducers({
  newsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});
```

Now let's us check how we defined a GET and POST request:

```javascript
export const getNewsService = () => (dispatch) => {
  dispatch(getNews());
  api
    .get("/api/news/")
    .then((res) => {
      if (res.data !== undefined && res.data.data)
        dispatch(getNewsSuccess(res.data.data));
      else throw new Error();
    })
    .catch((err) => {
      console.log(err);
      dispatch(getNewsFailed());
    });
};

export const postNewsService = (post) => (dispatch) => {
  dispatch(postNews());
  api
    .post("/api/news/", post)
    .then((res) => {
      if (res.data) {
        dispatch(postNewsSuccesss());
      }
    })
    .catch((err) => {
      console.log(err);
      dispatch(postNewsFailed());
    });
};
```

Applying this is as simple as:

```javascript
const loadingNews = useSelector(loadingNewsSelector);
const news = useSelector(newsSelector);

if (loadingNews) return <div>Loading...</div>

return (
  <div>
  	{news.map(new => <span key={new.name}>{new.name}</span>)}
  </div>
)
```

Refactoring using `rtk-query`:

```javascript
// Define a service using a base URL and expected endpoints
export const baseNewsApi = createApi({
  reducerPath: 'news',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/news' }),
  endpoints: (builder) => ({}),
  }),
})

// Use base URL  and endpoints  Defining services
const postsApi = baseNewsApi.injectEndpoints({
  endpoints: (builder) => ({
    //  Query list
    getNews: builder.query({
      query: () => '',
      transformResponse: (response) => response.data,
    }),
    //  Create a news
    postNews: builder.mutation({
      query: (data) => ({
        url: '/posts',
        method: 'post',
        body: data,
      }),
    }),
  }),
});

export const {
    useGetNewsQuery,
    usePostNewsQuery,
} = postsApi;
```

In our store:

```javascript
const rootReducer = combineReducers({
  [postsApi.reducerPath]: postsApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});
```

Applying this now:

```javascript
const loadingNews = useSelector(loadingNewsSelector);
const news = useSelector(newsSelector);

const { news, isLoading } = useGetNewsQuery();

if (isLoading) return <div>Loading...</div>

return (
  <div>
  	{news.map(new => <span key={new.name}>{new.name}</span>)}
  </div>
)
```

As you can see, using `createApi` can significantly reduce the complexity and size of our code, making everything easier and now we have cache data!

## Conclusion

We got to learn a very powerful tool in `rtk-query`! It's amazing how `@redux/toolkit` has evolved, in 2020 we had `createSlice` which reduced the boiler plate a lot, and now in 2021 we have `createApi` which helps reduce the `createSlice` results when dealing with HTTP requests.

This doesn't mean `createSlice` won't be used, `createApi` as the name suggest, is a way to make requests to the backend.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
