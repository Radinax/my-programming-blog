---
title: "[Roadmap_Node] 21_Error Handling and monitoring"
description: "Let us talk about Error Handling which we will need to handle for every async operation and monitoring our app"
category: ["node"]
pubDate: "2024-04-11T07:00:00-04:00"
published: true
---

## Table of content

# Introduction

Error handling and monitoring are essential aspects of building robust Node.js applications. They help ensure your application remains stable and operational, even when unexpected issues arise.

**Error Handling in Node.js**

- **Error Types:**

  - **Operational Errors:** These are expected errors that occur during runtime, like a database connection failing or a file not found. You can handle these gracefully to provide a good user experience.
  - **Programmer Errors:** These are bugs in your code and indicate unexpected behavior. You should fix these errors as soon as possible.

- **Techniques:**

  - **try...catch:** This block allows you to wrap suspicious code and define how to handle any errors that arise within the block.
  - **throw:** This statement lets you intentionally throw an error object for unexpected situations in your code.
  - **Custom Errors:** Create custom error classes to provide more specific information about the error type and context.
  - **Error Middleware:** Define a central function to handle errors consistently across your application. This is particularly useful for handling errors in asynchronous code using Promises.

- **Best Practices:**
  - Use descriptive error messages that help identify the root cause of the problem.
  - Differentiate between operational and programmer errors for better troubleshooting.
  - Implement centralized error handling to avoid code duplication.

**Monitoring in Node.js**

- **Logging:**
  - Create detailed logs to record application events, including errors, API requests, and performance metrics.
  - Tools like Winston or Pino provide structured logging capabilities in Node.js.
- **Application Performance Monitoring (APM):**
  - Use APM tools to track application health, identify performance bottlenecks, and monitor resource usage.
  - Tools like Elastic APM or Datadog provide comprehensive application monitoring solutions.

# Sentry and Error Tracking

I'd be glad to explain Sentry and Error Tracking in Node.js with code examples:

**Sentry: A Powerful Error Tracking Tool**

Sentry is a popular and comprehensive error tracking platform that simplifies capturing, organizing, and analyzing errors in your Node.js applications. It offers several key features:

- **Real-time Error Reporting:** Get notified about errors as they occur, allowing you to react quickly and fix issues before they impact users significantly.
- **Detailed Error Information:** Sentry captures a wealth of data about errors, including stack traces, environment variables, and user information, aiding in debugging and pinpointing root causes.
- **Grouping and Prioritization:** Sentry groups similar errors, helping you focus on the most critical issues affecting your application.
- **Performance Monitoring:** Gain insights into application performance by tracking metrics like request duration and resource usage.
- **Custom Breadcrumbs:** Leave breadcrumbs (logs) throughout your code to trace the execution flow leading up to an error, providing valuable context.

**Integrating Sentry in Node.js**

1. **Create a Sentry Project:** Sign up for Sentry and create a new project to track errors for your Node.js application.
2. **Install the `@sentry/node` Package:**
   ```bash
   npm install @sentry/node
   ```
3. **Import and Initialize Sentry:**

   ```javascript
   const Sentry = require("@sentry/node");

   Sentry.init({
     dsn: "YOUR_SENTRY_DSN", // Replace with your Sentry project's DSN
     // Optional configuration options like environment, release, etc.
   });
   ```

**Capturing Errors with Sentry**

- **Capture Exceptions:** Use `Sentry.captureException(error)` to send errors to Sentry whenever they occur in your code:
  ```javascript
  try {
    // Your code here
  } catch (error) {
    Sentry.captureException(error);
    throw error; // Re-throw the error to propagate it if needed
  }
  ```
- **Capture Messages (Optional):** For non-exceptional events (e.g., user actions), use `Sentry.captureMessage(message, level)`:
  ```javascript
  Sentry.captureMessage('User clicked the "Cancel" button', "info");
  ```

**Code Example with Error Handling and Sentry:**

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
});

function divide(a, b) {
  if (b === 0) {
    const error = new Error("Division by zero");
    Sentry.captureException(error); // Capture the error
    throw error; // Re-throw for further handling if needed
  }
  return a / b;
}

// Usage
try {
  const result = divide(10, 0);
  console.log(result);
} catch (error) {
  console.error("Error:", error.message);
}
```

In this example:

- We initialize Sentry with your DSN.
- The `divide` function throws an error when dividing by zero.
- We capture the error using `Sentry.captureException()`, sending it to your Sentry project.
- The error is then re-thrown using `throw error` to allow you to handle it further within your application if necessary.

# Health Checks and Monitoring Endpoints

## Health Checks and Monitoring Endpoints in Node.js

**Health Checks** are lightweight endpoints that provide a quick assessment of your Node.js application's overall health. They typically return a simple response indicating if the application is up and running and essential services are functional.

**Monitoring Endpoints** offer more detailed information about your application's performance and resource usage. They might report on metrics like:

- Uptime
- Database connection status
- Memory and CPU usage
- Request latency
- External service availability (e.g., cache, message queues)

Here's how to implement health checks and monitoring endpoints in Node.js:

**1. Simple Health Check:**

```javascript
const express = require("express");

const app = express();

app.get("/health", (req, res) => {
  res.json({
    status: "up",
    uptime: process.uptime(), // Time since application started
  });
});

// ... other application routes

app.listen(3000, () => console.log("Server listening on port 3000"));
```

This basic health check endpoint returns a JSON response with the application's status (`up`) and uptime.

**2. Enhanced Monitoring Endpoint:**

```javascript
const express = require("express");
const mongoose = require("mongoose"); // Assuming MongoDB connection

const app = express();

let dbConnectionStatus = "disconnected";

mongoose
  .connect("mongodb://localhost:27017/your_database")
  .then(() => {
    dbConnectionStatus = "connected";
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

app.get("/monitoring", (req, res) => {
  res.json({
    status: "up",
    uptime: process.uptime(),
    database: dbConnectionStatus,
    // Add other metrics like memory usage, request counts, etc.
  });
});

// ... other application routes

app.listen(3000, () => console.log("Server listening on port 3000"));
```

This endpoint:

- Tracks the database connection status using Mongoose.
- Reports basic application information and the database connection status in the response.
- You can extend it to include other metrics retrieved from the server or external services.

**3. Advanced Monitoring with External Tools:**

For comprehensive monitoring, consider integrating Node.js with dedicated monitoring tools like:

- Prometheus: [https://prometheus.io/](https://prometheus.io/) (Open-source)
- Datadog: [https://www.datadoghq.com/](https://www.datadoghq.com/)
- New Relic: [https://newrelic.com/](https://newrelic.com/)
- Librato: [https://www.librato.com/](https://www.librato.com/)

These tools offer:

- Customizable dashboards
- Alerting based on defined thresholds
- Historical data analysis
- Integration with various services and platforms

# Conclusion

By effectively implementing error handling and monitoring, you can build Node.js applications that are resilient to errors, provide a positive user experience, and offer valuable insights for ongoing improvement.

Tools like Sentry are common in modern production applications to quickly point where a potential error or bug is located. By integrating Sentry effectively, you can gain valuable insights into your Node.js application's errors, improve its stability, and deliver a better user experience.

And finally about health checks:

- Choose health check and monitoring endpoints based on your application's complexity and requirements.
- Secure these endpoints with appropriate authentication and authorization mechanisms if they expose sensitive information.
- Regularly review and update your monitoring strategies to ensure they capture relevant metrics and provide valuable insights.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
