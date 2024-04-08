---
title: "[Roadmap_Node] 4_Core Concepts"
description: "Let us talk about Node JS core concepts like Event Loop, Callbacks, Asyncronous Programming, Streams and Buffers"
category: ["node"]
pubDate: "2024-04-05"
published: true
---

# Introduction

Node.js introduces some core concepts that set it apart from traditional JavaScript execution in web browsers and provide the foundation for building powerful server-side applications. Here's a breakdown of some key aspects:

**1. Event-Driven Architecture:**

- Unlike browsers that follow a request-response model, Node.js is event-driven. This means it focuses on handling events (signals) that occur asynchronously.
- At the heart of this architecture lies the **event loop**, a single-threaded process that continuously monitors events:
  - I/O events (e.g., file system operations, network requests)
  - Timer events (e.g., `setTimeout`)
  - User interactions (when applicable)
- When an event occurs, the event loop places it in an **event queue**.
- The event loop then processes the queued events one by one. It retrieves an event from the queue, executes the associated callback function, and moves on to the next event.
- This asynchronous approach allows Node.js to handle multiple concurrent requests efficiently without blocking the main thread.

**2. Non-Blocking I/O (Input/Output):**

- Traditional I/O operations (e.g., reading files, making network requests) can block the execution thread in a web browser until the data is retrieved.
- Node.js utilizes non-blocking I/O. When an I/O operation is initiated, the main thread doesn't wait for it to complete. Instead, it continues executing other tasks.
- Once the I/O operation finishes, it triggers an event that gets added to the event queue.
- This enables Node.js to handle a high number of concurrent connections effectively, making it well-suited for real-time applications and web servers.

**3. Callbacks and Promises:**

- Since Node.js deals with asynchronous operations, mechanisms are needed to handle the results later when they become available.
  - **Callbacks:** These are functions that are passed as arguments to other functions. When the asynchronous operation finishes, the callback function is invoked with the results (data or error).
  - **Promises:** Introduced in later versions of JavaScript, promises provide a more structured way to handle asynchronous operations. They represent the eventual completion (or failure) of an asynchronous operation and allow for chaining of operations.

```javascript
const fs = require("fs");

// Function that returns a promise to read a file
function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(data); // Resolve the promise with the file data
      }
    });
  });
}

// Usage of the promise function
const filePath = "my-file.txt";

readFilePromise(filePath)
  .then((data) => {
    console.log("File content:", data);
  })
  .catch((err) => {
    console.error("Error reading file:", err);
  });

console.log("This line is executed before the file is read"); // Not blocked
```

**4. Streams:**

- Streams are objects that represent a sequence of data chunks flowing over time. They are often used for handling large data sets efficiently without loading everything into memory at once.
- Node.js provides different types of streams for various purposes:
  - **Readable streams:** Used for reading data chunks from a source (e.g., files, network connections).
  - **Writable streams:** Used for writing data chunks to a destination (e.g., files, network connections).
  - **Duplex streams:** Can be used for both reading and writing.

```javascript
const fs = require("fs");

const readableStream = fs.createReadStream("my-file.txt");

readableStream.on("data", (chunk) => {
  console.log(chunk.toString());
});

readableStream.on("end", () => {
  console.log("Finished reading the file");
});

readableStream.on("error", (err) => {
  console.error("Error reading file:", err);
});
```

**5. Modules (CommonJS vs. ES6 Modules):**

- Node.js applications are built from reusable code components called modules. These modules can be:
  - **Built-in modules:** Provided by Node.js for common tasks like file system access, http server creation, and event handling.
  - **Third-party modules:** Found on the npm (Node Package Manager) registry and offer a vast ecosystem of functionalities for various needs.
- Node.js traditionally used **CommonJS Modules** with `require()` and `module.exports` for defining and using modules.
- **ES6 Modules (ECMAScript Modules)**, introduced with ES6 (ECMAScript 2015), offer a more modern approach with `import` and `export` keywords.

Here is an example of commonjs:

```javascript
// Function to be exported
function add(a, b) {
  return a + b;
}

// Export the function using module.exports
module.exports = add;
```

```javascript
const add = require("./commonJSModule"); // Import using require

const result = add(5, 3);
console.log(result); // Output: 8
```

Here is the counterpart using ES6 modules:

```javascript
// Function to be exported
export function add(a, b) {
  return a + b;
}
```

```javascript
import { add } from "./es6Module"; // Named import using import

const result = add(5, 3);
console.log(result); // Output: 8
```

**6. Asynchronous Programming Patterns:**

- Building applications with non-blocking I/O and callbacks can lead to nested callback structures, making code harder to read and maintain.
- Node.js developers have adopted various asynchronous programming patterns to improve code readability and manage complexity:
  - **Callbacks:** The traditional approach, but can lead to "callback hell" in complex scenarios.
  - **Promises:** Offer a more structured way to handle asynchronous operations and chain them together.
  - **Async/Await (introduced later):** Syntactic sugar over promises that makes asynchronous code look more synchronous, improving readability.

Here is an example with its proper explanation:

```javascript
JavaScript;
const https = require("https");

// Function to fetch data using async/await
async function fetchData(url) {
  const response = await https.get(url); // Make the request (await the response)

  if (response.statusCode !== 200) {
    throw new Error(
      `API request failed with status code: ${response.statusCode}`
    );
  }

  const data = await response.json(); // Parse the JSON response (await the parsing)
  return data;
}

// Usage of the async function
const apiUrl = "https://api.example.com/data";

(async () => {
  try {
    const apiData = await fetchData(apiUrl);
    console.log("API data:", apiData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

console.log("This line is executed before the API call finishes");
```

**Explanation:**

1. **`fetchData` Function:**

   - This function is declared as `async` to enable the use of `await`.
   - It takes the API URL as input.
   - It uses `https.get` to make the API request. We `await` the response object to ensure the request finishes before proceeding.
   - It checks the response status code. If not 200 (success), it throws an error.
   - It uses `response.json()` to parse the JSON response from the API. Again, we `await` the parsing to ensure it's complete.
   - It returns the parsed data.

2. **Using Async/Await:**

   - We wrap our code in an Immediately Invoked Function Expression (IIFE) with `async () => { ... }`. This allows us to use `await` within the function.
   - Inside the function, we try to fetch data using `await fetchData(apiUrl)`. We await the result of the `fetchData` function, which in turn awaits the API request and response parsing.
   - We handle the response data in the `then` block (implicit with `try...catch`).
   - We handle any errors thrown during the process in the `catch` block.

3. **Non-Blocking Behavior:**
   - The line `console.log('This line is executed before the API call finishes');` demonstrates non-blocking behavior. The main thread doesn't wait for the API call to complete before executing this line.

# Conclusion

These core concepts form the foundation of Node.js development. By understanding event-driven architecture, non-blocking I/O, and asynchronous programming mechanisms, you can build scalable and responsive server-side applications that efficiently handle concurrent requests and real-time interactions.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
