---
title: "[Roadmap_Node] 17_RESTful API Design"
description: "Let us talk about RESTful API Design, its principles, concepts and applications in projects"
category: ["node"]
pubDate: "2024-04-09T07:00:00-04:00"
published: true
---

## Table of content

# Introduction

REST (Representational State Transfer) is an architectural style for designing APIs that adhere to a set of principles. These principles promote a clean, predictable, and scalable way for applications to interact with web resources.

**Key Concepts in RESTful APIs:**

- **Client-Server Model:** Separate concerns between clients (user interfaces or other applications) that make requests and servers that process those requests and send back responses.
- **Stateless Communication:** Each request from a client to the server should contain all the information necessary to understand the request, independent of any prior requests or server state.
- **Resources:** Represent data entities (like users, products, or tasks) that the API manages. Resources are identified by URIs (Uniform Resource Identifiers).
- **HTTP Methods:** Utilize standard HTTP methods to perform CRUD (Create, Read, Update, Delete) operations on resources:
  - `GET`: Retrieves a resource representation.
  - `POST`: Creates a new resource.
  - `PUT`: Updates a resource representation in its entirety.
  - `PATCH`: Updates a specific part of a resource representation.
  - `DELETE`: Deletes a resource.
- **Media Types:** Specify the format of the data being exchanged (often JSON or XML).

**Designing RESTful APIs with Node.js**

Node.js, with its event-driven, asynchronous nature, is a popular choice for building RESTful APIs. Here's a general process:

1. **Project Setup:**

   - Initialize a Node.js project directory.
   - Install required dependencies like Express.js (a popular web framework), a database driver (if needed), and any other necessary modules.

2. **API Definition:**

   - Plan your API endpoints, considering the resources and operations you want to expose.
   - Decide on naming conventions (e.g., plural nouns for resources) and versioning strategy.

3. **Server Code:**

   - Create an Express.js app instance.
   - Define routes for each API endpoint, mapping HTTP methods to handlers that process requests and send responses.
   - Use middleware for common tasks like parsing request bodies, authentication, and error handling.

4. **Data Access:**
   - Integrate a database (like MongoDB, PostgreSQL, or MySQL) to store and manage your API's data.
   - Use appropriate database drivers to interact with the database from your Node.js code.

**Example: A Simple Node.js REST API for Todos**

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // Assuming MongoDB

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/todos"); // Replace with your connection details

// Define the Todo model (schema)
const Todo = mongoose.model("Todo", {
  description: String,
  completed: Boolean,
});

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// GET all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new todo
app.post("/todos", async (req, res) => {
  const newTodo = new Todo({
    description: req.body.description,
    completed: false,
  });

  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ... (similar routes for GET /todos/:id, PUT /todos/:id, DELETE /todos/:id)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

**Best Practices and Considerations**

- **Error Handling:** Implement proper error handling to provide meaningful error messages to clients using appropriate HTTP status codes.
- **Security:** Secure your API with authentication, authorization, input validation, and other measures to prevent unauthorized access or malicious attacks.
- **Documentation:** Document your API with details on endpoints, request parameters, response formats, and error codes to make it easier for developers to consume your API.
- **Testing:** Write unit tests for your API handlers to ensure their correctness and reliability.

# RESTful API Design best practices

**1. Resource-Based URLs:**

- **Concept:** Structure API URLs to represent resources and their relationships.
- **Example:** Instead of `/create-user`, use `/users`. To create a user, send a `POST` request to `/users`.

**2. Use Nouns in Endpoints (Not Verbs):**

- **Concept:** Use nouns to identify resources in the URL path, and verbs are handled by HTTP methods.
- **Example:** Instead of `/update-user/123`, use `/users/123`. Use `PUT` to update the user at ID 123.

**3. Plural Nouns for Collections:**

- **Concept:** Use plural nouns to represent collections of resources.
- **Example:** Use `/users` to retrieve a list of all users, and `/users/123` to get a specific user.

**4. Standard HTTP Methods:**

- **Concept:** Leverage standard HTTP methods for CRUD operations:
  - `GET`: Retrieve data (e.g., `/users`)
  - `POST`: Create new resources (e.g., send data to `/users` to create a user)
  - `PUT`: Update a resource entirely (e.g., send data to `/users/123` to replace the user at ID 123)
  - `PATCH`: Update a specific part of a resource (e.g., send partial data to `/users/123` to update a user's email)
  - `DELETE`: Delete a resource (e.g., send a `DELETE` request to `/users/123` to delete the user)

**5. JSON or XML for Data Exchange:**

- **Concept:** Use a common format like JSON or XML for request and response data for easy parsing and consumption.

**6. HATEOAS (Hypermedia as the Engine of Application State):**

- **Concept:** Include links in responses to guide clients on available actions and related resources.
- **Example:** A response for a user object might include links for self (`/users/123`), related posts (`/users/123/posts`), and update (`/users/123`).

**7. Error Handling with HTTP Status Codes:**

- **Concept:** Use standard HTTP status codes to indicate success, errors, and specific error conditions.
- **Example:** Return a `200 OK` for successful requests, `400 Bad Request` for invalid data, `404 Not Found` for missing resources, and `500 Internal Server Error` for unexpected server issues.

**8. Filtering, Sorting, and Pagination:**

- **Concept:** Provide options for clients to filter, sort, and paginate data retrieval for efficiency and manageability of large datasets.
- **Example:** Allow query parameters for filtering by user name (`/users?name=john`), sorting by creation date (`/users?sort=createdAt`), and pagination (`/users?page=2&limit=10`).

**9. Versioning:**

- **Concept:** Implement a versioning strategy to manage API changes and ensure compatibility for existing clients.
- **Example:** Use URL segments (e.g., `/v1/users`) or headers to indicate API version.

**10. Documentation:**

- **Concept:** Provide clear and comprehensive API documentation that includes endpoints, request parameters, response formats, error codes, and examples.
- **Example:** Use tools like Swagger or API Blueprint to create interactive and easy-to-understand documentation.

**Remember:** These best practices work together to create a well-designed, predictable, and maintainable RESTful API that's easy for developers to use.

# Versioning

Here are some code examples demonstrating different REST API versioning approaches in Node.js using Express:

**1. URI Versioning:**

This approach incorporates the API version into the URL path.

```javascript
const express = require("express");
const app = express();
const port = 3000;

// Version 1 routes
app.get("/v1/users", (req, res) => {
  // Handle user retrieval for version 1
  res.json({ message: "User data (version 1)" });
});

app.post("/v1/users", (req, res) => {
  // Handle user creation for version 1
  res.json({ message: "User created (version 1)" });
});

// Version 2 routes (potentially with different logic or data format)
app.get("/v2/users", (req, res) => {
  // Handle user retrieval for version 2
  res.json({ message: "User data (version 2)" });
});

app.post("/v2/users", (req, res) => {
  // Handle user creation for version 2
  res.json({ message: "User created (version 2)" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

**2. Request Parameter Versioning:**

This approach specifies the API version as a query parameter in the request URL.

```javascript
const express = require("express");
const app = express();
const port = 3000;

app.get("/users", (req, res) => {
  const version = req.query.version; // Access version from query parameter

  if (version === "1") {
    // Handle user retrieval for version 1
    res.json({ message: "User data (version 1)" });
  } else if (version === "2") {
    // Handle user retrieval for version 2
    res.json({ message: "User data (version 2)" });
  } else {
    res.status(400).json({ message: "Invalid API version" });
  }
});

app.post("/users", (req, res) => {
  const version = req.query.version; // Access version from query parameter

  if (version === "1") {
    // Handle user creation for version 1
    res.json({ message: "User created (version 1)" });
  } else if (version === "2") {
    // Handle user creation for version 2
    res.json({ message: "User created (version 2)" });
  } else {
    res.status(400).json({ message: "Invalid API version" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

**3. Custom Header Versioning:**

This approach specifies the API version as a custom header in the request.

```javascript
const express = require("express");
const app = express();
const port = 3000;

app.get("/users", (req, res) => {
  const version = req.headers["x-api-version"]; // Access version from custom header

  if (version === "1") {
    // Handle user retrieval for version 1
    res.json({ message: "User data (version 1)" });
  } else if (version === "2") {
    // Handle user retrieval for version 2
    res.json({ message: "User data (version 2)" });
  } else {
    res.status(400).json({ message: "Invalid API version" });
  }
});

app.post("/users", (req, res) => {
  const version = req.headers["x-api-version"]; // Access version from custom header

  if (version === "1") {
    // Handle user creation for version 1
    res.json({ message: "User created (version 1)" });
  } else if (version === "2") {
    // Handle user creation for version 2
    res.json({ message: "User created (version 2)" });
  } else {
    res.status(400).json({ message: "Invalid API version" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

Remember to choose the versioning approach that best suits your API.

# HATEOAS (Hypermedia as the Engine of Application State)

HATEOAS (Hypermedia as the Engine of Application State) is a principle in RESTful API design that emphasizes using hypermedia to guide clients through available actions and related resources. In Node.js, this translates to including links within API responses that direct the client to the next steps or relevant functionalities.

Here's a breakdown of HATEOAS in Node.js context:

**Concept:**

- Instead of hardcoding URLs in your client code, the server dynamically provides links in the response body.
- These links represent actions (create, update, delete) and related resources the client can interact with.
- This approach promotes loose coupling between the client and server, making the API more adaptable to changes.

**Benefits:**

- **Reduced Client-Side Complexity:** Clients don't need to know the entire API structure upfront. They discover available actions and resources through the provided links.
- **Improved Maintainability:** Changes on the server-side (e.g., URL changes) won't break client code as they rely on dynamic links.
- **Discoverability of New Features:** Clients can automatically discover new functionalities exposed by the server through HATEOAS links.

**Implementation in Node.js:**

- Leverage libraries like Express.js to dynamically generate links based on the request context and resource state.
- Use standard link relations like `self` (points to the current resource), `create` (link to create a new related resource), and others defined in the RFC 5988 ([https://www.ietf.org/rfc/rfc5988.txt](https://www.ietf.org/rfc/rfc5988.txt)).

**Example:**

```javascript
const express = require("express");
const app = express();
const port = 3000;

const posts = [
  { id: 1, title: "Post 1", comments: [] },
  { id: 2, title: "Post 2", comments: [] },
];

app.get("/posts", (req, res) => {
  res.json(
    posts.map((post) => ({
      id: post.id,
      title: post.title,
      links: {
        self: `/posts/${post.id}`,
        comments: `/posts/${post.id}/comments`, // Link to related comments resource
        create_comment: `/posts/${post.id}/comments`, // Link to create a new comment
      },
    }))
  );
});

app.get("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts.find((p) => p.id === Number(postId));

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json({
    id: post.id,
    title: post.title,
    comments: post.comments, // Include comments data or link to retrieve them separately
    links: {
      self: `/posts/${post.id}`,
    },
  });
});

// ... other routes for comments

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

**Incorporating HATEOAS in your Node.js projects can lead to a more flexible, discoverable, and maintainable RESTful API.**

# HTTP Status Codes

HTTP status codes are three-digit codes that web servers use to communicate the outcome of an HTTP request to the client (usually a web browser). These codes are grouped into categories based on the nature of the response:

1. **Informational Codes (1xx):** These temporary response codes indicate that the request is being processed and further action might be required. You won't encounter these very often as they're part of the communication between servers.

2. **Successful Codes (2xx):** These codes indicate that the request was received, understood, and processed successfully.

   - `200 OK`: The most common success code, meaning the request was fulfilled.
   - `201 Created`: Indicates a new resource was created successfully.
   - `204 No Content`: The server has fulfilled the request but doesn't need to send back any content in the message body.

3. **Redirection Codes (3xx):** These codes tell the client to take further action with a different URL.

   - `301 Moved Permanently`: The requested resource has been permanently moved to a new location.
   - `302 Found`: The requested resource can be found at a different URL (temporary redirect).
   - `304 Not Modified`: The resource hasn't been modified since the client last fetched it (used for caching).

4. **Client Error Codes (4xx):** These codes indicate that the request was incorrect or faulty on the client-side.

   - `400 Bad Request`: The request could not be understood due to invalid syntax.
   - `401 Unauthorized`: The client is not authorized to access the requested resource.
   - `403 Forbidden`: The client is authorized but doesn't have permission to access the resource.
   - `404 Not Found`: The requested resource could not be found.

5. **Server Error Codes (5xx):** These codes indicate that the server encountered an error while processing the request.
   - `500 Internal Server Error`: A generic error occurred on the server that prevented it from fulfilling the request.
   - `502 Bad Gateway`: One server received an invalid response from another server.
   - `503 Service Unavailable`: The server is currently unavailable due to maintenance or overload.

# Filtering, Sorting, and Pagination

Here's an example of implementing Filtering, Sorting, and Pagination in Node.js, simulating a database query using an in-memory array:

```javascript
const express = require("express");
const app = express();
const port = 3000;

// Simulate a database with some products
const products = [
  { id: 1, name: "Laptop", price: 1000, category: "Electronics" },
  { id: 2, name: "Phone", price: 500, category: "Electronics" },
  { id: 3, name: "Shirt", price: 20, category: "Clothing" },
  { id: 4, name: "Jeans", price: 30, category: "Clothing" },
  { id: 5, name: "Headphones", price: 75, category: "Electronics" },
];

/**
 * Function to filter products based on query parameters
 * @param {Array} products - Array of product objects
 * @param {Object} query - Object containing query parameters (name, category, etc.)
 * @returns {Array} - Filtered array of products
 */
function filterProducts(products, query) {
  let filteredProducts = products;

  if (query.name) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().indexOf(query.name.toLowerCase()) !== -1
    );
  }

  if (query.category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === query.category
    );
  }

  // You can add more filters here based on your needs

  return filteredProducts;
}

/**
 * Function to sort products based on a given field and order
 * @param {Array} products - Array of product objects
 * @param {String} sortBy - Field to sort by (e.g., 'name', 'price')
 * @param {String} orderBy - Order (e.g., 'asc', 'desc')
 * @returns {Array} - Sorted array of products
 */
function sortProducts(products, sortBy, orderBy) {
  if (!sortBy) {
    return products;
  }

  const sortOrder = orderBy === "desc" ? -1 : 1;

  return products.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return -1 * sortOrder;
    } else if (a[sortBy] > b[sortBy]) {
      return 1 * sortOrder;
    }
    return 0;
  });
}

/**
 * Function to paginate products based on page number and limit
 * @param {Array} products - Array of product objects
 * @param {Number} page - Page number (starting from 1)
 * @param {Number} limit - Number of products per page
 * @returns {Object} - Object containing the current page data and total pages
 */
function paginateProducts(products, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / limit);

  return { data: paginatedProducts, totalPages };
}

app.get("/products", (req, res) => {
  const { query, sortBy, orderBy, page = 1, limit = 10 } = req.query; // Destructure query parameters

  // Filter products based on query
  let filteredProducts = filterProducts(products, query);

  // Sort products if sortBy and orderBy are provided
  filteredProducts = sortProducts(filteredProducts, sortBy, orderBy);

  // Paginate products
  const pagination = paginateProducts(filteredProducts, page, limit);

  res.json(pagination);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

This example demonstrates:

- **Filtering:** Based on `name` and `category` query parameters.
- **Sorting:** Based on a provided `sortBy` field (e.g., `name`, `price`) and `orderBy` (e.g., `asc`, `desc`).
- **Pagination:** Using `page` and `limit` query parameters to control the number of products returned per page.

Remember to replace the in-memory `products` array with your actual database interaction logic (e.g., using Mongoose or another database library).

# Conclusion

We learned about one of the most important concepts in backend development, RESTful API, there are different types like GraphQL or grpc, but RESTful are the most popular and common these days, the main problem is that you might send information the Frontend doesn't need which GraphQL fixes at the cost of creating complex queries which might break your database request, most common issue is a JOIN which didn't work correctly.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
