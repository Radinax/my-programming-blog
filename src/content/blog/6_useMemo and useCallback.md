---
title: "Optimize your React Application with useMemo and useCallback"
description: "In this post we will learn how to optimize the performance of our applications using useMemo and useCallback!"
category: ["react", "frontend"]
pubDate: "2023-11-05"
published: true
---

This concept is called Memoization:

> Memoization is an optimization technique that speeds up applications by storing the results of expensive function calls and returning the cached result when the same inputs are supplied again.

## What is useCallback?

It's a built in React Hook used to return a memoized version of **callback function**:

> In computer programming, a callback is a reference to executable code, or a piece of executable code, that is passed as an argument to other code. This allows a lower-level software layer to call a subroutine (or function) defined in a higher-level layer.

`useCallback` is a hook that takes two parameters:

```javascript
React.useCallback(function, dependenciesArray)
```

For example:

```javascript
const memoizedIdSetter = React.useCallback(
  (id) => {
    setUserId(id);
  },
  [id]
);
```

This hook remembers the result of the function after renders and only runs again if the dependency changes. On this example is `id` changes it will run this function again and will set the user id to the state, this let us avoid re-rendering the whole component when we don't need to.

Here is a more real world application:

```javascript
import useSearch from './fetch-items';

const MyBigList = ({ term, onItemClick }) => {
  const items = useSearch(term);
  return (
  	<div>
      {items.map(item => (
  		<div onClick={onItemClick}>{item}</div>
      )}
	</div>
    )
}

export default MyBigList;
```

The parent component of `MyBigList` provides a handler function to know when an item is clicked:

```javascript
import { useCallback } from "react";

const MyParent = ({ term }) => {
  const onItemClick = useCallback(
    (event) => {
      console.log("You clicked ", event.currentTarget);
    },
    [term]
  );
  return <MyBigList term={term} onItemClick={onItemClick} />;
};
```

`onItemClick` callback is memoized by `useCallback()`. As long as `term` is the same, `useCallback()` returns the same function object.

When `MyParent` component re-renders, `onItemClick` function object remains the same and doesn't break the memoization of `MyBigList`.

On this case you could have hundreds of items on the list so its worth to avoid a re-render, but it weren't the case, then you wouldn't probably be needing to memoize this function because it brings performance issues.

## What is useMemo?

It's a built in React Hook used to return a memoized version of **value**.

`useMemo` is a React Hook that takes two parameters:

```javascript
React.useMemo(function, dependenciesArray);
```

The difference with `useCallback` is that `useMemo` memoizes any value while the other does it with functions.

Here is an example:

```javascript
const BigList = ({ hundredItemsList }) => {
  const nameAndAgeList = useMemo(() => {
    return hundredItemsList.map((list) => {
      return list.name + " is " + list.age + " years old ";
    });
  }, [hundredItemsList]);

  return (
    <div>
      <ul>
        {nameAndAgeList.map((nameAndAge) => (
          <li>{nameAndAge}</li>
        ))}
      </ul>
    </div>
  );
};
```

On this case it's more obvious that we have to `useMemo` to avoid needless re-renders on the `BigList` component if the `hundredItemsList` prop changes.

## Conclusion

These two memoize hooks are very useful to avoid unnecessary re-renders, one memoize values (string, array, objects, numbers) while the other memoize functions. But this shouldn't be abused because it can lead to performance issues if its used when it shouldn't.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
