---
title: "[Roadmap_Node] 3_Node.js Modules"
description: "Let us talk about Node Modules and how it works"
category: ["node"]
pubDate: "2024-04-04"
published: true
---

# Introduction

Node.js modules are essentially the building blocks of your Node.js applications. They are reusable pieces of JavaScript code that provide specific functionalities. Here's a breakdown of key concepts:

**What are they?**

- Imagine Node.js applications like houses. Modules are like pre-built bricks or components (doors, windows, plumbing) that you can use to construct your house (application) with desired features.
- Each module is typically a single JavaScript file (`.js`) or a directory containing multiple files.
- Modules can export functions, variables, or classes that your main application code can then import and use.

**Why use them?**

- **Code Reusability:** Modules prevent you from writing the same code repeatedly. You can create a module for a common function and reuse it across your entire application or even in different projects.
- **Organization:** Modules help keep your code organized and modular, making it easier to understand, maintain, and test.
- **Leveraging Existing Functionality:** The vast Node.js ecosystem offers a multitude of pre-written modules (packages) on the Node Package Manager (npm) that provide functionalities for various tasks like file I/O, networking, databases, web frameworks, and more. You can easily install and utilize these modules in your projects.

**Types of Modules:**

- **Core Modules:** These are built-in modules that come with Node.js by default, providing essential functionalities like file system access, http server creation, and event handling.
- **Third-Party Modules:** These are modules created and shared by the Node.js community and published on npm. You can install them using the `npm install` command to access a wide range of features and libraries.

**How to Use Them:**

1. **Importing Modules:** You use the `require()` function to import modules into your application code.
2. **Using Exported Functionality:** Once imported, you can access the exported functions, variables, or classes from the module and use them in your code.

**Example:**

```javascript
// file1.js (a module)
function greet(name) {
  console.log(`Hello, ${name}!`);
}

module.exports = greet; // Exporting the greet function

// file2.js (main application code)
const greet = require("./file1"); // Importing the greet function

greet("World"); // Using the imported function
```

In summary, Node.js modules are fundamental to building well-structured and reusable Node.js applications. They promote code organization, efficiency, and leverage the vast ecosystem of pre-written functionalities available on npm.

# CommonJS Modules (require, module.exports)

CommonJS Modules (CJS) are the traditional way of structuring and sharing JavaScript code in Node.js applications. They rely on two key concepts:

**1. `require()`:**

- This function is used to import modules into your JavaScript code.
- When you call `require()`, it loads the specified module's code and returns its exported value.
- The module path can be either a relative path (e.g., `./myModule.js`) or an absolute path (e.g., `/usr/lib/node_modules/myModule`).

**2. `module.exports`:**

- This is a special object within a module that allows you to specify what functionalities you want to make available for other parts of your application to import and use.
- You can assign functions, variables, or objects to `module.exports` to define the module's public interface.

**Example:**

```javascript
// myModule.js (a module)

function add(a, b) {
  return a + b;
}

module.exports = add; // Exporting the add function

// main.js (main application code)

const add = require("./myModule"); // Importing the add function

const result = add(5, 3);
console.log(result); // Output: 8
```

In this example:

- `myModule.js` defines an `add` function and exports it using `module.exports`.
- `main.js` imports the `add` function using `require()`.
- The imported function can then be used within `main.js`.

**Benefits of CommonJS Modules:**

- **Modularization:** They promote well-organized code by separating functionalities into reusable modules.
- **Code Reusability:** Modules can be reused across different parts of your application or even in other projects.
- **Namespace Management:** They help avoid naming conflicts by providing a way to define a module's public interface through `module.exports`.

**Drawbacks of CommonJS Modules:**

- **Synchronous Loading:** `require()` loads modules synchronously, which can block your code's execution momentarily. This might be an issue in performance-critical situations.
- **CJS modules are not inherently lazy-loaded**, meaning they are loaded entirely during import, regardless of whether their functionality is used immediately.
- **Circular Dependencies:** If modules rely on each other in a circular fashion, it can lead to issues during loading.

**CommonJS vs. ECMAScript Modules (ESM):**

- While CommonJS is the traditional format, Node.js now also supports ECMAScript Modules (ESM) introduced in ES6 (ECMAScript 2015).
- ESM uses `import` and `export` statements for module management.
- ESM offers advantages like asynchronous loading and better handling of circular dependencies.
- However, CommonJS modules are still widely used in existing Node.js projects, and tools like Babel can be used to transpile ESM code to CJS format for compatibility.

# ES6 Modules (import, export)

ES6 Modules (ECMAScript 2015 Modules), also known as ECMAScript Modules (ESM), are a more modern approach to structuring and sharing JavaScript code compared to CommonJS Modules (`require`, `module.exports`). They introduce the `import` and `export` keywords for module definition and usage.

**Key Concepts:**

- **`import`:** This statement is used to import functionalities from other modules into your current code.
- **`export`:** This keyword allows you to define what parts of your code (functions, variables, classes) should be accessible for import by other modules.

**Benefits:**

- **Modularization:** Similar to CommonJS, ES6 modules promote code organization and reusability.
- **Static Imports:** Imports are declared directly within the code, improving readability and maintainability.
- **Asynchronous Loading (Optional):** ES6 modules can be loaded asynchronously, potentially improving performance in certain scenarios.
- **Better Handling of Circular Dependencies:** The module system helps manage circular dependencies more effectively compared to CommonJS.

**Syntax:**

```javascript
// Module A (moduleA.js)
export function greet(name) {
  console.log(`Hello, ${name}!`);
}

// Module B (moduleB.js)
import { greet } from "./moduleA"; // Named import

greet("World"); // Using the imported function
```

In this example:

- `moduleA.js` defines a `greet` function and exports it using `export`.
- `moduleB.js` imports the `greet` function using `import`. Here, `{ greet }` is a named import, specifying which function to import.
- The imported function can then be used within `moduleB.js`.

**Types of Exports:**

- **Default Export:** You can export a single value (function, variable, object) as the default export from a module.
- **Named Exports:** You can export multiple functions, variables, or classes from a module with individual names.

**Drawbacks:**

- **Limited Browser Support (Initially):** Earlier versions of some browsers didn't natively support ES6 modules, requiring transpilation for broader browser compatibility. This is less of a concern with modern browsers.
- **Potential for Build Tool Dependency:** Depending on your project setup, you might need a build tool to handle module bundling and transpilation for older browsers.

**CommonJS vs. ES6 Modules:**

The choice between CommonJS and ES6 modules depends on your project's needs and preferences. Here's a quick comparison:

| Feature                 | CommonJS Modules (require, module.exports) | ES6 Modules (import, export) |
| ----------------------- | ------------------------------------------ | ---------------------------- |
| Syntax                  | `require()`, `module.exports`              | `import`, `export`           |
| Loading                 | Synchronous                                | Optional: Asynchronous       |
| Circular Dependencies   | Can be tricky to manage                    | Handled more effectively     |
| Browser Support (Early) | Generally better                           | More limited (improved now)  |

**In summary:**

ES6 Modules offer a modern and potentially more efficient way to structure and manage modules in Node.js applications. Their asynchronous loading capabilities and improved handling of circular dependencies can be beneficial in certain scenarios. However, CommonJS modules are still widely used in existing projects, and both formats have their place depending on your specific requirements.

# Built-in Modules (e.g., fs, http, events)

Node.js provides a rich set of built-in modules that offer essential functionalities for various development tasks. These modules come pre-installed with Node.js and don't require additional installation using npm (Node Package Manager). Here are some of the most commonly used built-in modules:

**1. `fs` (File System):**

- This module provides a set of functions for interacting with the file system on your server. You can use it to perform actions like:
  - Reading and writing files
  - Creating, renaming, and deleting files and directories
  - Checking file and directory permissions

**2. `http` (HyperText Transfer Protocol):**

- This module allows you to create both HTTP servers and clients. With `http`, you can:
  - Build web servers to handle incoming HTTP requests and send responses
  - Make HTTP requests to other servers to fetch data from APIs or websites

**3. `path` (Path Manipulation):**

- This module offers functions for working with file and directory paths in a platform-independent way. It helps you:
  - Construct valid file paths across different operating systems (Windows, macOS, Linux)
  - Extract components from a path (e.g., filename, extension, directory)
  - Join path segments to create a complete path

**4. `events` (Event Emitter):**

- This module provides a powerful mechanism for handling events in Node.js applications. It allows you to:
  - Create objects that can emit events (signals)
  - Define event listeners (functions) that get triggered when specific events occur
  - Build applications that react to various events and user interactions

**5. `url` (URL Parsing):**

- This module provides functions for parsing and manipulating URLs. You can use it to:
  - Break down a URL into its components (protocol, hostname, port, path, query string)
  - Construct valid URLs from separate components
  - Encode and decode URL components for safe transmission

**6. Other Built-in Modules:**

- `os`: Provides information about the operating system your Node.js application is running on.
- `crypto`: Offers cryptographic functionalities for hashing, encryption, and decryption.
- `readline`: Enables you to read input from the command line in a user-friendly way.
- Many more!

**Benefits of Using Built-in Modules:**

- **Convenience:** They are readily available without additional installation.
- **Reliability:** These modules are well-tested and maintained by the Node.js core team.
- **Performance:** They are often optimized for efficient operation within the Node.js environment.

**How to Use Built-in Modules:**

To use a built-in module, you require it at the beginning of your JavaScript file using the `require()` function:

```javascript
const fs = require("fs");

fs.readFile("myfile.txt", "utf-8", (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
});
```

**In conclusion:**

Node.js built-in modules provide a solid foundation for building various server-side applications. Understanding their functionalities empowers you to handle file system interactions, create web servers, parse URLs, manage events, and perform many other essential tasks without relying on external libraries.

# Conclusion

We learned about Node Modules and some useful features like common JS, ES6 and the built in modules like `fs`, `http`, `events`, etc.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
