---
title: "[Roadmap_Node] 1_Introduction to Node JS"
description: "Let us learn what is Node JS"
category: ["node"]
pubDate: "2024-04-02"
published: true
---

# Introduction

Node.js is an open-source, cross-platform JavaScript runtime environment that allows you to execute JavaScript code outside of a web browser. Here's a breakdown of its key features:

**JavaScript on the Server**:

Traditionally, JavaScript was used primarily for adding interactivity to web pages within browsers. Node.js lets you write server-side applications using JavaScript, enabling you to create dynamic web content and APIs.

**Event-Driven and Asynchronous**:

Node.js is designed to be efficient at handling multiple concurrent requests. It employs an event loop that processes incoming requests in a non-blocking manner. This means it can handle many connections simultaneously without waiting for one operation to finish before starting another.

**Uses V8 Engine**:

Node.js leverages the V8 JavaScript engine, the same engine that powers Google Chrome. This engine is known for its speed and performance, making Node.js well-suited for real-time applications and data-intensive tasks.

**Package Ecosystem (npm)**:

Node.js boasts a vast ecosystem of pre-written code modules (packages) stored in the Node Package Manager (npm). This extensive library offers ready-made solutions for various functionalities, saving you time and effort in development.

**Common Use Cases**:

- Building web servers and APIs
- Real-time applications (chat, collaboration tools)
- Data streaming
- Command-line tools and scripts
- Internet of Things (IoT) applications

In essence, Node.js empowers developers to create versatile and scalable applications using JavaScript throughout the development stack, from front-end to back-end.

# JavaScript Runtime for Server-Side Development

A JavaScript Runtime for Server-Side Development is a software environment that allows you to execute JavaScript code on a server, rather than just in a web browser. This enables you to build the back-end logic of web applications using JavaScript, instead of traditional server-side languages like PHP, Python, or Java.

Here's a breakdown of the key aspects:

- **JavaScript:** JavaScript is a popular scripting language typically used for adding interactivity to web pages within browsers.
- **Server-Side:** This refers to the part of a web application that runs on the web server and handles tasks like database interactions, user authentication, and logic processing. Traditionally, these tasks were handled by languages like those mentioned above.
- **Runtime Environment:** This is a software system that provides the necessary infrastructure for executing code. In the context of JavaScript, a runtime environment interprets and runs JavaScript code.

**Benefits of Server-Side JavaScript:**

- **Unified Language:** Developers can use the same language (JavaScript) for both front-end (client-side) and back-end (server-side) development, potentially leading to faster development and easier code maintenance.
- **Large Ecosystem:** JavaScript has a vast ecosystem of libraries and frameworks, many of which can be leveraged for server-side development as well.
- **Event-Driven Architecture:** Some JavaScript runtimes, like Node.js (the most popular one), are built on an event-driven architecture, which can be efficient for handling real-time applications and asynchronous tasks.

**Popular JavaScript Runtime for Server-Side Development:**

- **Node.js:** This is the most widely used JavaScript runtime for server-side development. It's open-source, cross-platform (works on various operating systems), and leverages the V8 JavaScript engine (same as Google Chrome) for fast performance.

**In summary:**

A JavaScript Runtime for Server-Side Development allows you to write the back-end logic of web applications using JavaScript, potentially simplifying development and leveraging the vast JavaScript ecosystem. Node.js is the most prominent example of such a runtime environment.

# Non-Blocking I/O

Non-Blocking I/O (Input/Output) is a technique used in programming to handle I/O operations without blocking the execution of the main thread. In simpler terms, **it allows your program to continue running other tasks while waiting for data from external sources like files, networks, or devices**.

Node.js is particularly well-suited for non-blocking I/O due to its architecture and design principles. Here's a deeper dive into how non-blocking I/O works in Node.js:

**Event Loop at the Heart:**

- Node.js employs a single-threaded event loop that serves as the central nervous system for handling asynchronous tasks, including non-blocking I/O operations.
- The event loop continuously performs three main tasks:

  1. **Checks for I/O Events:** It monitors for any completed I/O operations.
  2. **Executes Callbacks:** When an I/O operation finishes, the associated callback function is placed in the event queue. The event loop retrieves and executes these callbacks from the queue.
  3. **Processes JavaScript Code:** If no I/O events are pending and the event queue is empty, the event loop processes any remaining JavaScript code in the main thread.

![Event loop](./45_EventLoop.jpg)

**Non-Blocking I/O in Action:**

1. **Initiate I/O:** Your Node.js application makes a request for data using a non-blocking I/O method (e.g., `fs.readFile` for reading a file).
2. **Thread Doesn't Wait:** The main thread doesn't wait for the data to be retrieved. It continues executing other tasks in the program.
3. **Callback Registration:** The non-blocking I/O method typically registers a callback function to be executed when the operation completes.
4. **Event Loop Takes Over:** The event loop monitors the I/O operation's progress.
5. **Data Available:** Once the data is retrieved, the I/O operation triggers an event and signals the event loop.
6. **Callback Execution:** The event loop places the registered callback function in the event queue.
7. **Event Queue Processing:** When the main thread finishes executing its current tasks and the event queue isn't empty, the event loop retrieves and executes the callback function from the queue.
8. **Data Processing:** Inside the callback function, you can access and process the retrieved data.

**Key Advantages in Node.js:**

- **Highly Responsive:** Since the main thread doesn't block, Node.js applications remain responsive to user requests even while waiting for I/O operations. This is crucial for web servers that need to handle many concurrent connections efficiently.
- **Scalability:** Node.js can handle a large number of concurrent connections effectively because the event loop can manage multiple I/O operations simultaneously without blocking the main thread.
- **Efficient Resource Utilization:** By not blocking the main thread, Node.js utilizes system resources (CPU, memory) more efficiently. This allows the program to execute other tasks while waiting for I/O, leading to potentially faster overall performance.

**Popular Non-Blocking I/O Modules in Node.js:**

- `fs`: File system module for non-blocking file I/O operations.
- `http`: Module for creating HTTP servers and clients with non-blocking network communication.
- `net`: Module for creating TCP/UDP servers and clients with non-blocking network interactions.

**In essence:**

Non-blocking I/O is a fundamental concept in Node.js that enables it to build highly responsive and scalable applications. By leveraging the event loop and callback mechanisms, Node.js efficiently handles I/O operations without blocking the main thread, ensuring a smooth user experience and optimal resource utilization.

# Conclusion

We learned what Server Side runtime means and what is Non Blocking I/O for Node JS in particular, we should have a better idea on what is going on when our Node JS applications are running, at the end of the day its a single thread that runs asynchronous operations.

See you on the next post.

Sincerely,

**End. Adrian Beria**
