---
title: "React Server Components (RSC): A Deep Dive into Modern React Development"
description: "Lets learn about RSC, what it is and some examples of how and when to use them"
category: ["typescript", "react", "nextjs", "concept"]
pubDate: "2025-03-30"
published: true
---

## Table of contents

# Introduction

React Server Components (RSC) have revolutionized the way we build web applications by introducing a paradigm shift in how components are rendered and delivered to users. Unlike traditional React, where all components are rendered on the client side, RSC allows developers to render components directly on the server. This approach unlocks new possibilities for performance optimization, seamless integration with backend systems, and improved user experiences.

In this article, we'll explore four key themes related to React Server Components: Asynchronous Components , RSC vs Client Components , Client-Server Composition , and Component Directives . Along the way, I'll provide clear explanations, code examples, and practical insights to help you understand and leverage this feature.

# Asynchronous Components: Rendering Data Without Blocking

One of the standout features of React Server Components is their ability to handle asynchronous operations seamlessly. Since RSCs run on the server, they can fetch data and render content without blocking the main thread on the client side. This eliminates the need for loading spinners or placeholders that were traditionally required while waiting for API responses.

### How It Works

When a server component fetches data, it suspends rendering until the data is available. During this time, React sends a placeholder to the client, ensuring the UI remains responsive. Once the data is ready, the server sends the updated component to the client, which replaces the placeholder.

### Example: Fetching Data in an RSC

Here’s an example of a server component that fetches blog posts asynchronously:

```jsx
// BlogPosts.server.js (Note the `.server.js` extension)
import { fetchData } from "./api";

export default async function BlogPosts() {
  const posts = await fetchData("/api/posts"); // Fetch data from the server
  return (
    <div>
      <h1>Latest Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

In this example:

- The `fetchData` function simulates an asynchronous API call.
- The component suspends rendering until the data is fetched.
- The final HTML is streamed to the client, reducing the need for additional client-side hydration.

This approach ensures that the client receives fully rendered components, minimizing JavaScript execution and improving performance.

---

# RSC vs Client Components: Understanding the Divide

React Server Components and Client Components serve different purposes and operate in distinct environments. Understanding their differences is crucial for designing efficient and scalable applications.

### Key Differences

| Feature                  | React Server Components (RSC)                 | Client Components                           |
| ------------------------ | --------------------------------------------- | ------------------------------------------- |
| **Environment**          | Runs on the server                            | Runs in the browser                         |
| **JavaScript Execution** | No JavaScript sent to the client              | Requires JavaScript for interactivity       |
| **State Management**     | Stateless; focuses on data fetching/rendering | Supports hooks like `useState`, `useEffect` |
| **Use Cases**            | Static content, data-heavy components         | Interactive elements, animations, etc.      |

### When to Use Each

- **Use RSC** for static or semi-static content, such as dashboards, blog pages, or product listings. These components benefit from server-side rendering and reduce the amount of JavaScript shipped to the client.
- **Use Client Components** for interactive features, such as form inputs, modals, or drag-and-drop interfaces. These require client-side interactivity and state management.

### Example: Combining RSC and Client Components

You can mix RSC and Client Components to achieve the best of both worlds. For instance:

```jsx
// ProductList.server.js
import ProductCard from "./ProductCard.client"; // Note the `.client.js` extension

export default async function ProductList() {
  const products = await fetchData("/api/products");
  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

```jsx
// ProductCard.client.js
import React, { useState } from "react";

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.price}</p>
      <button onClick={() => setIsFavorite(!isFavorite)}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
}
```

In this example:

- `ProductList` is a server component that fetches and renders product data.
- `ProductCard` is a client component that handles user interactions, such as adding a product to favorites.

---

# Client-Server Composition: Bridging the Gap

One of the most powerful aspects of React Server Components is their ability to compose seamlessly with client components. This allows developers to create hybrid applications where server-rendered content coexists with interactive client-side features.

### How Composition Works

React uses a concept called "hydration" to bridge the gap between server and client components. When a server-rendered component includes a client component, React sends only the necessary JavaScript to the client to make the component interactive. This minimizes the payload size and improves performance.

### Example: Nested Composition

Consider a scenario where a server-rendered dashboard includes a client-side charting library:

```jsx
// Dashboard.server.js
import Chart from "./Chart.client";

export default async function Dashboard() {
  const stats = await fetchData("/api/stats");
  return (
    <div>
      <h1>Dashboard</h1>
      <Chart data={stats.chartData} />
    </div>
  );
}
```

```jsx
// Chart.client.js
import React from "react";
import { Line } from "react-chartjs-2";

export default function Chart({ data }) {
  return <Line data={data} />;
}
```

Here:

- The `Dashboard` component fetches data on the server and passes it to the `Chart` client component.
- The `Chart` component uses a third-party library (`react-chartjs-2`) to render an interactive chart on the client side.

This composition ensures that the server handles heavy lifting (data fetching), while the client manages interactivity.

---

# Component Directives

React Server Components introduce a new concept called **component directives**, which allow developers to control how components behave during rendering. These directives are specified using special comments or file extensions.

### Common Directives

- **`.server.js`**: Marks a component as a server component. It cannot use hooks like `useState` or `useEffect`.
- **`.client.js`**: Marks a component as a client component. It can use hooks and interact with the DOM.
- **`use client`**: A directive placed at the top of a file to explicitly declare it as a client component.

### Example: Using Directives

```jsx
// Profile.server.js
export default function Profile() {
  return (
    <div>
      <h1>User Profile</h1>
      <ProfileDetails />
    </div>
  );
}

// ProfileDetails.client.js
'use client'; // Explicitly declares this as a client component

import React, { useState } from 'react';

export default function ProfileDetails() {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <EditForm />;
  }

  return <button onClick={() => setEditing(true)}>Edit Profile</button>;
}
```

In this example:

- `Profile` is a server component that renders static content.
- `ProfileDetails` is a client component that handles user interactions.

By using directives, developers can clearly define the boundaries between server and client logic, making the codebase easier to maintain.

---

# Conclusion

React Server Components represent a significant leap forward in modern web development. By leveraging **asynchronous components**, developers can deliver faster, more responsive applications. The distinction between **RSC and Client Components** enables better separation of concerns, while **client-server composition** allows for flexible and scalable architectures. Finally, **component directives** provide a clear way to manage the behavior of components across environments.

As we adopt React Server Components in our projects, remember to evaluate each component's role carefully. Use RSCs for data-heavy, static content, and reserve client components for interactive features. With these tools at our disposal, we can build high-performance, user-friendly applications that meet the demands of today's web.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
