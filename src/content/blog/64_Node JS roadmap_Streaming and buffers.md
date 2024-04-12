---
title: "[Roadmap_Node] 20_Streaming and Buffers"
description: "Let us talk about streaming and buffer which are fundamental concepts for handling data that arrives or is generated in chunks over time"
category: ["node"]
pubDate: "2024-04-10T07:00:00-04:00"
published: true
---

## Table of content

# Introduction

In Node.js, streams and buffers are fundamental concepts for handling data that arrives or is generated in chunks over time. Here's a breakdown of each concept and how they work together:

**Streams:**

- Represent a sequence of data elements flowing from a source to a destination.
- Data is processed in chunks (pieces) instead of waiting for the entire dataset to be available. This is efficient for large amounts of data.
- Provide an event-driven mechanism for handling data flow. You can listen for events like `data`, `end`, and `error` to react to incoming data or errors.

**Types of Streams:**

- **Readable Streams:** Emit `data` events when new data chunks are available for reading. Used for consuming data from sources like files, network connections, or user input.
- **Writable Streams:** Emit `drain` events when they are ready to receive more data. Used for writing data to destinations like files, network connections, or the console.
- **Duplex Streams:** Can both read and write data.
- **Transform Streams:** Can modify or transform data as it flows through the stream.

**Example: Reading a File Stream:**

```javascript
const fs = require("fs");

const readableStream = fs.createReadStream("large_file.txt");

readableStream.on("data", (chunk) => {
  console.log(chunk.toString()); // Process data chunk by chunk
});

readableStream.on("end", () => {
  console.log("Finished reading the file");
});

readableStream.on("error", (error) => {
  console.error("Error reading file:", error);
});
```

**Buffers:**

- Represent a fixed-size chunk of raw binary data.
- Used to temporarily hold data before it's processed or written to a stream.
- Act as an intermediary between streams and the application code.

**How Streams and Buffers Work Together:**

- Streams operate on buffers.
- When data arrives in chunks from a source, it's typically stored in a buffer before being processed by the application or written to another stream.
- The buffer size determines the amount of data held before processing.

**Key Points to Remember:**

- Streams provide an efficient way to handle large datasets without overwhelming memory.
- Buffers act as temporary storage for data chunks flowing through streams.
- The interplay between streams and buffers is crucial for building Node.js applications that deal with data effectively.

**Additional Considerations:**

- Node.js has built-in stream implementations for various use cases (e.g., `fs.createReadStream`, `http.IncomingMessage`).
- You can create custom streams to handle specific data sources or transformations.
- Buffer size can be adjusted based on memory constraints and data processing needs.

By understanding streams and buffers, you can develop Node.js applications that efficiently handle data of any size, improving performance and memory usage.

# Read and write streams

## Readable Streams in Node.js

Readable streams represent data sources that emit data chunks in a sequential manner. They are ideal for handling large amounts of data that arrive gradually, preventing memory overload. Here's a breakdown of readable streams with a code example:

**Functionality:**

- **Data Chunks:** Data is delivered in pieces (chunks) rather than waiting for the entire dataset at once.
- **Event-Driven:** Readable streams emit events like `data`, `end`, and `error` to signal data arrival, stream completion, or errors.
- **Consumption:** You can listen for these events and process the received data chunks within your application logic.

**Common Use Cases:**

- Reading files from disk.
- Receiving data from network connections (e.g., HTTP requests).
- Processing user input from consoles or forms.

**Example: Reading a File Stream:**

```javascript
const fs = require("fs");

const readableStream = fs.createReadStream("data.txt");

readableStream.on("data", (chunk) => {
  console.log(chunk.toString()); // Process each data chunk
});

readableStream.on("end", () => {
  console.log("Finished reading the file");
});

readableStream.on("error", (error) => {
  console.error("Error reading file:", error);
});
```

**Explanation:**

1. We import the `fs` (file system) module.
2. We use `fs.createReadStream('data.txt')` to create a readable stream for the file `data.txt`.
3. The `readableStream.on('data', (chunk) => {...})` line defines a listener for the `data` event. This function is called whenever a new chunk of data is available from the stream. The `chunk` parameter is a Buffer containing the data in that chunk.
4. Inside the listener, we convert the `chunk` Buffer to a string using `toString()` and then process it (e.g., console logging).
5. The `readableStream.on('end', () => {...})` line listens for the `end` event, which signals that the entire file has been read.
6. The `readableStream.on('error', (error) => {...})` line handles any errors that might occur during the reading process.

**Key Points:**

- Readable streams allow for efficient processing of large datasets without loading everything into memory at once.
- Event listeners provide a reactive approach to handling data arrival and stream completion.

## Writable Streams in Node.js

Writable streams represent destinations for data that you want to write in chunks. They provide a controlled way to send data to targets like files, network connections, or the console.

**Functionality:**

- **Data Chunks:** Data is written in pieces, similar to readable streams.
- **Event-Driven:** Writable streams emit events like `drain`, `finish`, and `error` to indicate readiness for more data, successful writing, or errors.
- **Writing:** You can use the `write()` method on the stream object to send data chunks.

**Common Use Cases:**

- Writing data to files.
- Sending data over network connections (e.g., HTTP responses).
- Logging information to the console.

**Example: Writing to a File Stream:**

```javascript
const fs = require("fs");

const writableStream = fs.createWriteStream("output.txt");

const data = "This data will be written to the file.";

writableStream.write(data, (error) => {
  if (error) {
    console.error("Error writing to file:", error);
  } else {
    console.log("Data written successfully!");
  }
});

writableStream.on("finish", () => {
  console.log("Finished writing the file");
});

writableStream.on("error", (error) => {
  console.error("Error writing to file:", error);
});
```

**Explanation:**

1. We import the `fs` module.
2. We use `fs.createWriteStream('output.txt')` to create a writable stream for the file `output.txt`.
3. We define the data to be written (`const data = ...`).
4. We use `writableStream.write(data, (error) => {...})` to write the data to the stream. The callback function handles any errors that might occur during writing.
5. The `writableStream.on('finish', () => {...})` line listens for the `finish` event, which signals that all data has been written successfully.
6. The `writableStream.on('error', (error) => {...})` line handles errors during the writing process.

# Buffers

In Node.js, buffers are essential for handling raw binary data. They represent fixed-size memory allocations that temporarily hold data before it's processed or written to streams. Here's a detailed explanation of buffers with code examples:

**Functionality:**

- **Binary Data:** Buffers store raw binary data, unlike strings which represent text characters.
- **Fixed Size:** Buffers have a predetermined size allocated in memory, which cannot be changed after creation.
- **Temporary Storage:** Buffers act as an intermediary between streams (data sources/destinations) and your application code.

**Common Use Cases:**

- Working with binary data like images, audio files, or network packets.
- Exchanging data with external services or devices that use binary formats.
- Manipulating raw data before processing or writing it to a stream.

**Creating Buffers:**

There are several ways to create buffers in Node.js:

1. **Using `Buffer.alloc(size)`:** Allocates a new buffer of a specific size (in bytes) filled with zeros.

```javascript
const buffer1 = Buffer.alloc(10); // Creates a 10-byte buffer filled with zeros
console.log(buffer1); // Output: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

2. **Using `Buffer.from(data)`:** Creates a buffer from an existing array, string, or another buffer.

```javascript
const data = "Hello World!";
const buffer2 = Buffer.from(data); // Creates a buffer from the string
console.log(buffer2.toString()); // Output: Hello World!
```

3. **Using `Buffer.from(array)`:** Creates a buffer from an array of numbers (interpreted as byte values).

```javascript
const numbers = [65, 104, 101, 108, 108, 111]; // ASCII codes for 'Hello'
const buffer3 = Buffer.from(numbers);
console.log(buffer3.toString()); // Output: Hello
```

**Working with Buffers:**

Buffers offer various methods for accessing and manipulating data:

- **`buffer.length`:** Returns the buffer's size in bytes.
- **`buffer.write(string, offset, length, encoding)`:** Writes data to the buffer at a specific offset (optional).
- **`buffer.toString(encoding)`:** Converts the buffer content to a string using a specified encoding (e.g., 'utf8', 'ascii').
- **`buffer.slice(start, end)`:** Extracts a sub-buffer from the original buffer.

**Example: Manipulating a Buffer:**

```javascript
const message = "Node.js Buffers";
const buffer = Buffer.from(message);

console.log(buffer.toString()); // Output: Node.js Buffers

// Write additional data to the buffer (starting at byte 8)
buffer.write(" - for binary data!", 8);

console.log(buffer.toString()); // Output: Node.js Buffers - for binary data!

// Extract a sub-buffer
const subBuffer = buffer.slice(0, 10); // Extract first 10 bytes
console.log(subBuffer.toString()); // Output: Node.js Buffers
```

**Key Points:**

- Buffers are crucial for handling binary data in Node.js applications.
- Understand buffer size limitations and choose an appropriate creation method based on your data source.
- Buffers provide methods for reading, writing, and manipulating binary data efficiently.

By effectively using buffers, you can work with various data formats and build robust Node.js applications that interact with binary data streams.

# Transform Streams

In Node.js, transform streams act as powerful intermediaries within the stream pipeline. They allow you to process and modify data chunks as they flow between a readable stream (source) and a writable stream (destination). Here's a breakdown of transform streams with code examples:

**Functionality:**

- **Data Transformation:** Transform streams intercept data chunks from a readable stream, modify them according to your logic, and push the transformed data to a writable stream.
- **Duplex Nature:** They inherit functionality from both readable and writable streams, allowing them to read data and write transformed data.
- **`_transform` Method:** This is the core of a transform stream. It's a callback function where you define the data transformation logic.

**Common Use Cases:**

- Data encryption/decryption.
- Data compression/decompression.
- Data validation and filtering.
- Applying custom transformations on data streams.

**Creating a Transform Stream:**

You can create a transform stream by extending the `Transform` class from the Node.js `stream` module. Here's the basic structure:

```javascript
const { Transform } = require('stream');

class MyTransformStream extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    // Your data transformation logic goes here
    const transformedChunk = ...; // Apply transformations to chunk
    callback(null, transformedChunk); // Push transformed data
  }
}
```

**Explanation:**

1. We import the `Transform` class from the `stream` module.
2. We define a custom class `MyTransformStream` that extends `Transform`.
3. The `_transform` method is the heart of the stream. It receives three arguments:
   - `chunk`: The data chunk received from the readable stream.
   - `encoding`: The encoding of the data chunk (e.g., 'utf8').
   - `callback`: A function to call after processing the chunk.
4. Inside `_transform`, you implement your logic to modify the `chunk` data.
5. Once the transformation is complete, call the `callback` function with two arguments:
   - `null` (or an error if there was one)
   - The `transformedChunk` (containing the modified data)

**Code Example: Uppercasing Text Stream:**

```javascript
const { Transform } = require("stream");

class UppercaseStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformedChunk = chunk.toString().toUpperCase();
    callback(null, transformedChunk);
  }
}

const readableStream = fs.createReadStream("data.txt");
const writableStream = fs.createWriteStream("uppercase.txt");
const transformStream = new UppercaseStream();

readableStream.pipe(transformStream).pipe(writableStream);

readableStream.on("error", (error) => {
  console.error("Error reading file:", error);
});

writableStream.on("error", (error) => {
  console.error("Error writing file:", error);
});
```

**Explanation:**

1. We create a custom `UppercaseStream` class extending `Transform`.
2. The `_transform` method converts the received chunk to a string, uppercases it, and passes it to the callback as the transformed chunk.
3. We create readable and writable streams for the input and output files.
4. We create an instance of `UppercaseStream`.
5. We use the `pipe` method to connect the streams: `readableStream -> transformStream -> writableStream`. This creates a pipeline where data flows from the readable stream, gets transformed by the uppercase stream, and then written to the writable stream.

**Key Points:**

- Transform streams offer a powerful way to manipulate data streams in Node.js applications.
- The `_transform` method is crucial for defining your data processing logic.
- You can chain multiple transform streams together to perform complex data transformations.

By understanding and using transform streams effectively, you can build flexible and adaptable Node.js applications that handle data processing within stream pipelines.

# Conclusion

We learned about streaming and buffers, concepts that will come very handy when building Node JS projects.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
