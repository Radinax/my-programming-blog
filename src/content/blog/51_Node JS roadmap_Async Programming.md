---
title: "[Roadmap_Node] 7_Asynchronous Programming in Node.js"
description: "Let us talk about Asynchronous Programming! This is gonna be a key post to understand how to properly use it in our every day life"
category: ["node"]
pubDate: "2024-04-07T07:00:00-04:00"
published: true
---

## Table of content

# Introduction

In Node.js, asynchronous programming is a fundamental concept because Node.js itself is single-threaded. This means it can only handle one task at a time. However, asynchronous programming allows your application to appear responsive and handle multiple requests concurrently. Here's a simplified introduction:

- **Synchronous vs. Asynchronous:**

  - **Synchronous:** A synchronous task blocks the main thread until it's finished. Imagine waiting in line for a coffee – you can't do anything else until you get your order.
  - **Asynchronous:** An asynchronous task doesn't block the main thread. It can start and continue working in the background while the main thread moves on to other tasks. It's like asking a friend to get you coffee – you can keep working on other things while you wait.

- **Why Asynchronous Programming in Node.js?**

  - **Non-blocking I/O operations:** Many operations in Node.js, like reading from a file or making a network request, can take time. With asynchronous programming, the main thread doesn't wait for these operations to finish. It can move on to other tasks, keeping your application responsive.

- **Common Async Patterns in Node.js:**
  - **Callbacks:** A function passed to an asynchronous function to be executed when the operation completes. It's like telling your friend to call you when they get your coffee.
  - **Promises:** Objects representing the eventual completion (or failure) of an asynchronous operation. They offer a cleaner way to handle async code compared to callbacks.
  - **Async/Await:** Syntactic sugar built on top of Promises that makes asynchronous code look more synchronous (like using `await` to pause execution until a promise resolves).

**Benefits of Asynchronous Programming:**

- **Improved responsiveness:** Your application feels faster and more responsive because the main thread isn't blocked by slow operations.
- **Efficient handling of I/O:** Ideal for applications dealing with network requests, file I/O, or user interactions that might take time.
- **Scalability:** Your application can handle more concurrent requests without sacrificing performance.

**Keep in mind:** Asynchronous programming can add complexity to your code. It's important to manage asynchronous operations effectively to avoid issues like callback hell or unhandled promise rejections.

# Callbacks

In Node.js, callbacks are a fundamental concept for handling asynchronous operations. Since Node.js is single-threaded, it can only execute one task at a time. But callbacks enable your application to appear responsive and manage multiple requests concurrently.

**Here's how callbacks work:**

1. **Initiating an asynchronous operation:** Imagine your application needs to read data from a file. You can't wait for the entire file to be read before moving on, because that would block the main thread. So, you initiate the file reading process asynchronously using a function like `fs.readFile`.

2. **Providing a callback function:** When calling the asynchronous function, you pass it a separate function as an argument. This function, called the callback, is what you want to happen **after** the asynchronous operation is completed. It's like telling a friend, "Hey, go read that file, and when you're done, call me back and tell me what you found."

3. **Node.js continues execution:** The main thread doesn't wait for the file reading to finish. It can move on to handle other tasks while the file is being read in the background.

4. **Callback execution:** Once the asynchronous operation (file reading) is complete, Node.js knows to call the callback function you provided. It's like your friend coming back and telling you, "Alright, I finished reading the file, here's the data." The callback function receives any results or errors from the asynchronous operation as arguments.

**Here's a simplified example:**

```javascript
const fs = require("fs");

function readFile(fileName, callback) {
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      callback(err); // Call the callback with the error
    } else {
      callback(null, data); // Call the callback with data (and no error)
    }
  });
}

readFile("myFile.txt", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
  } else {
    console.log("File content:", data);
  }
});

console.log("Meanwhile, the main thread can keep working on other tasks...");
```

**Advantages of callbacks:**

- **Simple concept:** Callbacks are a relatively easy way to understand asynchronous programming for beginners.
- **Widely used:** They are a core concept in Node.js and many other asynchronous environments.

**Disadvantages of callbacks:**

- **Callback hell:** Nesting callbacks can make code complex and difficult to read, especially when dealing with multiple asynchronous operations.
- **Error handling:** Handling errors can become cumbersome as you pass errors through multiple callback layers.

While callbacks play a crucial role in Node.js, newer mechanisms like Promises and Async/Await have emerged to address some of these challenges and provide cleaner ways to manage asynchronous code.

# Promises

Promises in Node.js are an improvement over callbacks for handling asynchronous operations. They offer a cleaner and more structured way to manage the eventual completion (or failure) of asynchronous tasks.

**Key points about Promises:**

- **Represents eventual completion:** A Promise is an object that reflects the eventual outcome (success or failure) of an asynchronous operation. It acts as a placeholder for the result that will be available at some point in the future.
- **State transitions:** A Promise can be in one of three states:
  - Pending: Initial state, the asynchronous operation is ongoing.
  - Fulfilled: The operation completed successfully, and the result is available.
  - Rejected: The operation encountered an error.

**Using Promises:**

1. **Creating a Promise:** You typically create a Promise using a Promise constructor function. This function takes an executor function as an argument. The executor function defines the asynchronous operation and has two arguments: `resolve` and `reject`.

2. **Resolving or rejecting:** Inside the executor function, you use `resolve` to indicate successful completion and provide the result. Use `reject` to signal an error and provide an error object.

3. **Consuming a Promise:** You use the `then` method to define what happens when the Promise is fulfilled (resolved). You can also use `catch` to handle potential rejections (errors). Both `then` and `catch` receive callback functions.

**Here's a basic example:**

```javascript
function readFilePromise(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) {
        reject(err); // Reject the Promise with the error
      } else {
        resolve(data); // Resolve the Promise with the data
      }
    });
  });
}

readFilePromise("myFile.txt")
  .then((data) => {
    console.log("File content:", data);
  })
  .catch((err) => {
    console.error("Error reading file:", err);
  });

console.log("Meanwhile, the main thread can keep working on other tasks...");
```

**Advantages of Promises over Callbacks:**

- **Improved readability:** Promise chains using `then` and `catch` are generally considered more readable than nested callbacks.
- **Error handling:** Centralized error handling with `catch` simplifies error management.
- **Chaining:** Promises allow you to chain asynchronous operations more easily.

**Overall, Promises provide a more structured and manageable approach to asynchronous programming in Node.js compared to traditional callbacks.**

# Async/Await

Async/await is a powerful addition to JavaScript (introduced in ES2017) that simplifies asynchronous programming in Node.js. It provides a cleaner syntax that makes asynchronous code appear more synchronous, improving readability and maintainability.

**Here's a breakdown of async/await:**

- **Async functions:** Async functions are a special kind of function declaration that can contain `await` expressions. They implicitly return a Promise.
- **Await expression:** The `await` keyword is used within an async function to pause execution until a Promise is resolved. The `await` expression's result becomes the available value to proceed.

**Using Async/Await:**

1. **Declaring an async function:** You mark a function as asynchronous using the `async` keyword before the function declaration.

2. **Using await:** Inside an async function, you can use the `await` keyword before a Promise. The `await` expression pauses execution until the Promise resolves, and then the resolved value is available for further use in your code.

**Here's an example rewriting the previous Promise example using async/await:**

```javascript
async function readFileAsync(fileName) {
  try {
    const data = await fs.promises.readFile(fileName, "utf8");
    console.log("File content:", data);
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

readFileAsync("myFile.txt")
  .then(() =>
    console.log("Meanwhile, the main thread can keep working on other tasks...")
  )
  .catch((err) => console.error("Unhandled error:", err)); // Optional error handling at the end

console.log("This line executes before the async function finishes.");
```

**Advantages of Async/Await:**

- **Readability:** Async/await makes asynchronous code look more synchronous, like regular JavaScript code with pauses. This improves code readability and maintainability.
- **Error handling:** `try...catch` blocks can be used within async functions for clean error handling.
- **Chaining:** You can chain asynchronous operations using `await` expressions, similar to Promise chains.

**Important points to remember:**

- `await` can only be used within async functions.
- Async functions always return a Promise, even if you don't use an explicit `return` statement.

**Overall, async/await offers a more elegant and streamlined approach to writing asynchronous code in Node.js compared to callbacks or even Promises alone.**

# Error first callbacks

Error-first callbacks, also known as "errorback", "errback", or "Node.js-style callbacks", are a common pattern used for handling errors in asynchronous operations within Node.js. Here's a breakdown of how they work:

**The pattern:**

1. **Function arguments:** When using error-first callbacks, asynchronous functions typically take two arguments:

   - The first argument (usually named `err`) is reserved for errors that might occur during the operation. It will be `null` if there's no error.
   - The second argument (often named `data` or `result`) is used to return the actual data or result of the successful operation.

2. **Callback execution:** The asynchronous function calls the provided callback function when the operation completes.
   - If an error occurs, the callback is called with the error object as the first argument (`err` will have a value), and the second argument (`data` or `result`) will be `null` or undefined.
   - If the operation is successful, the callback is called with `null` for the error (`err` will be null) and the result data as the second argument (`data` or `result`).

**Example:**

```javascript
function readFile(fileName, callback) {
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      callback(err); // Call the callback with the error
    } else {
      callback(null, data); // Call the callback with data (and no error)
    }
  });
}

readFile("myFile.txt", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
  } else {
    console.log("File content:", data);
  }
});
```

**Advantages of error-first callbacks:**

- **Simplicity:** The concept is relatively easy to understand, especially for beginners.
- **Common practice:** It's a widely used pattern in Node.js, making code familiar to those experienced with the ecosystem.

**Disadvantages of error-first callbacks:**

- **Callback hell:** Nesting multiple error-first callbacks can lead to complex and hard-to-read code, especially when dealing with chained asynchronous operations.
- **Error handling:** Handling errors can become cumbersome as you pass them through multiple callback layers.

**Alternatives:**

- **Promises:** Provide a more structured way to handle asynchronous operations with separate `resolve` and `reject` mechanisms for successful outcomes and errors, respectively.
- **Async/await:** Syntactic sugar built on top of Promises that makes asynchronous code look more synchronous using `await` expressions.

While error-first callbacks played a historical role in Node.js development, Promises and Async/Await are generally preferred for their improved readability and error handling capabilities when writing modern asynchronous code.

# Showing an HTTP request with everything we learned

Here's an example demonstrating how to perform an HTTP request using error-first callbacks, Promises, and Async/Await in Node.js:

**1. Using Error-First Callback:**

```javascript
const https = require("https");

function makeRequest(url, callback) {
  https.get(url, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      if (res.statusCode === 200) {
        callback(null, data);
      } else {
        callback(new Error(`Error: ${res.statusCode}`), null);
      }
    });

    res.on("error", (err) => {
      callback(err, null);
    });
  });
}

const url = "https://api.example.com/data";
makeRequest(url, (err, data) => {
  if (err) {
    console.error("Error:", err.message);
  } else {
    console.log("Response data:", data);
  }
});
```

**Explanation:**

- We use the `https` module to make HTTPS requests.
- The `makeRequest` function takes a URL and a callback function as arguments.
- Inside the `https.get` call, we handle different events:
  - `data`: Accumulates the received data chunks.
  - `end`: Checks the response status code. If successful (200), calls the callback with the data. Otherwise, calls the callback with an error.
  - `error`: Calls the callback with any errors encountered during the request.

**2. Using Promises:**

```javascript
const https = require("https");

function makeRequestPromise(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`Error: ${res.statusCode}`));
        }
      });

      res.on("error", (err) => {
        reject(err);
      });
    });
  });
}

const url = "https://api.example.com/data";
makeRequestPromise(url)
  .then((data) => console.log("Response data:", data))
  .catch((err) => console.error("Error:", err.message));
```

**Explanation:**

- We use a Promise to represent the eventual completion (or failure) of the request.
- The `makeRequestPromise` function returns a Promise that resolves with the data on success or rejects with an error.
- We use `then` to handle the successful response and `catch` to handle any errors.

**3. Using Async/Await:**

```javascript
const https = require("https");

async function makeRequestAsyncAwait(url) {
  try {
    const response = await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject(new Error(`Error: ${res.statusCode}`));
          }
        });

        res.on("error", (err) => {
          reject(err);
        });
      });
    });
    console.log("Response data:", response);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

const url = "https://api.example.com/data";
makeRequestAsyncAwait(url);
```

**Explanation:**

- We use an async function `makeRequestAsyncAwait` to handle the asynchronous nature of the request.
- Inside the function, we use `await` with a Promise to pause execution until the request completes.
- We use `try...catch` to handle potential errors during the request.

These are just basic examples. Remember to handle potential issues like timeouts or invalid URLs appropriately in your production code. Choose the approach that best suits your coding style and project requirements!

# Conclusion

We finally learned some good concepts and put into action! We studied about callbacks, async/await, promises, and how they look doing the same action.

Its often suggested to use async/await over promises but your project should be consistent in its way of doing this (material for another post), for example, you should never do an API request using promises and then another one using async/await, your project needs to be consistent.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
