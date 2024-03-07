---
title: "Redux Thunk"
description: "Redux Thunk middleware allows you to write action creators that return a function instead of an action. This is outdated, wrote it to show how it's used to do"
category: ["react", "frontend", "redux"]
pubDate: "2023-11-09"
published: true
---

Redux Thunk middleware allows you to write action creators that return a function instead of an action. The Thunk can be used to delay the dispatch of an action, or to dispatch only if a certain condition is met. The inner function receives the store methods dispatch and `getState` as parameters.

## What is a middleware?

> Middleware is computer software that connects software components or applications. The software consists of a set of services that allows multiple processes running on one or more machines to interact.

The `redux-thunk` middleware sits in between the dispatch and reducers, which means we can alter our dispatched actions before they get to the reducers or execute some code during the dispatch.

## When to use?

When we need to do any kind of asynchronous logic, we generally pair it with `axios`, which is a library for making HTTP requests. One of my favorite reasons to use `axios` over ES6 fetch is that with `axios` you don’t have to do convert the data you obtained from your request using `.json()`, `axios` does this automatically, for example:

```javascript
fetch(url)
  .then((response) => response.json())
  .then((data) => console.log(data));

axios.get(url).then((response) => console.log(response));
```

## Installing dependencies

For an already created project:

```javascript
yarn add redux react-redux
```

If you’re doing some async

```javascript
yarn add axios redux-thunk
```

## Project Structure

```
src/
├── context
├── actions
├── api
├── components
├── pages
├── reducers
├── store
├── types
├── App.js
└── index.js
```

Each folder will have an `index.js` file inside.

## Types

Inside the types folder we add our constants.

```javascript
// Types as constants
export const FETCH_GAMES_REQUESTED = "FETCH_GAMES_REQUESTED";
export const FETCH_GAMES_SUCCESS = "FETCH_GAMES_SUCCESS";
export const FETCH_GAMES_ERROR = "FETCH_GAMES_ERROR";
```

## Actions

Inside the actions folder we add our actions creator, importing the constants we made.

```javascript
// Action Creators
import {
  FETCH_GAMES_REQUESTED,
  FETCH_GAMES_SUCCESS,
  FETCH_GAMES_ERROR,
} from "../types";

export const fetchGames = () => ({ type: FETCH_GAMES_REQUESTED });
export const fetchGamesSuccess = (payload) => ({
  type: FETCH_GAMES_SUCCESS,
  payload,
});
export const fetchGamesError = (error) => ({ type: FETCH_GAMES_ERROR, error });
```

Remember, an action creator is **merely a function that returns an action object**.

## API

This is where we will use `axios`, we will do all our requests on these folders and it will look like this:

```javascript
// API
export const fetchGame = () => axios.get("http://localhost:3000/games");
export const addGame = (payload) =>
  axios.post("http://localhost:3000/games", { ...payload });
export const editGame = (payload) =>
  axios.delete(`http://localhost:3000/games/${payload.id}`, { ...payload });
export const deleteGame = (payload) =>
  axios.delete(`http://localhost:3000/games/${payload.id}`);
```

## Reducer

This is where our reducer will be, anytime we dispatch an action in our app, the reducer receives the command to change the global state.

```javascript
import {
	FETCH_GAMES_LOADING,
   	FETCH_GAMES_SUCCESS,
    FETCH_GAMES_ERROR,
} from '../types'

// Initial State
const initialState = {
    data: [],
    loading: false,
    error: ""
}

// Reducer
const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_GAMES_LOADING:
            return {
                ...state,
                loading: true
            }
         case FETCH_GAMES_SUCCESS:
            return {
                ...state,
                data: action.data,
                loading: false
            }
         case FETCH_GAMES_LOADING:
            return {
                ...state,
                error: action.error
                loading: false
            }
    }
}
```

Notice how it only does something when we do only a fetch request, it’s because our POST, DELETE and PUT will only do a HTTP request and won’t mess with the global state, but when we do a GET the app will reload.

## Store

This is where our store will be configured/

```javascript
import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

export function configureStore(initialState) {
    const middleware = [thunk]
    const composeEnhancers = window.__REDUX_DEVTOOLS, EXTENSION_COMPOSE__ || compose
    const store = createStore(rootReducer, initialState, composeEnchancers(
    	applyMiddleware(...middleware)
    ))
    return store
}
```

The store takes as argument the `rootReducer`, the initial state and with `composeEnhancers` we can add several middleware's like Redux Thunk.

## Connect store to provider

We configure our store importing the setup from store folder.

```javascript
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "./store";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
```

This way we can "provide" the store for the whole application.

## Ducks pattern

Another way of making this process even easier, is to put everything on a single file, but of course I don’t mean EVERYTHING, but if in your app you’re working with getting a set of posts or comments in a blog, then you can do two ducks files. In the case of this tutorial we were only doing it for a set of games, which we will see in detail in another post, but for now lets see how a ducks pattern would look here:

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

As you can see this pattern makes everything more smooth and it’s recomended in the Redux documentation.

## Summary

- Create folders with the following name: types, actions, reducer, store, api.
- Inside types we add our constants.
- Import types inside our actions folders and export the action creators.
- If you’re doing an asynchronous request, then inside api add your requests.
- Configure your store.
- Connect it to Provider

## Conclusion

We learned how to setup a Redux structure in our React app, it’s very straightforward when you start doing it, but there are even easier ways of doing this kind of setup, with a ducks pattern (everything on a single file) as we just saw and using the new Redux Toolkit which we will see later.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
