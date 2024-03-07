---
title: "React Lifecycle methods and useEffect"
description: "In this post we will learn about React Lifecycle Methods and the hook useEffect, learning from cleanup functions to examples on how to use this hook!"
category: ["react", "frontend"]
pubDate: "2023-11-03"
published: true
---

> Sometimes, we want to **run some additional code after React has updated the DOM.** Network requests, manual DOM mutations, and logging are common examples of effects that don’t require a cleanup. We say that because we can run them and immediately forget about them.

React Components go through a lifecycle when they get used in the DOM, these are:

- `componentDidMount`: Executes after the component is mounted and rendered into the DOM.
- `componentDidUpdate`: Executes after the component is being updated by the state or a property.
- `componentWillUnmount`: Executes when component is about to be removed or unmounted from the DOM.

## useEffect

You can think of the `useEffect` Hook as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined.

`useEffect` takes two arguments.

The first argument is a function called `effect` and is what gives the `useEffect` Hook its name.

The second argument is an optional array called `dependencies` and allows you to control when exactly the `effect` function is run. Think of a `dependencies` as variables (typically state variables) that the `effect` function references and therefore depends on.

If you choose not to specify any `dependencies`, React will default to running the `effect` when the component is first mounted and after every completed render. In most cases, this is unnecessary, and it would be better to run the `effect` only if something has changed.

This is where the optional `dependencies` argument comes in.

When `dependencies` is present, React compares the current value of `dependencies` with the values used in the previous render. `effect` is only run if `dependencies` has changed.

If you want `effect` to run only once (similar to `componentDidMount`), you can pass an empty array (`[]`) to `dependencies`.

Let's look at an example:

```javascript
const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // By passsing an empty array this effect only runs once
    fetch("https://randomURLToFetchDataFrom.com")
      .then((res) => res.json())
      .then(({ users }) => setUsers(users));
  }, []);

  return (
    <div>
      {users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

A `key` is a special string attribute you need to include when creating lists of elements in React. Keys are **used to React to identify which items in the list are changed, updated, or deleted** and it has to be **unique**.

If we were to pass a dependency value as second argument, it would run the `useEffect` hook everytime that variable changes, behaving like a `componentDidUpdate`.

You can also pass a `cleanup` function as a return inside the `useEffect` hook that acts like a `componentWillUnmount`. React usually lets you know when you need to use a `cleanup` by putting a warning message on your web console log indicating a memory leak.

> ```
> Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
> ```

When do we use a cleanup function?

When we need to cleanup a subscription:

```javascript
useEffect(() => {
  API.subscribe();
  return function cleanup() {
    API.unsubscribe();
  };
});
```

When we need to cleanup an asynchronous operation to make sure the component is still mounted for when the asynchronous action has finished:

```javascript
// What happens is that a user can leave the screen in the process of making the
// async request, so this adds a memory leak warning, with this method we can
// avoid this problem.
function Example(props) {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchAPI.then(() => {
      if (mounted) {
        setloading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return <div>{loading ? <p>loading...</p> : <p>Fetched!!</p>}</div>;
}
```

When we need to cancel an Axios request, we will go in later posts about Axios, but it has a feature that lets us finish a request before it ends:

```javascript
useEffect(() => {
  const source = axios.CancelToken.source();

  const fetchUsers = async () => {
    try {
      await Axios.get("/users", {
        cancelToken: source.token,
      });
      // ...
    } catch (error) {
      if (Axios.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  fetchData();

  return () => {
    source.cancel();
  };
}, []);
```

## Conclusion

`useEffect` is very used in React and understanding how it works is crucial to avoid serious bugs like infinite re renders and memory leaks error. We can control how a component can behave at our will thanks to the `useEffect` and `useState` hooks.

See you on the next post.

Sincerely,

**Eng Adrian Beria**.
