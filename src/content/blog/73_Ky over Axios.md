---
title: "The evolution of HTTP requests: XMLHttpRequest, Fetch, Axios and Ky"
description: "We're gonna analyze the evolution of how to do API requests and why they have changed so much over time"
category: ["javascript"]
pubDate: "2024-07-29"
published: true
---

## Table of content

# Introduction

Over the years we have been using HTTP requests technologies to communicate from the frontend to the backend, we have done so using the mentioned technologies that have been evolving over time to fetch data from an API, send data to the server or any operation, so for this reason we need tools to help us perform these actions, to this day two are very common today, one being used in legacy projects like Axios, or a new one like Ky.

Axios is a well-known and widely used library that provides a rich set of features and supports both browsers and Node.js. Ky is a newer and lighter library that focuses on modern browsers and offers a simpler and more elegant API.

# XMLHttpRequest

From a concept perspective:

> XMLHttpRequest (XHR) objects are used to interact with servers. You can retrieve data from a URL without having to do a full page refresh. This enables a Web page to update just part of a page without disrupting what the user is doing.

Now let's see how it looks in action:

```javascript
// Function to create a new XMLHttpRequest object
function createRequest() {
  const xhr = new XMLHttpRequest();
  xhr.setRequestHeader("Content-Type", "application/json");
  return xhr;
}

// Create a new todo
function createTodo(todo) {
  const xhr = createRequest();
  xhr.open("POST", "https://jsonplaceholder.typicode.com/todos");
  xhr.onload = () => {
    if (xhr.status === 201) {
      console.log("Todo created successfully:", JSON.parse(xhr.responseText));
    } else {
      console.error("Error creating todo:", xhr.statusText);
    }
  };
  xhr.send(JSON.stringify(todo));
}

// Read all todos
function readTodos() {
  const xhr = createRequest();
  xhr.open("GET", "https://jsonplaceholder.typicode.com/todos");
  xhr.onload = () => {
    if (xhr.status === 200) {
      const todos = JSON.parse(xhr.responseText);
      console.log("Todos:", todos);
    } else {
      console.error("Error fetching todos:", xhr.statusText);
    }
  };
  xhr.send();
}

// Update a todo
function updateTodo(id, updatedTodo) {
  const xhr = createRequest();
  xhr.open("PUT", `https://jsonplaceholder.typicode.com/todos/${id}`);
  xhr.onload = () => {
    if (xhr.status === 200) {
      console.log("Todo updated successfully:", JSON.parse(xhr.responseText));
    } else {
      console.error("Error updating todo:", xhr.statusText);
    }
  };
  xhr.send(JSON.stringify(updatedTodo));
}

// Delete a todo
function deleteTodo(id) {
  const xhr = createRequest();
  xhr.open("DELETE", `https://jsonplaceholder.typicode.com/todos/${id}`);
  xhr.onload = () => {
    if (xhr.status === 200) {
      console.log("Todo deleted successfully");
    } else {
      console.error("Error deleting todo:", xhr.statusText);
    }
  };
  xhr.send();
}

// Example usage:
const newTodo = {
  userId: 1,
  title: "New todo",
  completed: false,
};

createTodo(newTodo);
readTodos();
updateTodo(1, { ...newTodo, title: "Updated todo" });
deleteTodo(1);
```

# Fetch API

Let's see how the previous code looks using Fetch API:

```javascript
// Create a new todo
const createTodo = async (todo) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Todo created successfully:", data);
  } catch (error) {
    console.error("Error creating todo:", error);
  }
};

// Read all todos
const readTodos = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Todos:", data);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

// Update a todo
const updateTodo = async (id, updatedTodo) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Todo updated successfully:", data);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

// Delete a todo
const deleteTodo = async (id) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    console.log("Todo deleted successfully");
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

// Example usage
const newTodo = {
  userId: 1,
  title: "New todo",
  completed: false,
};

createTodo(newTodo);
readTodos();
updateTodo(1, { ...newTodo, title: "Updated todo" });
deleteTodo(1);
```

# XMLHttpRequest vs Fetch API

XMLHttpRequest (XHR) and Fetch API are both used for making asynchronous requests to servers, let's check a summary of them:

## XMLHttpRequest

- **Older API:** It's been around for a long time, providing the foundation for AJAX interactions.
- **Event-driven:** Relies on events like `onload`, `onerror`, `onreadystatechange` for handling responses.
- **Complex syntax:** Requires more verbose code for setting up requests and handling responses.
- **Lower-level control:** Offers granular control over request details but can be more complex to use.
- **Direct access to response body:** Provides direct access to the response body through `responseText` or `responseXML`.

## Fetch API

- **Modern API:** Introduced as a more modern and promise-based approach to network requests.
- **Promise-based:** Uses Promises for asynchronous operations, making code more readable and easier to manage.
- **Cleaner syntax:** Offers a simpler syntax for creating and sending requests.
- **Higher-level abstraction:** Provides a more abstract interface, simplifying common tasks.
- **Response as a stream:** Treats the response as a stream, allowing for more efficient handling of large responses.

## Key Differences

| Feature           | XMLHttpRequest                 | Fetch API                                            |
| ----------------- | ------------------------------ | ---------------------------------------------------- |
| Syntax            | Complex, event-driven          | Simpler, promise-based                               |
| Error handling    | Event-based                    | Promise rejection                                    |
| Response handling | Direct access to response body | Response as a stream                                 |
| Browser support   | Wide                           | Good, but might require polyfills for older browsers |

## When to Use Which

- **XMLHttpRequest:** If you need fine-grained control over the request and response, or if you're working with older browsers that don't fully support Fetch API.
- **Fetch API:** In most modern web applications, Fetch API is preferred due to its cleaner syntax, promise-based approach, and better integration with modern JavaScript features.

**In summary**, Fetch API is generally the recommended choice for new projects due to its improved usability and promise-based nature. But its important to understand that XMLHttpRequest is still valuable for maintaining legacy code.

# Axios (based on XHR)

**Axios** is a popular JavaScript library designed to make HTTP requests easier and more efficient. It provides a promise-based interface for interacting with servers, simplifying tasks like:

- **Making GET, POST, PUT, DELETE, and other HTTP requests**
- **Handling responses**
- **Intercepting requests and responses**
- **Transforming data**

**Key benefits of using Axios:**

- **Simple syntax:** Compared to the native XMLHttpRequest, Axios offers a cleaner and more intuitive API.
- **Promise-based:** Leverages Promises for asynchronous operations, making code more readable and easier to manage.
- **Intercepting requests and responses:** Allows you to modify requests or responses before they are sent or received.
- **Client/server compatibility:** Can be used in both browser and Node.js environments.

In essence, Axios abstracts away the complexities of making HTTP requests, but its based on XHR which isn't too appealing for new projects these days.

## Doing a CRUD using Axios

The previous code will be refactored using Axios now:

```javascript
import axios from 'axios';

// Create a new todo
const createTodo = async (todo) => {
  try {
    const response = await axios.post('https://jsonplaceholder.typicode.com/todos', todo);
    console.log('Todo created successfully:', response.data);
  } catch (error) {
    console.error('Error creating todo:', error);
  }
};

// Read all todos
const readTodos = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
    console.log('Todos:', response.data);
  } catch (error) {
    console.error('Error  
 fetching todos:', error);
  }
};

// Update a todo
const updateTodo = async (id, updatedTodo) => {
  try {
    const response = await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, updatedTodo);
    console.log('Todo updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating todo:', error);
  }
};

// Delete a todo
const deleteTodo = async (id) => {
  try {
    await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
    console.log('Todo deleted successfully');
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

// Example usage
const newTodo = {
  userId: 1,
  title: 'New todo',
  completed: false
};

createTodo(newTodo);
readTodos();
updateTodo(1, { ...newTodo, title: 'Updated todo' });
deleteTodo(1);
```

As we can see the code looks cleaner since its promised based. But Axios also offers more like **interceptors**.

### Interceptors

They are functions that are executed before a request is sent or after a response is received. They provide a powerful way to modify requests or responses globally.

Let's say you want to add an authorization header to every request made with Axios. Here's how you can do it using an interceptor:

```javascript
import axios from "axios";

axios.interceptors.request.use((config) => {
  // Add authorization header to every request
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});
```

### Error handling

You can also use interceptors to handle errors globally. For instance, you might want to redirect the user to a login page if there's an unauthorized error:

```javascript
axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    // Handle unauthorized  
 error, e.g., redirect to login
    window.location.href = '/login';
  }
  return Promise.reject(error);
});
```

We can also perform the following actions:

- Logging requests and responses: You can log request and response data for debugging purposes.
- Transforming data: You can modify request or response data before it's processed.
- Adding custom headers: You can add custom headers to specific requests based on conditions.
- Error handling: You can implement custom error handling logic for different error types.

Axios has been the standard in the last decade, so now let's explore a new HTTP request tool called Ky.

# Ky (based on Fetch API)

https://github.com/sindresorhus/ky

Ky is a modern HTTP client built on top of the Fetch API, offering a more concise and functional syntax, let's check its benefits:

- Simpler API
- Method shortcuts (ky.post())
- Treats non-2xx status codes as errors (after redirects)
- Retries failed requests
- JSON option
- Timeout support
- URL prefix option
- Instances with custom defaults
- Hooks
- TypeScript niceties (e.g. .json() resolves to unknown, not any; .json<T>() can be used too)

## Doing a CRUD using Ky

Let's check the same code we used before:

```javascript
import ky from "ky";

const apiUrl = "https://jsonplaceholder.typicode.com/todos";

// Create a new todo
const createTodo = async (todo) => {
  try {
    const response = await ky.post(apiUrl, { json: todo });
    const data = await response.json();
    console.log("Todo created successfully:", data);
  } catch (error) {
    console.error("Error creating todo:", error);
  }
};

// Read all todos
const readTodos = async () => {
  try {
    const response = await ky.get(apiUrl);
    const data = await response.json();
    console.log("Todos:", data);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

// Update a todo
const updateTodo = async (id, updatedTodo) => {
  try {
    const response = await ky.put(`${apiUrl}/${id}`, { json: updatedTodo });
    const data = await response.json();
    console.log("Todo updated successfully:", data);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

// Delete a todo
const deleteTodo = async (id) => {
  try {
    await ky.delete(`${apiUrl}/${id}`);
    console.log("Todo deleted successfully");
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

// Example usage
const newTodo = {
  userId: 1,
  title: "New todo",
  completed: false,
};

createTodo(newTodo);
readTodos();
updateTodo(1, { ...newTodo, title: "Updated todo" });
deleteTodo(1);
```

# Ky vs Axios code comparison

## GET

```javascript
// ky
const response = await ky.get("https://example.com/api/users");
const data = await response.json();
console.log(data);

// axios
const response = await axios.get("https://example.com/api/users");
const data = response.data;
console.log(data);
```

- Ky returns a Response object that conforms to the Fetch API specification, while axios returns a custom object that contains the data, status, headers, and other properties.
- Ky requires you to call the response.json() method to parse the response data to a JavaScript object similar to using fetch, while axios automatically parses the data for you.
- Ky uses the ky.get() method to make a GET request, while axios uses the axios.get() method.

## POST

```javascript
// ky
const data = { name: "Alice", age: 25 };
const response = await ky.post("https://example.com/api/users", { json: data });
const result = await response.json();
console.log(result);

// axios
const data = { name: "Alice", age: 25 };
const response = await axios.post("https://example.com/api/users", data);
const result = response.data;
console.log(result);
```

- Ky accepts a json option to send the data as JSON, while axios automatically converts the data to JSON for you.
- Ky and axios have the same syntax for making a POST request, except for the json option.

## Customize request

We usually create an `api` const based on the HTTP request tool to avoid repetition, let's see how to do it in both cases:

For Ky:

```javascript
// ky
const api = ky.create({
  prefixUrl: "https://example.com/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // use a hook to add the authorization header before each request
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set("Authorization", "Bearer token");
      },
    ],
  },
});

const response = await api.get("users");
const data = await response.json();
console.log(data);
```

For Axios:

```javascript
// axios
const api = axios.create({
  baseURL: "https://example.com/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// use an interceptor to add the authorization header before each request
api.interceptors.request.use((config) => {
  config.headers["Authorization"] = "Bearer token";
  return config;
});

const response = await api.get("users");
const data = response.data;
console.log(data);
```

- Ky uses the `hooks.beforeRequest` option to add a hook function that modifies the request headers, while axios uses the `interceptors.request` option to add an interceptor function that modifies the request config.
- Ky uses the `request.headers.set()` method to set the header value, while axios uses the `config.headers` object to set the header value.
- Ky and axios have the same syntax for creating an instance, except for the hooks and interceptors options.
- Ky supports multiple functions in the `hooks.beforeRequest` option, which will be executed in order before the request is sent. This allows you to perform different modifications or actions based on the request. For example, you can add a function to log the request details, and another function to add a custom header. You can also use async functions in the hooks, which will wait for the promise to resolve before proceeding to the next hook or the request. Axios also supports multiple functions in the `interceptors.request option`, but they are executed in reverse order, which can be confusing.

## Abort Controller

> AbortController provides a way to abort one or more Web API tasks, like fetch requests. It's particularly useful for managing ongoing tasks that may need to be stopped under certain conditions.

Axios doesn't have direct support for AbortController. However, we can achieve similar functionality by creating a custom Axios instance with a custom interceptor.

```javascript
import axios from "axios";

const createAxiosInstance = () => {
  const instance = axios.create();

  instance.interceptors.request.use((config) => {
    const controller = new AbortController();
    config.signal = controller;
    config.cancelToken = new axios.CancelToken((cancel) => {
      config.cancel = cancel;
    });

    return config;
  });

  return instance;
};

const api = createAxiosInstance();

// Example usage:
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // Abort after 5 seconds

api
  .get("https://api.example.com/data", { signal: controller.signal })
  .then((response) => {
    clearTimeout(timeoutId); // Clear timeout if request succeeds
    console.log(response.data);
  })
  .catch((error) => {
    if (axios.isCancel(error)) {
      console.log("Request canceled");
    } else {
      console.error("Error:", error);
    }
  });
```

Ky directly supports AbortController through the signal option:

```javascript
import ky from "ky";

const api = ky.create({
  prefixUrl: "https://api.example.com",
});

// Example usage:
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // Abort after 5 seconds

api
  .get("/data", { signal: controller.signal })
  .then((response) => {
    clearTimeout(timeoutId); // Clear timeout if request succeeds
    return response.json();
  })
  .then((data) => console.log(data))
  .catch((error) => {
    if (error.name === "AbortError") {
      console.log("Request canceled");
    } else {
      console.error("Error:", error);
    }
  });
```

## Search Params

Axios uses URLSearchParams to construct query parameters.

```javascript
import axios from "axios";

const params = new URLSearchParams({
  page: 1,
  limit: 10,
  search: "keyword",
});

axios
  .get("/api/data", { params })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
```

Ky directly supports query parameters in the options object.

```javascript
import ky from "ky";

const api = ky.create({
  prefixUrl: "https://api.example.com",
});

api
  .get("/data", {
    searchParams: {
      page: 1,
      limit: 10,
      search: "keyword",
    },
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

## Type safety

### Ky

One of Ky biggest pros is the type safety it provides using generics.

Let's assume we have an API endpoint that returns different types of data based on a specific endpoint. We'll use generic types in Ky to handle these different responses.

```typescript
import ky from "ky";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

const api = ky.create({
  prefixUrl: "https://api.example.com",
});

const fetchData = async <T>(endpoint: string): Promise<T> => {
  const response = await api.get(endpoint);
  return await response.json<T>();
};

const getUser = async (userId: number): Promise<User> => {
  return fetchData<User>(`/users/${userId}`);
};

const getPost = async (postId: number): Promise<Post> => {
  return fetchData<Post>(`/posts/${postId}`);
};
```

Explanation:

- Interfaces: We define User and Post interfaces to represent the expected data structures.
- Generic Function: The fetchData function is generic, accepting a type parameter T. It fetches data from the specified endpoint and returns a Promise of type T.
- Specific Functions: The getUser and getPost functions utilize fetchData with the appropriate type parameter, providing type safety for the returned data.

Key Points:

- The fetchData function is versatile, allowing us to fetch different types of data with a single function.
- Generic types ensure that the returned data matches the expected structure.
- This approach improves code readability and maintainability.
- By using generics with Ky, we can create more flexible and type-safe API interactions.

### Axios

While Axios doesn't offer direct generic type support like Ky, we can achieve similar behavior by using type assertions or interfaces.

```typescript
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchData = async <T>(url: string): Promise<T> => {
  const response = (await axios.get) < T > url;
  return response.data;
};

const getUser = async (userId: number): Promise<User> => {
  return fetchData<User>`https://api.example.com/users/${userId}`;
};

const getPost = async (postId: number): Promise<Post> => {
  return fetchData<Post>`https://api.example.com/posts/${postId}`;
};
```

Explanation:

- We've defined `User` and `Post` interfaces as before.
- The `fetchData` function is generic, taking a type parameter `T`.
- We use a type assertion `axios.get<T>` to specify the expected response type.
- The `getUser` and `getPost` functions use fetchData with the appropriate type arguments.

While this approach works, it's less type-safe than Ky's built-in generics. There's a risk of runtime errors if the actual response doesn't match the expected type.

In conclusion, while Axios can be adapted to use generic types, Ky's direct support for generics often provides a more elegant and type-safe solution.

# How to use Ky in modern projects

Finally let's add a snippet you can use for your work or personal projects:

```javascript
import ky from "../lib/ky";

const UserService = {
  registerUser: async (userData) => {
    const response = await ky.post("register", { json: userData }).json();
    return response;
  },

  loginUser: async (credentials) => {
    return await ky.post("login", { json: credentials }).json()
  }

  updateProfile: async (userId, profileData) => {
    const response = await ky.put(`${userId}`, { json: profileData }).json()
    return response
  }
};
```

Where `ky` is:

```javascript
import kyStandard from "ky";

// Define API_URL once and ky will take care of the rest
const API_URL = process.env.VITE_API_URL;

// This will add authentication token to the Authorization header
// Everytime a request is sent with the ky instance
const prepareRequestsWithAuth = (request: Request) => {
  // If the auth is based on JWT
  const authToken = localStorage.getItem("auth-token");

  request.headers.set("Authorization", `Bearer ${authToken}`);
};

// Export instance with default base URL, hooks and headers
export default kyStandard.create({
  prefixUrl: API_URL,
  hooks: {
    beforeRequest: [prepareRequestsWithAuth],
  },
});
```

# Conclusion

We have learned about the evolution of HTTP requests, from XHR to Fetch then tools built upon them like Axios and Ky respectively. The main benefit of using Ky is that its based on FETCH API which is less buggy and is the standard of web development today while also offering retries and a cleaner API.

There could be other tools than KY build on FETCH, but the main idea is to move on from Axios unless you need a specific feature or support older browsers or just because of legacy code.

In terms of typescript useage, we need to play around Axios too much to get it done, while Ky just offers an elegant solution using generics.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
