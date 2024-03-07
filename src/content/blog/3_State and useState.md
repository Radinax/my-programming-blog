---
title: "React State and the useState Hook"
description: "Lets learn more about React State and its popular useState Hook! We will learn to control the internal behavior of a component."
category: ["react", "frontend"]
pubDate: "2023-11-02"
published: true
---

Its how React handles dynamic data in the DOM, any click event, form submission, must pass using states.

Whereas props are immutable and owned by a component’s parent, state is owned by the component. **state is private to the component** and as we’ll see can be updated with `useState` Hook.

When the state or props of a component update, the component will re-render itself.

## Lets work with a component with State!

We will make a simple counter, we press a "+" button in the UI to raise its value. We first need to plan how our state will look like.

```javascript
const Counter = () => {
  const [count, setCount] = useState(0);

  const increase = () => setCount(count + 1);
  const decrease = () => setCount(count - 1);

  return (
    <div>
      <div>{count}</div>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
    </div>
  );
};

ReactDOM.render(<Counter />, document.getElementById("root"));
```

We're seeing new stuff here.

- **increase** and **decrease**: We defined it as an Arrow Function to bind `this`. The arrow function introduced in ES6 is a function with the current `this` context already bound to the function. So when we invoke this function we create a new state adding a +1 to the value it had before.

- **useState**: Is a Hook that allows you to have state variables in functional components. You pass the initial state to this function and it returns a variable with the current state value (not necessarily the initial state) and another function to update this value.

- **React Hooks**: Hooks are functions that let you “hook into” React state and lifecycle features from function components. Hooks don’t work inside classes — they let you use React without classes.

## Conclusion

We learned more about **State**, as you can see it's very simple to use and it makes controlling your Data more organized, you know what's happening and when.

For the next post we will learn more about the other popular React Hook called `useEffect` which let us perform side effects in function components.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
