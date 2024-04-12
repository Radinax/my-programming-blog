---
title: "[Roadmap_Node] 19_Logging"
description: "Let us talk about logging. In Node.js, logging refers to the practice of recording information about your application's execution during development, testing, and production"
category: ["node"]
pubDate: "2024-04-09T12:00:00-04:00"
published: true
---

## Table of content

# Introduction

In Node.js, logging refers to the practice of recording information about your application's execution during development, testing, and production. This information can be used for various purposes, including:

- **Debugging:** Identifying errors, tracing program flow, and understanding issues within your application.
- **Monitoring:** Tracking application health, performance, and user activity.
- **Auditing:** Keeping a record of critical events for security or compliance purposes.

**Node.js Built-in Logging:**

The `console` module provides basic logging functionality in Node.js. You can use methods like `console.log()`, `console.error()`, `console.warn()`, and `console.info()` to write messages to the standard output (stdout) or standard error (stderr) streams.

**Example:**

```javascript
console.log("Starting application...");

// Perform some operations...

console.error("An error occurred!");
console.info("Processing completed successfully.");
```

While the `console` module is a good starting point, it has limitations for production use cases:

- **Limited Formatting:** Offers basic formatting options.
- **No Levels:** Can't easily distinguish between different logging levels (e.g., debug, info, warn, error).
- **No File Output:** Logs are written to stdout or stderr by default, not to persistent files.

**Third-Party Logging Libraries:**

For more advanced logging needs, consider using third-party libraries like:

- **Winston:** Popular and flexible logger with support for various levels, transports (file, console, network), and formatting options.
- **Pino:** Performant logger known for its JSON-based output and structured logging capabilities.
- **Bunyan:** Another popular choice offering JSON-based logs and support for multiple log destinations.

These libraries provide features like:

- **Multiple Logging Levels:** Define different levels (e.g., debug, info, warn, error) for categorizing log messages.
- **Transports:** Specify where to send logs (e.g., console, file, network).
- **Formatting:** Customize the format of log messages (e.g., timestamps, severity levels, application context).
- **Metadata:** Include additional information with logs for better debugging and analysis.

**Choosing a Logging Library:**

The best library for your project depends on your specific needs. Consider factors like:

- **Ease of Use:** How easy is it to set up and use the library?
- **Features:** Does it offer the features you need (e.g., logging levels, transports, formatting)?
- **Performance:** How well does it perform in production environments?
- **Community and Support:** Does it have a large community and good documentation?

**Best Practices for Logging in Node.js:**

- **Use a consistent logging library:** Choose a library that meets your needs and stick with it for a unified approach.
- **Define logging levels:** Set up appropriate logging levels to categorize your messages (e.g., debug for detailed information, error for critical issues).
- **Log relevant information:** Include context with your logs to facilitate debugging (e.g., timestamps, user IDs, request details).
- **Rotate logs regularly:** Large log files can consume disk space. Consider rotating logs periodically or using a log management solution.

# Winston Logger

Winston is a popular and powerful logging library for Node.js. It offers a flexible and extensible approach to managing application logs, making it a valuable tool for development, testing, and production environments.

Here's a breakdown of key features and functionalities of Winston:

**Core Concepts:**

- **Loggers:** Represent instances that manage log messages. You can create multiple loggers with different configurations.
- **Transports:** Specify destinations for your logs (e.g., console, file, database, network). Winston supports various built-in transports and allows creating custom ones.
- **Logging Levels:** Define the severity of log messages (e.g., error, warn, info, debug, silly). Levels can be filtered by transports.

**Benefits of Using Winston:**

- **Flexibility:** Configure logging behavior with various options for levels, transports, and formatting.
- **Extensibility:** Supports custom transports and formatters to tailor logging to your needs.
- **Structured Logging:** Enables including additional data (metadata) with log messages for better analysis.
- **Centralized Management:** Manage multiple loggers and transports from a single configuration file.

**Common Use Cases:**

- **Development and Debugging:** Log detailed information (debug level) to help identify and fix issues.
- **Monitoring and Alerting:** Track application health and performance using log information and set up alerts based on critical errors.
- **Auditing:** Record user activity or security-related events for compliance purposes.

**Getting Started with Winston:**

1. **Installation:** Use npm or yarn to install the `winston` package:

   ```bash
   npm install winston
   ```

2. **Basic Usage:**

   ```javascript
   const winston = require("winston");

   const logger = winston.createLogger({
     level: "info", // Minimum logging level
     format: winston.format.combine(
       winston.format.timestamp(), // Include timestamp
       winston.format.json() // JSON format for logs
     ),
     transports: [
       new winston.transports.Console(), // Log to console
       new winston.transports.File({ filename: "app.log" }), // Log to a file
     ],
   });

   logger.info("Application started");
   logger.error("An error occurred!");
   ```

   This example creates a logger with:

   - `info` as the minimum logging level (only `info` and above messages are logged)
   - Timestamps and JSON format for logs
   - Console and file transports

**Advanced Features:**

- **Custom Transports:** Create custom transports to send logs to external services or databases.
- **Custom Formatters:** Define custom formatters to tailor the output of your logs.
- **Exception Handling:** Integrate Winston with error handling mechanisms to capture and log exceptions.

**Winston Alternatives:**

Other popular Node.js logging libraries include Pino and Bunyan. Consider factors like features, performance, and community support when choosing a library for your project.

By leveraging Winston's flexibility and features, you can streamline your logging practices in Node.js applications, leading to better debugging, monitoring, and overall maintainability.

# Morgan Middleware

Morgan is a popular middleware for Node.js web frameworks, specifically Express.js, used for logging HTTP requests made to your application. It provides a concise and informative way to capture details about incoming requests and responses, aiding in debugging, monitoring, and analysis.

**Key Features of Morgan:**

- **Automatic Logging:** Intercepts incoming requests and logs relevant information without requiring manual code in route handlers.
- **Customizable Format:** Offers various predefined formats (tiny, common, dev, combined) to display request details at different levels of verbosity. You can also create custom formats.
- **Concise Output:** Logs essential request information like method, URL, status code, response time, and content length.
- **Flexibility:** Integrates seamlessly with Express.js middleware pipeline, allowing configuration and placement within your application logic.

**Benefits of Using Morgan:**

- **Simplified Debugging:** Provides quick access to request details, helping identify issues related to routing, parameters, or errors.
- **Performance Monitoring:** Tracks request processing times, aiding in optimizing performance bottlenecks.
- **Security Analysis:** Logs potential security risks like suspicious request patterns or unauthorized access attempts.
- **API Usage Monitoring:** Monitors how clients interact with your API endpoints, providing insights into usage patterns.

**Common Use Cases:**

- **Development:** During development, Morgan helps debug routing issues, analyze request parameters, and track request processing times.
- **Production Monitoring:** In production environments, Morgan aids in monitoring application health, identifying potential security threats, and understanding API usage patterns.

**Getting Started with Morgan:**

1. **Installation:** Install the `morgan` package using npm or yarn:

   ```bash
   npm install morgan
   ```

2. **Basic Usage:**

   ```javascript
   const express = require("express");
   const morgan = require("morgan");

   const app = express();

   // Configure Morgan with a predefined format (e.g., 'dev')
   app.use(morgan("dev"));

   // Your application routes...

   app.listen(3000, () => {
     console.log("Server listening on port 3000");
   });
   ```

   This example includes the `morgan` middleware with the `'dev'` format, which provides detailed information about each request.

**Advanced Features:**

- **Custom Formats:** Create custom formats using tokens (placeholders) for specific request/response details.
- **Conditional Logging:** Define conditions to conditionally log requests based on specific criteria (e.g., URL patterns, HTTP methods).
- **Skipping Logging:** Use the `skip` option to exclude certain requests from being logged (e.g., static files).

**Comparison with Built-in Logging:**

While Node.js offers basic logging with the `console` module, Morgan provides a more structured and efficient approach specifically tailored for HTTP requests. It simplifies logging tasks and offers various customization options for output format and behavior.

# Log Rotation Strategies

In Node.js applications, log files can grow quite large over time, consuming significant disk space and potentially impacting performance. Log rotation strategies help manage log files by automatically:

- **Archiving old logs:** Move older logs to separate files or a different location.
- **Compressing old logs:** Reduce the size of archived logs for more efficient storage.
- **Limiting log size:** Prevent individual log files from becoming excessively large.

Here are some common log rotation strategies in Node.js:

**1. Using External Tools:**

- **`logrotate` (Linux/Unix):** A popular system tool specifically designed for log rotation. It allows defining rotation policies based on size, age, or both. You can configure logrotate to manage your Node.js application logs. Here's an example configuration:

```
/path/to/your/app.log {
  daily
  rotate 7
  compress
  missingok
  notifempty
  create 644 root root
}
```

This configuration rotates the log file daily, keeps a maximum of 7 archives, compresses them, and creates a new empty log file if the current one is missing.

- **Process Managers:** Tools like PM2 (Process Manager 2) often have built-in log rotation capabilities. You can configure PM2 to manage logs for the applications it runs.

**2. Third-Party Logging Libraries:**

Several logging libraries for Node.js offer built-in log rotation features:

- **Winston:** Provides the `DailyRotateFile` transport that automatically rotates log files based on a specified date pattern and keeps a configurable number of archives.

```javascript
const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "./logs/app.log",
      datePattern: ".yyyy-MM-dd",
      maxSize: "10m", // Max file size in MB before rotation
      maxFiles: "5", // Max number of archived files
    }),
  ],
});
```

- **Pino:** Offers rotation capabilities through custom transports or third-party integrations.

**3. Custom Implementation:**

For more control, you can develop your own log rotation logic within your Node.js application. This approach involves:

- Tracking the log file size.
- When the size exceeds a threshold, create a new log file and archive the existing one (e.g., by renaming or compressing).
- Consider using techniques like `fs.watchFile` to monitor log file size changes.

**Choosing a Log Rotation Strategy:**

The best strategy depends on your specific needs and environment:

- **For simple rotation:** Leverage external tools like `logrotate` or process manager features.
- **For more control:** Consider using logging libraries with built-in rotation or implement a custom solution.

**Additional Considerations:**

- **Compression:** Compressing archived logs significantly reduces storage space.
- **Backup and Retention:** Regularly back up archived logs for disaster recovery purposes and define a retention policy for old logs.
- **Monitoring:** Monitor disk space usage to ensure log files don't fill up your storage.

By implementing a suitable log rotation strategy, you can effectively manage log files in your Node.js applications, preventing storage issues and maintaining efficient logging practices.

**In Conclusion:**

Morgan is a valuable tool for Node.js developers, particularly when working with Express.js applications. Its ease of use, flexibility, and focus on HTTP requests make it a popular choice for logging and monitoring web applications. By incorporating Morgan, you can gain valuable insights into your application's behavior and improve its overall performance and maintainability.

# Conclusion

Effective logging is crucial for building reliable and maintainable Node.js applications. By understanding the built-in options, third-party libraries, and best practices, you can implement a robust logging strategy for your projects.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
