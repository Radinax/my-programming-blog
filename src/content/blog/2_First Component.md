---
title: "Our first React Component!"
description: "Taking a dive into the world of React! We're going to build our first component learning about how this library works on the inside."
category: ["react", "frontend"]
pubDate: "2023-11-01"
published: true
---

Not only do React components map cleanly to UI components, but they are self-contained. The markup, view logic, and often component-specific style is all housed in one place. This feature makes React components **\*\*reusable\*\***.

## Diving into React!

Lets get right into action, first lets make a project folder named "React Tutorial - My First Component", inside make a html file with the following information:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My First Component!</title>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      // React code will go here
    </script>
  </body>
</html>
```

These are the latest packages used at the moment of writing this post, so please double check if you need to use a more recent version.

Now lets check what are we loading:

\- [React](https://reactjs.org/docs/react-api.html): You're getting the React **\*\*Top-Level API\*\*** which is the main entry point to the library.

\- [React DOM](https://reactjs.org/docs/react-dom.html): This is where we can access the Top-Level APIs, most notably "render()".

\- [Babel](https://babeljs.io/): It's a Javascript transpiler that let us turn our ES6+ into older ES5 because some browsers don't support it yet.

In your React code put the following:

```javascript
const HelloMessage = ({ name }) => {
  return <div>Hello {name}</div>;
};

ReactDom.render(
  <HelloMessage name="Adrian" />,
  document.getElementById("root")
);
```

`HelloMessage` is the name of our first component. Notice we're using a capital letter to define our Component, and this is because if we used lowercase JSX reads it as HTML tag and not as a React Component. This is how React knows to render a Component, and not a HTML Element. We use `render` (refers to a technique for sharing code between React components using a prop whose value is a function) to return a JSX which is "React Code". JSX can be seen as HTML inside Javascript.

Now what is this weird `{name}` in curly braces? `name` is being destructured from the properties (props) of the component. We use `props` to send data to components, in this case our component is named `HelloMessage` and we're sending the property `name` with the string value of `Adrian`.

There are two ways we can define a component, functional or classes. We generally use functional components when we don't have a state and we won't use Life Cycle Hooks methods which are available to classes. With React Hooks available:

> Hooks are the new feature introduced in the React 16.8 version. It **allows you to use state and other React features without writing** a class. Hooks are the functions which "hook into" React state and lifecycle features from function components. Also, it does not replace your knowledge of React concepts.

Hooks are functions that let you “hook into” React state and lifecycle features from function components. Hooks don’t work inside classes — they let you use React without classes.

React provides a few built-in Hooks like `useState`. You can also create your own Hooks to reuse stateful behavior between different components.

We don't need to use class components anymore, especially now that we can use Hooks

## Conclusion

We learned the basics of what's going on in a React code, what means extending a parent component to its child, then rendering the component with the `ReactDOM` "render method" to render our component into the "root" id we created in our HTML file.

This is barely the start, we will go much more in depth in the next post with `state`.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
