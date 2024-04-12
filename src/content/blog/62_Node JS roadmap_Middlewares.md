---
title: "[Roadmap_Node] 18_Middleware and Custom Modules"
description: "Let us talk about .Middleware and Custom Modules"
category: ["node"]
pubDate: "2024-04-09T08:00:00-04:00"
published: true
---

In Node.js applications, middleware acts as an intermediary between the incoming request and the final response. It's a function that has access to the request object (`req`), the response object (`res`), and the `next` function in the request-response cycle. Here's a breakdown of middleware concepts:

**Functionality:**

- **Intercept and modify requests:** Middleware can inspect incoming requests, extract data, manipulate headers, or validate input before it reaches the route handler.
- **Perform common tasks:** You can create reusable middleware functions to handle common tasks like logging, authentication, authorization, error handling, parsing request bodies, and more.
- **Modularize code:** Middleware promotes code organization by separating cross-cutting concerns from route handlers, leading to cleaner and more maintainable code.

**Example:**

```javascript
// Middleware to log incoming requests
function logRequest(req, res, next) {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware or route handler
}

// Middleware to authenticate users (replace with actual authentication logic)
function authenticate(req, res, next) {
  const authorized = req.headers.authorization === "secret";
  if (authorized) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// Route handler for a protected resource
app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "You are authorized!" });
});
```

**How to Use Middleware:**

- Express.js, a popular Node.js web framework, provides built-in functions like `app.use()` to register middleware functions.
- You can define middleware functions globally (applied to all requests) or locally (applied to specific routes).

## Custom Modules in Node.js

Custom modules are reusable blocks of code that you create and export from JavaScript files. These modules can contain functions, variables, or classes that you can import and use in other parts of your application.

**Benefits:**

- **Code Reuse:** Avoid code duplication by creating modules encapsulating common functionality.
- **Organization:** Break down your application logic into smaller, reusable units, improving code organization and maintainability.
- **Separation of Concerns:** Separate modules promote better separation of concerns, making code easier to understand and manage.

**Creating and Using Custom Modules:**

1. **Create a JavaScript file:** This file will contain your module's code (functions, variables, classes).
2. **Export functionality:** Use the `export` keyword to specify which parts of your module should be accessible from other files.
3. **Import the module:** In other JavaScript files, use the `import` statement to import the module and access its exported features.

**Example:**

```javascript
// utilities.js (custom module)
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

export { add, subtract }; // Export functions to be used elsewhere

// app.js (using the custom module)
import { add, subtract } from "./utilities.js";

const sum = add(5, 3);
const difference = subtract(10, 2);

console.log(`Sum: ${sum}, Difference: ${difference}`);
```

By effectively using middleware and custom modules, you can build cleaner, more organized, and maintainable Node.js applications.

# Conclusion

We learned about middlewares and how they're implemented, its a simple concept that's used a lot to simplify patterns.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
