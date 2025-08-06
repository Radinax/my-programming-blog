---
title: "Mastering Data Transformation in Node.js: Sorting, Deduplication & Cleaning"
description: "Learn how to fetch, sort, deduplicate, and clean JSON data in Node.js with deep dives into object manipulation, case-insensitive sorting, and structural integrity preservation."
category: ["node", "javascript"]
pubDate: "2025-08-06"
published: true
---

## Table of contents

# Introduction

In modern backend development, handling raw data from APIs is a daily task. But receiving data is only the beginning, the real challenge lies in **transforming it into a clean, consistent, and usable format**.

In this article, we’ll walk through a practical Node.js coding exercise that simulates real-world data processing challenges:

- Fetching JSON from an external API
- Sorting object keys alphabetically (case-insensitively)
- Removing duplicate objects from arrays, where **key order matters**
- Stripping out useless properties (`""`, `null`, `undefined`)
- Preserving nested data structures throughout

This isn’t just a theoretical problem, it mirrors scenarios you’d encounter when normalizing configuration files, syncing datasets, or building ETL pipelines.

By the end of this guide, you'll understand not only _how_ to solve the problem, but _why_ certain approaches are necessary, especially when dealing with JavaScript’s quirks around object key ordering and deep equality.

Let’s dive in.

---

# Fetching JSON Data in Node.js

Before we can process any data, we need to retrieve it. In Node.js, one of the most fundamental modules for making HTTP requests is `https`, which allows us to perform GET, POST, and other operations without external dependencies.

```js
const https = require("https");

https.get("https://coderbyte.com/api/challenges/json/wizard-list", (resp) => {
  let data = "";

  resp.on("data", (chunk) => {
    data += chunk;
  });

  resp.on("end", () => {
    const jsonData = JSON.parse(data);
    // Process jsonData here
  });
});
```

### Why Use Streams?

HTTP responses in Node.js are **streams**, meaning data arrives in chunks. We cannot assume the entire response is available immediately. That’s why we:

- Listen to the `"data"` event to accumulate chunks.
- Use `"end"` to know when the full payload has been received.
- Only then parse the JSON.

> Tip: Always wrap `JSON.parse()` in a `try/catch` block when dealing with external data, malformed JSON is common and will crash your app if unhandled.

This low-level approach using native `https` is lightweight and dependency-free, perfect for learning or minimal environments.

---

# Sorting Object Keys Case-Insensitively

Once we have the data, our first transformation is to **sort object keys alphabetically**, ignoring case.

At first glance, this seems simple, but there are nuances:

- JavaScript objects **do** preserve insertion order (since ES2015).
- But APIs may return keys in arbitrary order.
- For consistency (e.g., caching, diffing, logging), we want predictable key ordering.

### The Challenge

We must:

- Recursively sort keys in every object.
- Sort them **case-insensitively** (so `"age"` comes before `"Name"`).
- Preserve arrays and nested structures.

### The Solution

```js
function sortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === "object") {
    const sortedObj = {};
    const sortedKeys = Object.keys(obj).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );

    for (const key of sortedKeys) {
      sortedObj[key] = sortObjectKeys(obj[key]);
    }
    return sortedObj;
  }
  return obj;
}
```

### Deep Dive: `localeCompare` with `{ sensitivity: "base" }`

The `String.prototype.localeCompare()` method is powerful:

- It compares strings in a locale-aware way.
- The option `{ sensitivity: "base" }` ignores case and accent differences.

Example:

```js
"a".localeCompare("B", undefined, { sensitivity: "base" }); // -1 (a < B)
```

This ensures `"age"` comes before `"Name"`, even though uppercase letters come first in ASCII.

We recursively apply this to every object, maintaining structure while enforcing alphabetical key order.

---

# Removing Duplicate Objects with Key-Order Sensitivity

Now comes a subtle but critical part: **removing duplicate objects from arrays**.

But here’s the twist: two objects are considered duplicates **only if they have the same keys, values, and key order**.

### Why Key Order Matters

Consider these two objects:

```js
const obj1 = { name: "Alice", age: 30 };
const obj2 = { age: 30, name: "Alice" };
```

They are _semantically_ equal, but **not structurally identical** if key order matters.

In JavaScript, object key order is preserved for string keys (excluding some edge cases), so we must respect it.

### Custom Deep Equality with Key Order

We can’t use `JSON.stringify()` directly because:

- It may serialize keys in different orders.
- It doesn’t guarantee consistent output unless keys are pre-sorted.

So we write our own deep comparison:

```js
function deepEqual(a, b) {
  if (a === b) return true;
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (keysA[i] !== keysB[i]) return false; // Key order differs
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}
```

This function checks:

1. Reference equality
2. Type and null safety
3. Same number of keys
4. **Same key names in the same order**
5. Recursive value equality

### 🧹 Removing Duplicates

With `deepEqual`, we can now deduplicate arrays:

```js
function removeDuplicates(arr) {
  if (!Array.isArray(arr)) return arr;

  const unique = [];
  for (const item of arr) {
    if (!unique.some((existing) => deepEqual(item, existing))) {
      unique.push(item);
    }
  }
  return unique.map((el) => removeDuplicates(el)); // Recurse into nested arrays
}
```

We preserve the **first occurrence** of each unique object, a common requirement in deduplication logic.

---

# Cleaning Empty or Null Properties

After sorting and deduplication, we clean up the data by removing useless fields.

We want to eliminate any property where the value is:

- Empty string (`""`)
- `null`
- `undefined`

And we do this **recursively**, so nested objects are also cleaned.

### The Recursive Cleaner

```js
function removeEmptyProperties(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeEmptyProperties);
  } else if (obj !== null && typeof obj === "object") {
    const cleanedObj = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeEmptyProperties(value);
      if (
        cleanedValue !== "" &&
        cleanedValue !== null &&
        cleanedValue !== undefined
      ) {
        cleanedObj[key] = cleanedValue;
      }
    }
    return cleanedObj;
  }
  return obj;
}
```

### Why Recursion?

Because data can be deeply nested:

```json
{
  "users": [
    {
      "profile": {
        "name": "John",
        "tempField": null
      }
    }
  ]
}
```

Our function traverses every level, ensuring no empty values remain, even inside nested arrays or objects.

> **Note**: We do **not** delete the entire object if it becomes empty, we just return `{}`. That preserves structure unless everything was invalid.

---

# Putting It All Together: The Complete Solution

Now that we’ve built each piece, let’s assemble the full program.

```js
const https = require("https");

// Step 1: Sort object keys case-insensitively
function sortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === "object") {
    const sortedObj = {};
    const sortedKeys = Object.keys(obj).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
    for (const key of sortedKeys) {
      sortedObj[key] = sortObjectKeys(obj[key]);
    }
    return sortedObj;
  }
  return obj;
}

// Step 2: Deep equality with key order
function deepEqual(a, b) {
  if (a === b) return true;
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    if (keysA[i] !== keysB[i]) return false;
    if (!deepEqual(a[keysA[i]], b[keysB[i]])) return false;
  }
  return true;
}

// Step 3: Remove duplicates
function removeDuplicates(arr) {
  if (!Array.isArray(arr)) return arr;
  const unique = [];
  for (const item of arr) {
    if (!unique.some((existing) => deepEqual(item, existing))) {
      unique.push(removeDuplicates(item));
    }
  }
  return unique;
}

// Step 4: Clean empty values
function removeEmptyProperties(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeEmptyProperties);
  } else if (obj !== null && typeof obj === "object") {
    const cleanedObj = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeEmptyProperties(value);
      if (
        cleanedValue !== "" &&
        cleanedValue !== null &&
        cleanedValue !== undefined
      ) {
        cleanedObj[key] = cleanedValue;
      }
    }
    return cleanedObj;
  }
  return obj;
}

// Main Execution
https
  .get("https://coderbyte.com/api/challenges/json/wizard-list", (resp) => {
    let data = "";

    resp.on("data", (chunk) => (data += chunk));

    resp.on("end", () => {
      try {
        let result = JSON.parse(data);

        result = sortObjectKeys(result); // Sort keys
        result = removeDuplicates(result); // Remove duplicates
        result = removeEmptyProperties(result); // Clean nulls/empties

        console.log(JSON.stringify(result)); // Final output as string
      } catch (err) {
        console.error("Error processing data:", err);
      }
    });
  })
  .on("error", (err) => {
    console.error("Request failed:", err);
  });
```

### Run the Code

Save as `process-wizard.js` and run:

```bash
node process-wizard.js
```

You’ll see a clean, sorted, deduplicated JSON string printed to the console.

---

# Conclusion

This exercise may seem small, but it touches on **core skills** every backend or full-stack developer must master:

- Working with HTTP streams
- Recursive data transformation
- Deep object comparison
- Structural normalization
- Data hygiene

We didn’t use any external libraries, just pure JavaScript and Node.js fundamentals. That makes this solution **lightweight, debuggable, and educational**.

Whether you're normalizing API responses, preparing data for storage, or building a sync engine, the patterns here, sorting, deduplication, cleaning, will serve you well.

And remember: in data processing, **consistency and predictability** are just as important as correctness.

---

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
