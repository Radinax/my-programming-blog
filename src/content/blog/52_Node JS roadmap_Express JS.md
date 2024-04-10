---
title: "[Roadmap_Node] 8_Express.js"
description: "Let us talk about the most famous Node framework, express js, why its so popular and what problems does it solve"
category: ["node"]
pubDate: "2024-04-07T08:00:00-04:00"
published: true
---

## Table of content

# Introduction

Express.js is a popular web framework built on top of Node.js for building web applications and APIs. It provides a robust set of features for efficient web development, making it a widely used choice. Here's a quick introduction:

**What is Express.js?**

- **Framework, not a library:** Express.js is a framework that sits on top of Node.js, providing a structured way to create web applications. It offers more than just the core functionalities of Node.js, including features for routing, middleware, templating, and more.

- **Minimalist and Flexible:** Unlike some frameworks that enforce a specific structure, Express.js is known for its minimalist approach. It provides a core set of features, allowing you to choose the tools and libraries that best suit your project's needs.

- **Focus on Web Features:** Express.js is geared towards building web applications and APIs. It offers functionalities like routing to handle different URL paths, middleware for processing requests and responses, and templating engines to generate dynamic HTML content.

**Benefits of using Express.js:**

- **Faster Development:** Express.js streamlines web development by providing pre-built functionalities for common tasks. You can focus on your application's logic without reinventing the wheel.

- **Clean and Organized Code:** The structure and features of Express.js encourage writing clean, maintainable, and modular code.

- **Large Community and Ecosystem:** Express.js has a vast and active community that contributes to its development and offers a wide range of third-party libraries and tools that extend its capabilities.

- **Flexibility:** As mentioned earlier, Express.js allows you to choose the tools you need. You can integrate various templating engines, database drivers, and other middleware components to create a customized web application stack.

**Here are some core functionalities of Express.js:**

- **Routing:** Define how your application responds to different URL requests (like GET, POST, etc.)
- **Middleware:** Functions that process requests and responses, allowing you to perform tasks like logging, authentication, or data parsing before they reach your application's core logic.
- **Templating:** Generate dynamic HTML content using templating engines like EJS, Pug, or Handlebars.
- **Static File Serving:** Serve static files like images, CSS, and JavaScript from a designated directory.

**Overall, Express.js is a powerful and versatile framework that simplifies web development in Node.js. If you're building web applications or APIs, Express.js is definitely worth considering!**

# Routing

Routing is a fundamental concept in Express.js that allows your web application to respond to different HTTP requests based on their URL paths and methods (like GET, POST, etc.). It essentially defines how your application handles incoming traffic and directs it to the appropriate logic for processing.

**Here's a breakdown of routing in Express.js:**

1. **Route Definition:**

   - You use Express.js methods like `get`, `post`, `put`, `delete`, etc., to define routes. These methods take two arguments:
     - The URL path (pattern) for which the route applies. This can be a simple path or a more complex pattern using regular expressions.
     - A callback function (handler) that is executed when a request matches the route. This function typically handles the request logic, like sending a response, interacting with a database, or performing other actions.

2. **Matching Requests:**

   - When a request arrives at your Express.js application, the routing system compares the requested URL path and method with the defined routes.
   - If a match is found, the corresponding route handler function is invoked to handle the request.

3. **Route Handlers:**

   - The route handler function is responsible for processing the request. It has access to the request object (containing information about the request like headers, body, parameters) and the response object (used to send a response back to the client).

**Example:**

```javascript
const express = require("express");
const app = express();

// Route for the homepage (/) using the GET method
app.get("/", (req, res) => {
  res.send("Hello from the homepage!");
});

// Route for a specific product page (/products/:id) using the GET method with a dynamic parameter
app.get("/products/:id", (req, res) => {
  const productId = req.params.id; // Access dynamic parameter value
  // Logic to fetch product details based on ID and send a response
  res.send(`Product details for ID: ${productId}`);
});

// Start the server and listen for requests
app.listen(3000, () => console.log("Server listening on port 3000"));
```

Here are examples of routing in Express.js using the common HTTP methods for creating, updating, and deleting resources:

**1. POST Request (Create):**

This route typically handles creating a new resource on the server.

```javascript
const express = require("express");
const app = express();

// Example data model (replace with your actual data storage)
const products = [];

app.post("/products", (req, res) => {
  const newProduct = req.body; // Access data from the request body
  products.push(newProduct); // Add the new product to the data model (replace with database interaction)
  res
    .status(201)
    .json({ message: "Product created successfully!", product: newProduct });
});

// Start the server and listen for requests
app.listen(3000, () => console.log("Server listening on port 3000"));
```

**2. PUT Request (Update):**

This route allows updating an existing resource completely, replacing all its data.

```javascript
app.put("/products/:id", (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  // Find the product by ID and update it (replace with database interaction)
  const productIndex = products.findIndex(
    (product) => product.id === productId
  );
  if (productIndex !== -1) {
    products[productIndex] = updatedProduct;
    res.json({
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } else {
    res.status(404).json({ message: "Product not found!" });
  }
});
```

**3. PATCH Request (Partial Update):**

This route allows updating a specific part of an existing resource.

```javascript
app.patch("/products/:id", (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;

  // Find the product by ID and update specific properties (replace with database interaction)
  const productIndex = products.findIndex(
    (product) => product.id === productId
  );
  if (productIndex !== -1) {
    Object.assign(products[productIndex], updateData); // Update specific properties
    res.json({
      message: "Product partially updated successfully!",
      product: products[productIndex],
    });
  } else {
    res.status(404).json({ message: "Product not found!" });
  }
});
```

**4. DELETE Request (Delete):**

This route allows deleting an existing resource.

```javascript
app.delete("/products/:id", (req, res) => {
  const productId = req.params.id;

  // Find the product by ID and remove it (replace with database interaction)
  const productIndex = products.findIndex(
    (product) => product.id === productId
  );
  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    res.json({ message: "Product deleted successfully!" });
  } else {
    res.status(404).json({ message: "Product not found!" });
  }
});
```

**Remember:** These are simplified examples using an in-memory data model. In a real application, you'd likely use a database for data persistence and implement proper error handling and validation for requests.

**Key Points:**

- You can define multiple routes for different URL patterns and methods.
- Route handlers can perform various tasks like sending HTML content, JSON data, or redirecting users to other pages.
- Express.js also supports middleware functions that can be used to intercept requests and responses before they reach route handlers. Middleware can be used for tasks like authentication, logging, or parsing request data.

**Routing in Express.js provides a structured and flexible way to handle different functionalities within your web application. By effectively using routes, you can create well-organized and maintainable applications that respond appropriately to user requests.**

# Middlewares

In Express.js, middleware are functions that intercept requests and responses traveling through the application's lifecycle. They sit between the incoming request and the final response, allowing you to perform actions on the request and response objects before they reach your route handlers or are sent back to the client.

Here's a breakdown of middleware in Express.js:

**Core functionalities of middleware:**

- **Request Manipulation:** You can modify the request object by adding properties, parsing data from the request body, or validating user input.
- **Response Manipulation:** Modify the response object by setting headers, adding data to the body, or changing the status code.
- **Common Tasks:** Middleware can be used for various common tasks in web applications, including:
  - Authentication and authorization
  - Logging requests and responses
  - Parsing data from different request formats (like JSON)
  - Serving static files
  - Implementing functionalities like rate limiting or error handling

**Defining and Using Middleware:**

1. **Middleware Function:** Middleware functions typically take three arguments:

   - `req`: The request object containing information about the incoming request.
   - `res`: The response object used to send a response back to the client.
   - `next`: A function that allows the middleware to pass control to the next middleware function in the chain or the final route handler.

2. **Express.js Middleware Registration:** You can register middleware functions with the Express.js app object using various methods depending on their scope:

   - **Application-level middleware:** Applies to all requests entering your application. Use `app.use()`.
   - **Router-level middleware:** Applies to all routes defined within a specific router instance. Use `router.use()`.
   - **Route-specific middleware:** Applies only to a particular route or group of routes. Use middleware functions as arguments within route definitions (e.g., `app.get('/users', someMiddleware, handlerFunction)`).

**Example (Logging Middleware):**

```javascript
const express = require("express");
const app = express();

function logRequest(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass control to the next middleware or route handler
}

app.use(logRequest); // Apply logging middleware to all requests

app.get("/", (req, res) => {
  res.send("Hello from Express.js!");
});

app.listen(3000, () => console.log("Server listening on port 3000"));
```

**Middleware Order:**

Middleware functions are executed in the order they are registered. This allows you to chain multiple middleware functions to achieve complex functionalities.

**Benefits of Middleware:**

- **Modular Code:** Middleware promotes code reusability and separation of concerns. You can create reusable middleware functions for common tasks.
- **Improved Maintainability:** By centralizing logic in middleware, your route handlers become cleaner and more focused on core application functionality.
- **Flexibility:** Middleware allows you to customize the behavior of your application at different points in the request-response cycle.

**Overall, middleware is a powerful concept in Express.js that empowers you to create robust, maintainable, and feature-rich web applications.**

# Template Engines

Express.js itself doesn't handle generating dynamic HTML content. That's where template engines come in. Template engines are tools that work alongside Express.js to create HTML pages that can dynamically include data from your application.

Here's a breakdown of template engines in Express.js:

**What are Template Engines?**

- Template engines provide a way to define the structure of your HTML content using template files. These files contain a mix of HTML code and special syntax specific to the template engine you're using.
- The template engine interprets these files and injects your application's dynamic data (variables, objects, etc.) into the template, generating the final HTML content that is sent to the client.

**Popular Template Engines for Express.js:**

- **EJS (Embedded JavaScript):** A popular choice known for its simplicity and similarity to HTML syntax. It allows embedding JavaScript code directly within the template for dynamic logic.
- **Pug (formerly Jade):** Offers a concise and readable syntax for defining your HTML structure. It separates code from content, promoting cleaner templates.
- **Handlebars:** Another popular option with a focus on expressiveness and maintainability. It uses a mustache-style syntax for embedding logic within templates.

**Using Template Engines with Express.js:**

1. **Choose a Template Engine:** Select a template engine that suits your project's needs and preferences.
2. **Install the Engine:** Install the required package for your chosen template engine using npm or yarn (e.g., `npm install ejs`).
3. **Configure Express.js:** Set the template engine for your Express.js app using `app.set('view engine', 'ejs')` (replace 'ejs' with your chosen engine's name).
4. **Create Template Files:** Create template files with the appropriate extension for your engine (e.g., `.ejs` for EJS).
5. **Render Templates in Routes:** Use the `res.render` method within your route handlers to specify the template file and any data to be passed to the template for rendering.

**Example (Using EJS):**

```javascript
const express = require("express");
const app = express();
const ejs = require("ejs"); // Install EJS package

app.set("view engine", "ejs"); // Set EJS as the template engine

app.get("/", (req, res) => {
  const name = "John Doe"; // Example data
  res.render("index", { name }); // Render the 'index.ejs' template with data
});

app.listen(3000, () => console.log("Server listening on port 3000"));
```

**Template files (index.ejs):**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Express.js!</title>
  </head>
  <body>
    <h1>Hello, <%= name %>!</h1>
  </body>
</html>
```

**Benefits of Template Engines:**

- **Dynamic HTML Generation:** Create HTML pages that can adapt to different situations based on your application's data.
- **Separation of Concerns:** Keep your HTML structure and presentation logic separate from your application code for better maintainability.
- **Improved Developer Experience:** Template engines can simplify the process of creating dynamic web pages compared to manually writing HTML with embedded JavaScript.

**Remember:** Choose the template engine that best suits your project's requirements and your development preferences. There are many other template engines available beyond the ones mentioned here!

# RESTful APIs

RESTful APIs (or Representational State Transfer APIs) built with Express.js adhere to a set of architectural principles that promote clean and scalable interactions between web applications. Here's a breakdown of how RESTful APIs work with Express.js:

**RESTful API Concepts:**

- **Resources:** Represent data entities within your application (like users, products, orders, etc.).
- **HTTP Methods:** REST APIs leverage specific HTTP methods to perform CRUD (Create, Read, Update, Delete) operations on resources:
  - GET: Retrieve data about a resource.
  - POST: Create a new resource.
  - PUT: Update an existing resource completely.
  - PATCH: Update a specific part of an existing resource.
  - DELETE: Delete a resource.
- **URLs:** URLs in RESTful APIs typically reflect the resource hierarchy and often include unique identifiers for specific resources.

**Building RESTful APIs with Express.js:**

1. **Routing:** Use Express.js routing to define endpoints for different resources and HTTP methods:
   - Define routes using methods like `app.get`, `app.post`, etc., specifying the URL path and a callback function (handler).
2. **Request and Response Objects:** The handler function receives the `req` (request) and `res` (response) objects.
   - `req`: Contains information about the incoming request, including the HTTP method, URL parameters, and request body data.
   - `res`: Used to send a response back to the client, including data, status codes, and headers.
3. **Data Formats:** RESTful APIs typically use JSON format for data exchange, making them language-agnostic and easier to integrate with different clients.

**Example (Simple REST API for Products):**

```javascript
const express = require("express");
const app = express();
const products = [
  // Example data (replace with database interaction)
  { id: 1, name: "Product A", price: 10 },
  { id: 2, name: "Product B", price: 15 },
];

// Get all products (GET /products)
app.get("/products", (req, res) => {
  res.json(products);
});

// Get a specific product by ID (GET /products/:id)
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const product = products.find((p) => p.id === +productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Create a new product (POST /products)
app.post("/products", (req, res) => {
  const newProduct = req.body;
  // Implement validation and data persistence logic (replace with database interaction)
  newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
  products.push(newProduct);
  res
    .status(201)
    .json({ message: "Product created successfully!", product: newProduct });
});

// ... Implement PUT, PATCH, and DELETE routes for updating and deleting products

app.listen(3000, () => console.log("Server listening on port 3000"));
```

**Benefits of RESTful APIs:**

- **Standardized Approach:** RESTful APIs follow well-defined principles, making them easier to understand, develop, and consume by different clients.
- **Scalability:** The resource-based structure promotes scalability as your API grows with new functionalities.
- **Maintainability:** Clear separation of concerns between resources and operations improves code maintainability.

**Additional Considerations:**

- **Error Handling:** Implement proper error handling mechanisms to provide informative messages to API consumers in case of errors.
- **Authentication and Authorization:** Secure your API with mechanisms like authentication and authorization to control access to resources.
- **Database Integration:** In a real application, you'd likely use a database to store and manage your data instead of the in-memory example provided here.

**Overall, Express.js provides a robust foundation for building RESTful APIs that are well-structured, scalable, and easy to integrate with various clients.**

# Error Handling Middleware

Error handling middleware in Express.js is a crucial aspect of building robust and user-friendly web applications. It allows you to intercept errors that occur during request processing and provide appropriate responses to the client. Here's a breakdown of error handling middleware in Express.js:

**Importance of Error Handling Middleware:**

- **Graceful Error Handling:** Prevents your application from crashing due to unexpected errors.
- **Informative Responses:** Provides meaningful error messages to the client, helping them understand the issue.
- **Improved User Experience:** Ensures a smooth user experience by handling errors gracefully and avoiding cryptic error messages.
- **Debugging:** Error messages can provide valuable clues for debugging issues within your application.

**How Error Handling Middleware Works:**

1. **Middleware Function:** Error handling middleware functions are regular Express.js middleware functions that take four arguments:

   - `err`: The error object containing information about the error that occurred.
   - `req`: The request object.
   - `res`: The response object.
   - `next`: The next function in the middleware chain (usually not used in error handling middleware).

2. **Error Handling Logic:** Within the middleware function, you can:

   - **Log the Error:** Use `console.error` or a logging library to record the error for debugging purposes.
   - **Set the Response Status Code:** Set the appropriate HTTP status code based on the nature of the error (e.g., 400 for Bad Request, 500 for Internal Server Error).
   - **Send an Error Response:** Send a JSON response object containing details about the error message, or a user-friendly error page.

3. **Registration:** Register the error handling middleware function with the Express.js app object using `app.use()`. This ensures it's executed whenever an error occurs during request processing.

**Example (Basic Error Handling Middleware):**

```javascript
const express = require("express");
const app = express();

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).json({ message: "Internal Server Error" });
});

// Your application routes...

app.listen(3000, () => console.log("Server listening on port 3000"));
```

**Custom Error Handling:**

You can create custom error objects with specific properties to provide more informative error messages:

```javascript
class MyCustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

app.use((err, req, res, next) => {
  if (err instanceof MyCustomError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    // Handle other errors
  }
});
```

**Best Practices:**

- **Position the Middleware:** Place the error handling middleware at the very bottom of your middleware stack, ensuring it catches errors from all preceding middleware and routes.
- **Specific vs. General Errors:** Consider creating custom error classes for specific error scenarios to provide more informative messages to the client.
- **Production vs. Development:** In development, you might want to provide more detailed error messages for debugging. In production, prioritize user-friendly messages without exposing sensitive information.

**Error handling middleware is an essential tool for building reliable and user-friendly Express.js applications. By implementing proper error handling, you can ensure your application gracefully handles unexpected situations and provides a positive user experience.**

# Conclusion

Express JS is the most famous Node framework in the world, while there are some popular alternatives like NESTJS, Express knowledge will transfer easily to other frameworks, we're gonna into another post on how to get started in an Express project since its steps can be like a recipe for installing the right modules

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
