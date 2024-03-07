---
title: "Redux Toolkit"
description: "redux-toolkit is a SOPE (Simple, Opinionated, Powerful, Effective) library. It allows us to write more efficient code, speed up the development process, and automatically apply the best-recommended practices."
category: ["react", "frontend", "redux"]
pubDate: "2023-11-12"
published: true
---

> **Simple**: Includes utilities to simplify common use cases like **store setup, creating reducers, immutable update logic**, and more.
>
> **Opinionated**: Provides **good defaults for store setup out of the box**, and includes **the most commonly used Redux addons built-in**.
>
> **Powerful**: Takes inspiration from libraries like `Immer` and `Autodux` to let you **write "mutative" immutable update logic**, and even **create entire "slices" of state automatically**.
>
> **Effective**: Lets you focus on the core logic your app needs, so you can **do more work with less code**.

The Redux Toolkit package is intended to be the standard way to write Redux logic. It was originally created to help address three common concerns about Redux:

- “Configuring a Redux store is too complicated”
- “I have to add a lot of packages to get Redux to do anything useful”
- “Redux requires too much boilerplate code”

## Features

Redux Toolkit includes:

- A `configureStore()` function with simplified configuration options. It can automatically combine your slice reducers, adds whatever Redux middleware you supply, includes `redux-thunk` **by default**, and enables use of the `Redux DevTools` Extension.
- A `createReducer()` utility that lets you supply a lookup table of action types to case reducer functions, rather than writing switch statements. In addition, it automatically uses the [immer](https://github.com/mweststrate/immer) library to let you write simpler immutable updates with normal mutative code, like `state.todos[3].completed = true`.
- A `createAction()` utility that returns an action creator function for the given action type string. The function itself has `toString()` defined, so that it can be used in place of the type constant.
- A `createSlice()` function that accepts a set of reducer functions, a slice name, and an initial state value, and automatically generates a slice reducer with corresponding action creators and action types.
- The `createSelector` utility from the [Reselect](https://github.com/reduxjs/reselect) library, re-exported for ease of use.
- `createAsyncThunk` function that accepts an action type string and a function that returns a promise, and generates a `thunk` that dispatches `pending/fulfilled/rejected` action types based on that promise.
- `createEntityAdapter` generates a set of reusable reducers and selectors to manage normalized data in the store.
- `RTK Query` which is a powerful data fetching and caching tool built specifically for Redux. It is designed to simplify common cases for loading data in a web application, eliminating the need to hand-write data fetching & caching logic yourself.

## When to use

This is the default way of using Redux for almost every case, it’s easier and the new utilities makes everything straight forward.

For medium to big projects its preferred to use `redux-toolkit`, while for small projects its better to use the react hooks `useReducer` and `useContext`.

## Installing dependencies

For an already created project:

```text
yarn add @redux/toolkit
```

This also comes pre installed with a template for create-react-app

```text
npx create-react-app my-app --template redux
cd my-app
npm start
```

## Folder structure

We’re gonna do a ducks pattern here as it’s the recommended way of doing Redux

```text
src/
├── api/
├── components/
├── ducks/
│   └── contacts/
│       └── index.js
├── pages/
├── store.js
├── App.js
└── index.js
```

## Difference between the original redux and the toolkit way

It’s easier to see for ourselves the difference in code, lets check the original way:

```javascript
import axios from "axios";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";

// Types as constants
export const FETCH_GAMES_REQUESTED = "FETCH_GAMES_REQUESTED";
export const FETCH_GAMES_SUCCESS = "FETCH_GAMES_SUCCESS";
export const FETCH_GAMES_ERROR = "FETCH_GAMES_ERROR";

// Actions
export const fetchGames = () => ({ type: FETCH_GAMES_REQUESTED });
export const fetchGamesSuccess = (payload) => ({
  type: FETCH_GAMES_SUCCESS,
  payload,
});
export const fetchGamesError = (error) => ({ type: FETCH_GAMES_ERROR, error });

// API
const URL = "http://localhost:3000/games";
export const addGame = (payload) => () => axios.post(URL, { ...payload });
export const deleteGame = (payload) => () =>
  axios.delete(`${URL}/${payload.id}`);
export const editGame = (payload) => () =>
  axios.put(`${URL}/${payload.id}`, { ...payload });
export const fetchGames = () => (dispatch) => {
  dispatch({ type: FETCH_GAMES_LOADING });
  axios.get(URL).then(
    (data) => dispatch({ type: FETCH_GAMES_SUCCESS, data }),
    (error) =>
      dispatch({ type: FETCH_GAMES_ERROR, error: error.message || "ERROR" })
  );
};

// Intial State
const initialState = {
  data: [],
  loading: false,
  error: "",
};

// Root Reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GAMES_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case FETCH_GAMES_SUCCESS: {
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    }
    case FETCH_GAMES_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    default: {
      return state;
    }
  }
};

export const configureStore = (initialState) => {
  const middleware = [thunk];
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );
  return store;
};
```

The store is just here to show the difference. But as you can see it’s the typical API, types, action creators, reducers and store.

Now lets check the new way with Redux Toolkit and explain what’s going on:

```javascript
import axios from "axios";
import {
  createSlice,
  getDefaultMiddleware,
  configureStore,
} from "@reduxjs/toolkit";

// API
const URL = "http://localhost:3000/games";
export const addGame = (payload) => () => axios.post(URL, { ...payload });
export const deleteGame = (payload) => () =>
  axios.delete(`${URL}/${payload.id}`);
export const editGame = (payload) => () =>
  axios.put(`${URL}/${payload.id}`, { ...payload });
export const fetchGames = () => async (dispatch) => {
  dispatch({ type: FETCH_GAMES_LOADING });
  try {
    const response = await axios.get(URL);
    dispatch(fetchingGamesSucess(response));
  } catch (error) {
    dispatch(fetchingGamesError(error), error.message || "ERROR");
  }
};

// Intial State
const initialState = {
  data: [],
  loading: false,
  error: "",
};

// Slice
const slice = createSlice({
  name: "rootReducer",
  initialState,
  reducers: {
    fetchingGames: (state) => {
      state.loading = true;
    },
    fetchingGamesSuccess: (state, { payload }) => {
      state.data = payload.data;
      state.loading = false;
      state.error = false;
    },
    fetchingGamesError: (state, { payload }) => {
      state.loading = false;
      state.error = payload.error;
    },
  },
});

// Destructuring the actions we're gonna use in the app
export const { fetchingGames, fetchingGamesSuccess, fetchingGamesError } =
  slice.actions;

// Configuring our store which will be used in the Provider to enable the global state
export const store = configureStore({
  reducer: slice.reducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});
```

Wait… where did the types, action creators and reducers go to?! They’re all part of the slice!

The new `createSlice` takes as arguments the following:

```javascript
createSlice({
  name: "nameOfTheSlice",
  state,
  reducers: {
    actionName: (state) => {
      // Do Something with the state
    },
    anotherActionName: (state) => {
      // With immer you can mutate the original state!
    },
  },
});
```

So the magic happens inside the reducers key, what I call `actionName` is the name you would give the action in this context, so if it was:

```javascript
const initialState = {
  data: [],
  loading: false,
  error: "",
};
// Action
fetchingGames = () => ({ type: "FETCH_GAMES_REQUESTED" });
// Reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GAMES_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};
```

You can do now:

```javascript
const slice = createSlice({
  name: "rootReducer",
  initialState,
  reducers: {
    fetchingGames: (state) => (state.loading = true),
  },
});
```

But… don’t we need the export the actions to our components to trigger the reducer? We can get the actions from the slice!

```javascript
// Destructuring the actions we're gonna use in the app
export const { fetchingGames } = slice.actions;
```

If you ever need the types, for example, to use on Redux Saga, you can get it from the slice as well! The name is the name of the reducer and the name of the action, so in this case ‘rootReducer/fetchingGames’

If you need to trigger any action you need to destructure the slice and import them in the component that’s gonna use them, which will get trigger the reducer to change the global state.

## Conclusion

Thanks to [@acemarke](https://twitter.com/acemarke) for creating an easier way of using Redux, this is the default way of setting up our projects with Redux from now on, less code, more organized and easier to understand for new people, I personally took nearly four months before I understood Redux.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
