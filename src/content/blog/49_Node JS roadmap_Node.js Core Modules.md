---
title: "[Roadmap_Node] 5_Core Modules"
description: "Let us talk about Node JS core modules like File System, HTTP modules, Event Emitter, Utilities, URL and Path."
category: ["node"]
pubDate: "2024-04-06"
published: true
---

## Table of Contents

# Introduction

Node.js core modules are pre-built blocks of functionality that come bundled with the Node.js installation. They provide essential tools for common development tasks, saving you time and effort from writing everything from scratch.

**Benefits of Using Core Modules**:

- **Convenience:** They're readily available without additional installation using npm (Node Package Manager).
- **Reliability:** These modules are well-tested and maintained by the Node.js core team.
- **Performance:** They are often optimized for efficient operation within the Node.js environment.

**Some Common Core Modules:**

# File System (fs)

**`fs` (File System):** Interact with the file system on your server. You can use it for:

- Reading and writing files
- Creating, renaming, and deleting files and directories
- Checking file and directory permissions

Here's an example that demonstrates basic file system operations using Node.js core modules:

**1. Reading a File:**

```javascript
const fs = require("fs");

const filePath = "my-file.txt";

// Read the file asynchronously
fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
  } else {
    console.log("File content:", data);
  }
});

console.log("This line is executed before the file is read"); // Non-blocking
```

**Explanation:**

- We require the `fs` module to access file system functionalities.
- We define the file path to be read (`'my-file.txt'`).
- `fs.readFile` is used to read the file asynchronously. It takes three arguments:
  - `filePath`: Path to the file to be read.
  - `'utf-8'`: Encoding format (defaults to 'utf-8' for text files).
  - `callback`: Function to be called when the operation finishes.
    - The `err` parameter contains any error that occurred during reading.
    - The `data` parameter contains the content of the file as a string (if successful).
- The `console.log` line before `fs.readFile` demonstrates non-blocking behavior. The main thread continues execution without waiting for the file read to complete.
- The callback function handles the result:
  - If there's an error (`err`), it's logged to the console.
  - If successful, the file data (`data`) is logged to the console.

**2. Writing a File:**

```javascript
const fs = require("fs");

const filePath = "new-file.txt";
const fileContent = "This is some new content for the file.";

// Write the file asynchronously
fs.writeFile(filePath, fileContent, "utf-8", (err) => {
  if (err) {
    console.error("Error writing file:", err);
  } else {
    console.log("File written successfully");
  }
});

console.log("This line is executed before the file is written"); // Non-blocking
```

**Explanation:**

- Similar to reading, we use `fs.writeFile` to write content to a file asynchronously. It takes four arguments:
  - `filePath`: Path to the file to be written.
  - `fileContent`: The data to be written to the file (string or buffer).
  - `'utf-8'`: Encoding format (defaults to 'utf-8' for text files).
  - `callback`: Function to be called when the operation finishes.
    - The `err` parameter contains any error that occurred during writing.
- The `console.log` line before `fs.writeFile` again demonstrates non-blocking behavior.
- The callback function handles the result:
  - If there's an error (`err`), it's logged to the console.
  - If successful, a message indicating successful writing is logged.

**3. Checking File Existence:**

```javascript
const fs = require("fs");

const filePath = "my-file.txt";

// Check if the file exists asynchronously
fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error("File does not exist");
  } else {
    console.log("File exists");
  }
});

console.log("This line is executed before the file check"); // Non-blocking
```

**Explanation:**

- `fs.access` is used to check if a file exists asynchronously. It takes three arguments:
  - `filePath`: Path to the file to be checked.
  - `fs.constants.F_OK`: Flag indicating we only want to check for existence.
  - `callback`: Function to be called when the operation finishes.
    - The `err` parameter contains an error if the file doesn't exist or there's another issue.
- The `console.log` line before `fs.access` demonstrates non-blocking behavior.
- The callback function handles the result:
  - If there's an error (`err`), it indicates the file doesn't exist.
  - If successful (no error), it indicates the file exists.

These are just basic examples. The `fs` module offers many more functionalities for file system operations in Node.js, including creating directories, renaming files, and deleting files. Remember to handle errors appropriately in your real-world applications.

# HyperText Transfer Protocol (http)

**`http` (HyperText Transfer Protocol):** Build web servers and clients:

- Create HTTP servers to handle incoming requests and send responses
- Make HTTP requests to other servers to fetch data from APIs or websites

Here's an example that demonstrates a basic HTTP server and client interaction in Node.js:

**1. HTTP Server (server.js):**

```javascript
const http = require("http");

const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, World!\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

**Explanation:**

- We require the `http` module to create an HTTP server.
- We define the hostname (`localhost`) and port (`3000`) on which the server will listen for incoming requests.
- The `http.createServer` function creates a server object. It takes a callback function that handles incoming requests.
  - The `req` parameter is an object representing the incoming HTTP request.
  - The `res` parameter is an object used to send a response back to the client.
- Inside the callback function:
  - We set the response status code to 200 (OK).
  - We set the response header `Content-Type` to `text/plain`, indicating plain text content.
  - We use `res.end` to send the response content ("Hello, World!") and close the connection.
- The `server.listen` method starts the server, listening on the specified hostname and port. It also takes a callback function that executes when the server starts successfully.

**2. HTTP Client (client.js):**

```javascript
const http = require("http");

const hostname = "localhost";
const port = 3000;

const request = http.get(`http://${hostname}:${port}/`, (response) => {
  console.log(`statusCode: ${response.statusCode}`);
  console.log("headers:", response.headers);

  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});

request.on("error", (error) => {
  console.error(error);
});
```

**Explanation:**

- We require the `http` module again to make an HTTP request.
- We define the hostname (`localhost`) and port (`3000`) of the server we want to connect to.
- The `http.get` function initiates an HTTP GET request to the specified URL. It takes two arguments:
  - The URL of the server to connect to.
  - A callback function that executes when the server responds.
- Inside the callback function (`response`):
  - We log the response status code (`response.statusCode`).
  - We log the response headers (`response.headers`).
  - We use the `response.on('data')` event listener to handle incoming data chunks from the server.
    - Inside the event listener, we convert the data chunk (Buffer) to a string and log it to the console.
- The `request.on('error')` event listener handles any errors that occur during the request.

**Running the Example:**

1. Save the server code as `server.js` and the client code as `client.js`.
2. Run the server: `node server.js` (This keeps the server running in the background).
3. Run the client: `node client.js`.

The client should output the response status code (200), headers, and the response content ("Hello, World!").

**Note:** This is a very basic example. Real-world HTTP servers and clients often involve more complex interactions, including handling different HTTP methods (GET, POST, etc.), parsing request bodies, and sending more comprehensive responses.

# Path Manipulation (path)

**`path` (Path Manipulation):** Work with file and directory paths in a platform-independent way:

- Construct valid file paths across different operating systems (Windows, macOS, Linux)
- Extract components from a path (e.g., filename, extension, directory)
- Join path segments to create a complete path

Here's an example demonstrating how to use the `path` module for manipulating file and directory paths in Node.js:

```javascript
const path = require("path");

// Example path
const filePath = "Users/john/documents/report.txt";

// Get the filename
const filename = path.basename(filePath);
console.log("Filename:", filename); // Output: report.txt

// Get the directory name
const dirname = path.dirname(filePath);
console.log("Directory:", dirname); // Output: Users/john/documents

// Get the file extension
const extname = path.extname(filePath);
console.log("Extension:", extname); // Output: .txt

// Join path segments
const newFilePath = path.join(__dirname, "data", "new-file.csv");
console.log("New file path:", newFilePath); // Output: (your current directory path)/data/new-file.csv

// Normalize a path (handles "..")
const normalizedPath = path.normalize("/users/./john/../public/main.js");
console.log("Normalized path:", normalizedPath); // Output: /users/public/main.js

// Check if a path is absolute
const isAbsolute = path.isAbsolute(filePath);
console.log("Is absolute path:", isAbsolute); // Output: false
```

**Explanation:**

1. **Require `path` Module:** We require the `path` module to access its functionalities.

2. **Example Path:** We define a sample file path (`filePath`) for demonstration.

3. **`basename`:** This function extracts the filename from the provided path, excluding the directory path.

4. **`dirname`:** This function extracts the directory name from the provided path, excluding the filename.

5. **`extname`:** This function extracts the file extension (including the dot) from the provided path.

6. **`path.join`:** This function joins multiple path segments into a single normalized path. It's platform-independent and handles separators appropriately. In this case, we use `__dirname` (current directory path) to construct a new file path within the `data` directory.

7. **`path.normalize`:** This function normalizes a given path by resolving occurrences of ".." or "." in the path. This can be useful for handling relative paths that might contain these components.

8. **`path.isAbsolute`:** This function checks if a given path is an absolute path (starts with a drive letter on Windows or a forward slash on Unix-like systems).

**Remember:**

- Replace `'Users/john/documents/report.txt'` with your actual file path if needed.
- The `__dirname` variable refers to the directory path of the currently executing JavaScript file.

By understanding these functions, you can effectively manipulate file and directory paths in your Node.js applications, ensuring platform-independent behavior and proper path handling.

# Event Emitter

**`events` (Event Emitter):** Create applications that react to various events and user interactions:

- Create objects that can emit events (signals)
- Define event listeners (functions) that get triggered when specific events occur

Here's an example of an event emitter in Node.js that demonstrates communication between different parts of your application:

**1. Event Emitter Class (EventEmitter.js):**

```javascript
const { EventEmitter } = require("events");

class MyEventEmitter extends EventEmitter {
  constructor() {
    super();
  }

  emitError(errorMessage) {
    this.emit("error", errorMessage);
  }

  emitData(data) {
    this.emit("data", data);
  }
}

module.exports = MyEventEmitter;
```

**Explanation:**

- We import the `EventEmitter` class from the `events` module.
- We create a custom class `MyEventEmitter` that extends the `EventEmitter` class.
- The constructor inherits functionalities from the parent class.
- We define two methods:
  - `emitError` takes an error message and emits an `'error'` event with that message.
  - `emitData` takes some data and emits a `'data'` event with that data.

**2. Usage Example (main.js):**

```javascript
const MyEventEmitter = require("./EventEmitter");

const emitter = new MyEventEmitter();

// Listener function for the 'error' event
emitter.on("error", (errorMessage) => {
  console.error("Error:", errorMessage);
});

// Listener function for the 'data' event
emitter.on("data", (data) => {
  console.log("Data received:", data);
});

// Emit events from somewhere in your application
emitter.emitError("Something went wrong!");
emitter.emitData("This is some important data");
```

**Explanation:**

- We require the `MyEventEmitter` class from the separate file (assuming it's saved as `EventEmitter.js`).
- We create an instance of `MyEventEmitter` called `emitter`.
- We use `emitter.on('error', callback)` to attach a listener function for the `'error'` event. The callback function receives the error message emitted.
- We use `emitter.on('data', callback)` to attach a listener function for the `'data'` event. The callback function receives the data emitted.
- Later in your application (or from another module), you can call the `emitError` and `emitData` methods on the `emitter` instance to trigger the corresponding events and notify the listeners.

**Benefits of Event Emitters:**

- **Decoupling:** Event emitters promote loose coupling between different parts of your application. Components can listen for events without knowing the specific source of the event.
- **Modular Design:** They encourage modular design by allowing you to separate event handling logic from the code that emits the events.
- **Scalability:** They can simplify communication in complex applications with many components that need to interact.

**In essence:**

Event emitters provide a flexible way to create event-driven applications in Node.js. By emitting and listening to events, you can establish communication channels between different parts of your code, making it more organized and responsive.

# URL

**`url` (URL Parsing):** Parse and manipulate URLs:

- Break down a URL into its components (protocol, hostname, port, path, query string)
- Construct valid URLs from separate components
- Encode and decode URL components for safe transmission

Here's an example of URL parsing in Node.js using the built-in `url` module:

```javascript
const url = require("url");

const fullUrl =
  "https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash";

// Parse the URL
const parsedUrl = url.parse(fullUrl, true); // Set 'true' for query object

console.log("Protocol:", parsedUrl.protocol); // Output: https:
console.log("Username:", parsedUrl.username); // Output: user
console.log("Password:", parsedUrl.password); // Output: pass
console.log("Hostname:", parsedUrl.hostname); // Output: sub.example.com
console.log("Port:", parsedUrl.port); // Output: 8080
console.log("Pathname:", parsedUrl.pathname); // Output: /p/a/t/h
console.log("Query:", parsedUrl.query); // Output: { query: 'string' } (object with key-value pairs)
console.log("Hash:", parsedUrl.hash); // Output: #hash

// Access specific query string parameters
console.log("Query parameter (query):", parsedUrl.query.query); // Output: string
```

**Explanation:**

1. **Require `url` Module:** We require the `url` module to access URL parsing functionalities.

2. **Define a URL:** We define a sample URL (`fullUrl`) that includes various components like protocol, username, password, hostname, port, pathname, query string, and hash.

3. **`url.parse`:** This function parses the provided URL string and returns an object containing its components. The second argument (`true`) specifies that we want the query string to be parsed into an object with key-value pairs (instead of a single string).

4. **Accessing URL Components:** We access individual URL components using properties on the `parsedUrl` object:

   - `protocol`: The protocol (e.g., "http:", "https:").
   - `username`: The username portion of the URL credentials (if present).
   - `password`: The password portion of the URL credentials (if present).
   - `hostname`: The hostname or domain name.
   - `port`: The port number (if specified, defaults to 80 for http and 443 for https).
   - `pathname`: The path portion of the URL (the path to a resource on the server).
   - `query`: An object containing key-value pairs representing the query string parameters (if present).
   - `hash`: The hash fragment part of the URL (starting with "#").

5. **Accessing Query String Parameters:** If the URL includes a query string, the `query` property becomes an object where each key-value pair is represented as a property-value pair within the object. We can access specific parameters using their names.

**Remember:**

- This example demonstrates parsing a complete URL. You can use `url.parse` with incomplete URLs as well, and it will return the available components.
- Be cautious when accessing username and password information from URLs, as they might be transmitted in plain text and are not secure.

By understanding URL parsing, you can effectively extract information from URLs in your Node.js applications, allowing you to process data based on specific URL components or query string parameters.

# Conclusion

This was a more difficult post to digest but hopefully it can help you understand the different parts that makes Node JS core modules. Seeing them in action should give you a better understanding them and don't be afraid to re-read this post as much as you need even before interviews to help you out.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
