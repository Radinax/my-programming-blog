---
title: "Learn to use the hook useReducer effectively!"
description: "useReducer is a React Hook that allows us to handle state through a pattern similar to Redux. Lets learn how to use it!"
category: ["react", "frontend"]
pubDate: "2023-11-08"
published: true
---

> useReducer is a React Hook introduced late in October 2018, which allows us to handle complex state logic and action. It was inspired by Redux state management pattern and hence behaves in a somewhat similar way.

You might be thinking, why do I need to handle complex state with `useReducer` when we can just handle it with `useState`? We will see with examples why it's so important to know when to `useReducer` because it can help you to deal with complex state logic that can easily happen to you.

## Difference between useReducer and useState

Both of these hooks are the two common options at handling local state of components in React, let's us check how they work:

```javascript
// useState
const [state, setState] = useState(initialValue);
// useReducer
const [state, dispatch] = useReducer(reducer, initialValue);
```

Both cases returns the `state`, on the case of `useState` it also returns the `setState` we can use to modify that specific state.

In the case of `useReducer` it returns `dispatch` which we can also use to manage the state, but in a different way, let's check this other example:

```javascript
const Button = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <span>{count}</span>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
};
```

With `useReducer` though, we have this:

```javascript
// Its where you manage your initial state
const countReducer = (state, action) => {
  switch (action.type) {
    case "increment": {
      return { ...state, count: state.count + action.payload };
    }
    case "decrement": {
      return { ...state, count: state.count - action.payload };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

// The initial state of your component
const initialState = {
  count: 0,
};

const Button = () => {
  const [state, dispatch] = useReducer(countReducer, initialState);
  const { count } = state;

  const increment = () => dispatch({ type: "increment", payload: 1 });
  const decrement = () => dispatch({ type: "decrement", payload: 1 });

  return (
    <div>
      <button onClick={increment}>+</button>
      <span>{count}</span>
      <button onClick={decrement}>-</button>
    </div>
  );
};
```

In this example, the reducer accepts two kinds of action types: "increment" and "decrement". Both "increment" and "decrement" require an action payload that will determine the amount by which the counter is increased or decreased.

A `reducer` is a function that takes two arguments. The first is the current `state`, and the second is the `action`, which is an object that takes two properties, `type` and an optional `payload`.

A `dispatch` is a function that takes an `action` as parameter. This action gets read on the reducer by using the `type` property and then it performs an action on the state, in this case `count` which is being read on the component.

## Most common use of useReducer

Forms! Usually in forms you can have more than ten states to modify, but using `useReducer` we can optimize this:

```javascript
import { useReducer } from "react";

const initialState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "text":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const Form = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { firstName, lastName, username, email } = state;

  const onChange = (e) => {
    dispatch({
      type: "text",
      payload: { key: e.target.name, value: e.target.value },
    });
  };

  return (
    <div>
      <input
        value={firstName}
        type="text"
        name="firstName"
        onChange={inputAction}
      />
      <input
        value={lastName}
        type="text"
        name="lastName"
        onChange={inputAction}
      />
      <input
        value={username}
        type="text"
        onChange={inputAction}
        name="username"
      />
      <input value={email} type="email" name="email" onChange={inputAction} />
    </div>
  );
};

export default Form;
```

Now instead of having for different states inside our local component, we can handle everything in one place!

## Conclusion

We learned about an important hook to have in your arsenal like `useReducer`. It helps when we have a complex state logic and we need to have different event handlers for different cases, its often better to put them inside a reducer and handle them from there, keeping your code cleaner.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
