---
title: "Introduction to React"
description: "This post is to explain what is React"
category: ["react", "frontend"]
pubDate: "2023-10-30"
published: true
---

## Table of contents

## What is React?

React is a library for building composable user interfaces. It encourages the creation of reusable UI components which present data that changes over time.

React also streamlines how data is stored and handled, using **state** and **props**.

In React data flows from Parent to Child through **props**, but **not from Child to Parent**.

It is not a complete application framework like Angular, it is just a view layer. So it is not directly comparable to frameworks like Angular or Vue.

> **Library** is a collection of precompiled routines that a **program** can use. The routines, sometimes called modules, are stored in object format. **Libraries** are particularly useful for storing frequently used routines because you do not need to explicitly link them to every **program** that uses them.

> **Framework** is an abstraction in **which** software providing generic functionality can be selectively changed by additional user-written code, thus providing application-specific software. ... In other words, users can extend the **framework**, but should not modify its code.

## What makes it different?

It introduces a concept of virtual DOM, which is a programming concept where an ideal, or **virtual**, representation of a UI is kept in memory and synced with the **real** DOM by a library such as ReactDOM - it is very fast to generate, and it can be generated for every data change.

React takes care of rendering virtual DOM into actual DOM.

And it is quite efficient, in this - before applying changes it computes a difference between new and previous virtual DOM and applies only minimal required set of changes.

By using **virtual DOM, React** provides following benefits:

- no coupling with DOM implementation
- completely declarative
- typically faster

Because React components are declarative, not imperative...

> **Declarative programming** is a programming paradigm … that expresses the logic of a computation without describing its control flow.

> **Imperative programming** is a programming paradigm that uses statements that change a program’s state.

...they are much simple to write, and to reason about. This immediately results in:

- fewer bugs
- faster development
- less debugging
- and more maintainable code in general

## What are the major features of React?

The major features of React are:

- It uses VirtualDOM instead of RealDOM considering that RealDOM manipulations are expensive.
- Supports server-side rendering.
- Follows Unidirectional data flow or data binding.
- Uses reusable/composable UI components to develop the view.

## What are the advantages of React?

Below are the list of main advantages of React,

- Increases the application's performance with Virtual DOM.
- JSX makes code easy to read and write.
- It renders both on client and server side (SSR).
- Easy to integrate with frameworks (Angular, Backbone) since it is only a view library.
- Easy to write unit and integration tests with tools such as Jest.

## What are the limitations of React?

Apart from the advantages, there are few limitations of React too,

- React is just a view library, not a full framework.
- There is a learning curve for beginners who are new to web development.
- Integrating React into a traditional MVC framework requires some additional configuration.
- The code complexity increases with inline templating and JSX.
- Too many smaller components leading to over engineering or boilerplate.

## Why should you learn React?

React, as stated already, is not a framework on its own. It is a library… a Javascript library, and enables the flexibility to tie with other frameworks and create high performance applications. As is mentioned in React’s official website, it is the V of the MVC (Model View Controller). It mainly provides specific solutions to problems in an application, rather than a whole structure to build applications. The focus is on solving problems while simultaneously providing high level of flexibility and capability of extension to larger levels. Nevertheless, the possibilities with React are numerous and therefore up-to-date applications can rely on React for their development.

React is most suitable for single developer or lean team applications. React requires many informed decisions to be made at several points during development and therefore the learning can be more rewarding in the long run. It forces a more thorough understanding of architectural and design patterns, which is good for the holistic growth of a developer, and also allows to create high performance applications, since it is the core concept of React.

React is ideal for Web Applications and manage the data in a controlled way thanks to the Life Cycle Hooks the Library gives us, you can control the Data before the Web App is shown, not only that, but it also has support for phone apps thanks to [React Native](https://facebook.github.io/react-native/) allowing us to use React and Javascript to build Native Mobile Apps.

## Conclusion

So we learned why React can be useful for us and some basic knowledge that's good to know. In the next posts we be jumping directly into action.

See you on the next post.

Sincerely,

\*\*Eng. Adrian Beria.
