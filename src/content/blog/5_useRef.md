---
title: "Learn how and when to use the hook useRef!"
description: "On this post we will learn how and WHEN to use useRef, its a very helpful hook to use in specific occasions that allows us to persist values through renders or access DOM properties"
category: ["react", "frontend"]
pubDate: "2023-11-04"
published: true
---

`useRef` hook is part of the React Hooks API. It is a function which takes a maximum of one argument and returns an `Object`. The returned object has a property called `current` whose value is the argument passed to `useRef`. If you invoke it without an argument, the returned object's `current` property is set to `undefined`.

## What is the difference between refs and state variables?

Both refs and state variables provide a way to persist values between renders; however, only state variables trigger a re-render.

While refs were traditionally (and still are) used to access DOM elements directly (for example, when integrating with a third-party DOM library), it has become increasingly common to use refs in functional components to **persist values between renders that should not trigger a re-render when the value is updated**.

The use cases of `useRef` hook are:

1. To access DOM elements
2. To persist values in successive renders

## Accessing DOM elements

```javascript
import React from "react";
import ReactDOM from "react-dom";

const App = (props) => {
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    console.log(inputRef.current);
    inputRef.current.focus();
  }, []);

  return (
    <form>
      <input type="text" placeholder="Enter Name" name="name" ref={inputRef} />
    </form>
  );
};
const root = document.getElementById("root");
ReactDOM.render(<App />, root);
```

## To persist values in successive renders

Let's look at a simple counter example using state and refs:

```javascript
import { useRef } from "react";

function LogButtonClicks() {
  const countRef = useRef(0);

  const handle = () => {
    countRef.current++;
    console.log(`Clicked ${countRef.current} times`);
  };

  return <button onClick={handle}>Click me</button>;
}
```

And lets compare it with a state:

```javascript
import { useState } from "react";

function LogButtonClicks() {
  const [count, setCount] = useState(0);

  const handle = () => {
    const updatedCount = count + 1;
    console.log(`Clicked ${updatedCount} times`);
    setCount(updatedCount);
  };

  return <button onClick={handle}>Click me</button>;
}
```

So, the 2 main differences between references and state:

1. Updating a reference doesn't trigger re-rendering, while updating the state makes the component re-render;
2. The reference update is synchronous (the updated reference value is available right away), while the state update is asynchronous (the state variable is updated after re-rendering).

Let's check one more example:

```javascript
const App = () => {
  const [name, setName] = React.useState("...");
  const inputRef = React.useRef(null);
  const prevNameRef = React.useRef("");

  React.useEffect(() => {
    prevNameRef.current = name;
  }, [name]);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <>
      <h1>
        My name is {name} and was {prevNameRef.current}
      </h1>
      <input ref={inputRef} value={name} onChange={handleChange} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
};
```

So when we click the button we add to the input the focus property, something we couldn't have done without Refs.

## Conclusion

The React useRef hook can be handy. It allows you to store data between renders and update this data without causing a re-renders. You can also use it to store references to DOM nodes and React components so you can work with them directly.

It's important to understand that you shouldn't use `useRef` all the time, only when you can't access the HTML properties by themselves using states or props.

Hopefully this was a helpful tutorial.

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
