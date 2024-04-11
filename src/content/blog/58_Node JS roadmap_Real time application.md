---
title: "[Roadmap_Node] 14_Real time application"
description: "Let us talk about real time applications, we typically associate it with web sockets, but there are more tools we can use for this commonly requested feature"
category: ["node"]
pubDate: "2024-04-08T10:00:00-04:00"
published: true
---

## Table of content

# Introduction

Node.js shines in the realm of real-time applications. Its event-driven architecture and non-blocking I/O model make it perfectly suited for building dynamic applications that update users instantly without needing page refreshes. Here's a breakdown of why Node.js excels in this area, some concepts we already saw in previous posts:

- **Event-Driven Architecture:** Node.js handles multiple connections simultaneously using an event loop. This means it can efficiently respond to events (like user actions) as they occur, enabling real-time data exchange.

- **Non-Blocking I/O:** Node.js doesn't wait for I/O operations (like database interactions) to finish before handling other requests. This prevents delays and keeps the server responsive, crucial for real-time applications.

- **WebSockets:** Real-time communication between server and client is often achieved through WebSockets. Node.js integrates well with WebSockets, allowing for persistent two-way communication channels that push data updates in real-time.

- **JavaScript Codebase:** Node.js uses JavaScript on both the server and client-side. This simplifies development and deployment, as developers can leverage the same language for both parts of the application.

Here are some popular examples of real-time applications built with Node.js:

- **Chat Applications:** Instant messaging platforms rely heavily on real-time communication to deliver messages as they are sent. Node.js is a popular choice for building these applications due to its speed and scalability.

- **Collaboration Tools:** Real-time collaboration tools like Google Docs or shared whiteboards require constant data updates between users. Node.js is well-suited for these applications as it can manage multiple concurrent connections and synchronize data efficiently.

- **Social Media Feeds:** Social media platforms that update feeds with new posts or notifications in real-time leverage Node.js's event-driven architecture to push updates to users as soon as they happen.

- **Online Gaming:** Many online games require real-time communication between players. Node.js can handle the fast-paced data exchange needed for smooth gameplay.

# Web sockets

WebSockets are a powerful tool for enabling real-time, two-way communication between a web server (Node.js in our case) and a client (web browser). Unlike traditional HTTP requests, which are one-off exchanges, WebSockets establish persistent connections that allow for continuous data exchange.

Here's how WebSockets work in Node.js:

1. **Library Setup:** You'll typically use a third-party library like `ws` to handle WebSocket functionality. Install it using `npm install ws`.

2. **Server-Side Implementation:**

   - Create a WebSocket server using `ws.Server({ port: 8080 })`, specifying the port to listen on.
   - Define event listeners for:
     - `connection`: Triggered when a client connects.
     - `message`: Invoked when a message is received from the client.
     - `close`: Called when the connection closes.

3. **Client-Side Implementation:**
   - Use the browser's built-in `WebSocket` object to connect to the server's WebSocket endpoint (e.g., `ws://localhost:8080`).
   - Add event listeners for:
     - `open`: Fired when the connection is established.
     - `message`: Handles incoming messages from the server.
     - `close`: Notifies when the connection is closed.

Here's an example showcasing a simple echo server in Node.js:

```javascript
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server listening on port 8080");
```

This code creates a WebSocket server that listens on port 8080. When a client connects, the `connection` event logs a message. Any message received from the client is echoed back to the client after being logged on the server. The `close` event is triggered when the connection closes.

**Client-side example (HTML):**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>WebSocket Client</title>
  </head>
  <body>
    <h1>WebSocket Test</h1>
    <script>
      const ws = new WebSocket("ws://localhost:8080");

      ws.onopen = () => {
        console.log("Connected to server");
        ws.send("Hello from client!");
      };

      ws.onmessage = (message) => {
        console.log(`Received message from server: ${message.data}`);
      };

      ws.onclose = () => {
        console.log("Disconnected from server");
      };
    </script>
  </body>
</html>
```

This HTML code includes a basic script that connects to the WebSocket server running on port 8080. It sends a message upon successful connection and logs any messages received from the server.

# Server-Sent Events (SSE)

Server-Sent Events (SSE) are another technique for real-time communication in Node.js applications. Unlike WebSockets, SSE provides a simpler, one-way communication channel from the server to the client. Here's a breakdown of SSE in Node.js:

**Concepts:**

- **EventSource:** The browser-side API for SSE. It allows clients to open a long-lived connection to the server and receive updates as they are sent.
- **Event Stream:** The server response format for SSE. It consists of text messages separated by newlines (`\n`).

**Node.js Implementation:**

1. **Express Setup:** We'll use Express.js for a simple server. Install it with `npm install express`.
2. **SSE Route:** Create a route handler that sets the response headers for SSE:

```javascript
const express = require("express");

const app = express();

app.get("/sse", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  // Send data here ...
});
```

3. **Sending Events:** Use `res.write` to send data to the client. Each message needs two newlines (`\n\n`) appended.

```javascript
  const intervalId = setInterval(() => {
    const data = { message: 'Hello from server!' };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000); // Send data every second

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(intervalId);
  });
});
```

**Client-Side Implementation:**

1. **EventSource:** Use `new EventSource('/sse')` to create a connection to the server's SSE endpoint.
2. **Event Listeners:** Attach event listeners to handle:
   - `message`: Receives data from the server.
   - `error`: Handles any connection errors.

```javascript
const eventSource = new EventSource("/sse");

eventSource.onmessage = (event) => {
  console.log(`Received message: ${event.data}`);
};

eventSource.onerror = (error) => {
  console.error("SSE connection error:", error);
};
```

**Complete Example:**

Here's a Node.js server with an SSE endpoint and a basic HTML client:

**server.js:**

```javascript
const express = require("express");

const app = express();

app.get("/sse", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const intervalId = setInterval(() => {
    const data = { message: "Hello from server!" };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000);

  req.on("close", () => {
    clearInterval(intervalId);
  });
});

app.listen(3000, () => console.log("Server listening on port 3000"));
```

**index.html:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>SSE Client</title>
  </head>
  <body>
    <h1>Server-Sent Events</h1>
    <script>
      const eventSource = new EventSource("/sse");

      eventSource.onmessage = (event) => {
        console.log(`Received message: ${event.data}`);
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
      };
    </script>
  </body>
</html>
```

This example demonstrates a basic SSE implementation. In real-world applications, you'd likely send more meaningful data and handle events more elaborately. Remember, SSE is useful for unidirectional server-to-client updates, while WebSockets provide two-way communication.

# WebRTC (Web Real-Time Communication)

WebRTC (Web Real-Time Communication) is a free, open-source project that equips web browsers and mobile applications with real-time communication (RTC) capabilities. It achieves this through APIs (Application Programming Interfaces) that enable developers to build features like video calls, voice chats, and data transfers directly within web applications, without requiring additional plugins or software installations.

Here's a breakdown of WebRTC's key features:

- **Real-time Communication:** WebRTC facilitates direct peer-to-peer communication between devices, enabling low-latency data exchange for features like video conferencing and online gaming.

- **Browser and Mobile Support:** WebRTC is natively supported by most modern web browsers and can also be integrated into mobile applications for broader reach.

- **Open Standard:** Being an open-source project, WebRTC ensures transparency, interoperability, and continuous development by the web community.

- **APIs for Developers:** WebRTC provides a set of APIs that developers can leverage to add real-time functionalities to their web applications. These APIs include:
  - getUserMedia: Allows access to a device's camera and microphone.
  - PeerConnection: Establishes audio/video calls between peers.
  - DataChannel: Enables direct data exchange between browsers.

**Applications of WebRTC:**

WebRTC has revolutionized web-based communication, making it possible to develop a variety of real-time applications including:

- **Video Calling:** WebRTC is a cornerstone of many popular video calling applications, enabling web-based video conferencing without downloads.

- **Live Streaming:** WebRTC allows for live streaming directly from a web browser, facilitating live broadcasts for various purposes.

- **Online Gaming:** Real-time multiplayer games leverage WebRTC for low-latency communication between players, enhancing the gaming experience.

- **Collaborative Tools:** WebRTC can be integrated into collaborative tools to enable real-time co-editing and document sharing.

- **Social Media:** WebRTC can be used for real-time features in social media platforms, such as video chat or live interactions.

In conclusion, WebRTC is a powerful technology that has transformed web communication by enabling real-time, browser-based features. Its open-source nature and support across platforms make it a valuable tool for developers to create innovative and engaging web applications.

**How does Node JS fits in with WebRTC**

Node.js itself doesn't directly handle video calls through WebRTC. However, it plays a crucial role in facilitating WebRTC communication between browsers by acting as a signaling server. WebRTC relies on a signaling mechanism to establish connections between peers and exchange necessary data for the video call. Here's a breakdown of how Node.js fits in:

**WebRTC Roles:**

- **Browser (Peer):** Handles capturing media (webcam, microphone), negotiating connection details with the other peer, and rendering the video streams.
- **Signaling Server (Node.js):** Enables peers to discover each other, exchange connection information (ICE candidates, Session Description Protocol (SDP) offers/answers), and potentially manage rooms or channels for multi-party calls.

**Node.js with WebRTC:**

1. **WebSockets or Similar:** The signaling server typically uses WebSockets for real-time communication with the clients (browsers).
2. **Peer Discovery/Management:** The server can keep track of connected clients and facilitate communication initiation (e.g., listing available users, creating rooms).
3. **SDP/ICE Exchange:** The server acts as a relay for SDP offers/answers and ICE candidates exchanged between peers during WebRTC connection negotiation.

**Code Example (Simplified):**

Here's a very basic Node.js server with WebSockets to illustrate the concept (not suitable for a production application):

```javascript
const WebSocket = require("ws");
const clients = new Map(); // Track connected clients

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  clients.set(ws, { id: Math.random().toString() }); // Assign a random ID

  ws.onmessage = (message) => {
    const data = JSON.parse(message);

    if (data.type === "join") {
      // Broadcast join message to other clients
      wss.clients.forEach((client) => {
        if (client !== ws) {
          client.send(
            JSON.stringify({ type: "peer-joined", data: clients.get(ws).id })
          );
        }
      });
    } else if (data.type === "ice-candidate" || data.type === "sdp") {
      // Relay ICE candidates and SDP to the other peer (identified by data.target)
      wss.clients.forEach((client) => {
        if (clients.get(client).id === data.target) {
          client.send(JSON.stringify(data));
        }
      });
    }
  };

  ws.on("close", () => {
    const clientId = clients.get(ws).id;
    clients.delete(ws);
    // Broadcast leave message to other clients
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: "peer-left", data: clientId }));
    });
  });
});

console.log("Signaling server listening on port 8080");
```

**Explanation:**

- This code creates a WebSocket server that stores connected clients in a `Map`.
- Clients can send messages to join a call, and the server broadcasts this message to other clients.
- Clients also send ICE candidates and SDP during the WebRTC negotiation process, which the server relays to the intended peer.
- In a real application, you'd implement additional logic for security, room management, and error handling.

**Remember:** This is a simplified example to showcase the concept. Building a robust WebRTC video calling application requires additional libraries for WebRTC functionality in the browser and potentially media servers for recording or streaming.

# Conclusion

Most of the time we will use Websockets for RTC, its quite simple in concept and can get quite complex depending on the feature requirements.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
