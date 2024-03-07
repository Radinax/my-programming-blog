---
title: "Control your global state with useContext"
description: "Let's explore the concept of Context, both the API and the hook are one of the most misunderstood concepts, we will learn how to use it effectively! useContext is a great tool to share data between components."
category: ["react", "frontend"]
pubDate: "2023-11-06"
published: true
---

`useContext` is one of the most interesting hooks out there, you will probably read a lot of articles saying that this hook replaces `Redux` but that isn't accurate at all, let's see what this hook really is.

## What is useContext?

For sharing data between components, you can either pass it down through props or perform a lift state up technique, if you wish to share data between sibling components the popular options are to use a State Management Library like Redux or `useContext` hook.

So when should you `useContext`? One of the main reasons is to avoid prop drilling components, this is to avoid sending a prop from the Parent component to a Grandchild component which adds unnecessary code.

## Consumer and Provider from Context API

The React Context API is a way for a React app to effectively produce global variables that can be passed around. This is the alternative to "prop drilling" or moving props from grandparent to child to parent, and so on. Context is also touted as an easier, lighter approach to state management using Redux.

Lets see an example:

```javascript
import React from "react";
import ReactDOM from "react-dom";

// Create a Context
const NumberContext = React.createContext();
// It returns an object with 2 values:
// { Provider, Consumer }

function App() {
  // Use the Provider to make a value available to all
  // children and grandchildren
  return (
    <NumberContext.Provider value={42}>
      <div>
        <Display />
      </div>
    </NumberContext.Provider>
  );
}

function Display() {
  // Use the Consumer to grab the value from context
  // Notice this component didn't get any props!
  return (
    <NumberContext.Consumer>
      {(value) => <div>The answer is {value}.</div>}
    </NumberContext.Consumer>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
```

First, we create a new context, which we store in `NumberContext`. This is an object with 2 properties: `Provider` and `Consumer`. They’re a matched pair, and they’re born knowing how to communicate with each other (but not with other contexts).

Then, we render the `NumberContext.Provider` with some contents, and pass a `value` prop to it. It will make this value available to all of its descendants, and their descendants. The whole subtree will be able to use the Consumer (or useContext) to read out the value.

Finally, we read the value with the Consumer inside the `Display` component.

## useContext avoids the use of Consumer

```javascript
// import useContext (or we could write React.useContext)
import React, { useContext } from "react";

// ...

function Display() {
  const value = useContext(NumberContext);
  return <div>The answer is {value}.</div>;
}
```

It looks a lot cleaner now that we don't need to use a `Consumer`, so what happens when there are two different parent contexts?

```javascript
function HeaderBar() {
  return (
    <CurrentUser.Consumer>
      {(user) => (
        <Notifications.Consumer>
          {(notifications) => (
            <header>
              Welcome back, {user.name}! You have {notifications.length}{" "}
              notifications.
            </header>
          )}
        </Notifications.Consumer>
      )}
    </CurrentUser.Consumer>
  );
}
```

Yeah... But with `useContext` this same code can look:

```javascript
function HeaderBar() {
  const user = useContext(CurrentUser);
  const notifications = useContext(Notifications);

  return (
    <header>
      Welcome back, {user.name}! You have {notifications.length} notifications.
    </header>
  );
}
```

So much easier to read!

## How to implement useContext effectively

### Basic implementation

In general it's better to store the contexts inside their own folder like:

- src
  - components
    - User.js
  - context
    - index.js
    - userContext.js
    - bankContext.js
    - idContext.js
  - App.js

In `src/context/index/js` we can export all the contexts.

Inside one of the files we can create a context:

```javascript
// userContext.js
import * as React from "react";

export const UserContext = React.createContext({
  name: "Adrian Beria",
  age: 31,
});

export const UserProvider = UserContext.Provider;
```

In App.js we can import this context:

```javascript
// App.js
import { UserProvider } from "./context";

const App = () => {
  return (
    <UserProvider>
      <User />
    </UserProvider>
  );
};
```

Where `User` can be:

```javascript
// User.js
import { UserContext } from "../context";

const User = () => {
  const { name, age } = useContext(UserContext);
  return (
    <div>
      My name is {name} and my age is {age}
    </div>
  );
};
```

In summary:

- Use `createContext` and initialize it with an object with the initial values you want to provide.
- Wrap the Parent Component with the `Provider` you wish the children to have access to that specific data.
- Use the hook `useContext` and destructure the object to get the values you want to use on the children.

### Avoiding prop drilling with useContext

Prop drilling is when we want to pass a specific data through multiple child components which makes it quite inefficient, so for this we can use `useContext`:

```javascript
import * as React from "react";

export const DataContext = React.createContext();

const ParentComponent = () => {
  const [data, setData] = useState(["data 1", "data 2"]);

  return (
    <DataContext.Provider value={data}>
      <Child1>
        <Child2>
          <Child3 />
        </Child2>
      </Child1>
    </DataContext.Provider>
  );
};
```

Where `Child3.js` is:

```javascript
import * as React from "react";
import { DataContext } from "./ParentComponent";

const Child3 = () => {
  const datas = useContext(DataContext);

  return (
    <div>
      {datas.map((data, index) => (
        <div key={data + index}>{data}</div>
      ))}
    </div>
  );
};
```

This way we can have all the components wrapped under the `Provider` like, `Child1`, `Child2` and `Child3` to have available the same type of information, and if it's modified in some way, it will be changed for all three children components.

In summary, to avoid prop drilling with `useContext`:

- Create the context with `React.createContext`
- Wrap the children components with the `Provider`.
- On the Children component access the data through `useContext` and pass the created context of the first step to access the value.

### Creating a "global" state management with Context and useReducer

I said before that Context is not a Redux replacement, but there are times where components need to communicate with each other and its preferred not to dirty your Redux Store with unnecessary data, so we can use Context to create a system to handle a state management without using Redux.

Using a similar folder structure lets create another context:

```javascript
// bankContext.js
import * as React from "react";

const BankContext = React.createContext();

const bankReducer = (state, action) => {
  switch (action.type) {
    case "isLegal": {
      return { ...state, isLegal: !isLegal };
    }
    case "name": {
      return { ...state, name: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const initialState = {
  isLegal: false,
  name: "",
};

const BankProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(bankReducer, initialState);
  const value = { state, dispatch };
  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
};

const useBank = () => {
  const context = React.useContext(BankContext);
  if (context === undefined) {
    throw new Error("useBank must be used within a BankProvider");
  }
  return context;
};

export { BankProvider, userBank };
```

Inside the `App.js`:

```javascript
// App.js
import { BankProvider } from "./context";

const App = () => {
  return (
    <BankProvider>
      <Bank />
    </BankProvider>
  );
};
```

Where `Bank.js` is:

```javascript
// User.js
import { useBank } from "../context";

const Bank = () => {
  const { state, dispatch } = useBank();
  const { isLegal, name } = state;
  const [username, setUsername] = React.useState();

  const userName = <div>{name}</div>;

  const onClick = () => dispatch({ type: "isLegal" });
  const onChange = (e) => {
    setUsername(e.target.value);
    dispatch({ type: "name", value: username });
  };

  return (
    <div>
      {isLegal ? userName : null}
      <input type="text" onChange={onChange} value={name} />
      <div onClick={onClick}>
        {isLegal ? "Click to make illegal" : "Click to make it legal"}
      </div>
    </div>
  );
};
```

Now this is an interesting case, we're using `useReducer` in combination with `useContext` to provide a sort of State Management.

`useReducer` takes two parameters, the `reducer` and a initial state (in another post we will check it in depth). In return it gives us the state and the dispatch which we can send through the `Provider` in a property called `value` in this case.

We wrap the components we want this State Management to control and we access the children, in this case `Bank.js`, where we import the `useBank` hook that we got from the context to get the `state` and the `dispatch`.

Notice that from the `Bank.js` component we can click the div to switch the `isLegal` value from `false` to `true` and vice versa, this change is applied to every component wrapped by the `Provider`.

Another interesting thing we can do is on the `onChange` handler on the input, if we write anything there, this value is sent to the state management as well!

So, in summary, if we want to use the `useContext` and `useReducer` hooks together:

- Create the context with `React.createContext()`.
- Create the `initialState`.
- Create the `reducer`.
- Create the `Provider` , inside use the `useReducer` and get the `state` and `dispatch`.
- Create an object to be sent `const value = { state, dispatch }` through the provider and wrap the children prop around it which will be used to make this `value` available to all children's.
- Create a custom hook where you use the `useContext` and put the context of the first step inside, check if it's not undefined, if it's not, then return it. Export the custom hook and the provider to be applied anywhere.
- Wrap the `Provider` around the children components you want this state to be available to.
- In the children component you can import the custom hook and get immediately the `state` and `dispatch`, where we can either READ or change the state through the `dispatch`.

## Conclusion

`useContext` is a very interesting hook, with it you can avoid prop drilling your components and make the information available where you want.

You can combine `useContext` with `useReducer` to create a state management system for when you don't want to use Redux as well.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
