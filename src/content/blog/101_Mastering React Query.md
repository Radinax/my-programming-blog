---
title: "Mastering Tanstack Query: A Practical Guide to Modern Data Fetching in React"
description: "Learn the essential features of Tanstack Query with clear explanations and practical examples — from simple queries to suspense, optimistic updates, and more."
category: ["typescript"]
pubDate: "2025-08-01"
published: true
---

## Table of contents

- [Introduction](#introduction)
- [Simple Queries](#simple-queries)
- [Custom Queries](#custom-queries)
- [Selectors](#selectors)
- [Parametrized Queries](#parametrized-queries)
- [Prefetching](#prefetching)
- [Infinite Queries](#infinite-queries)
- [Query Key Factories](#query-key-factories)
- [Simple Mutations](#simple-mutations)
- [Query Invalidation](#query-invalidation)
- [Automatic Query Invalidation](#automatic-query-invalidation)
- [Global Error Handling](#global-error-handling)
- [Optimistic Updates in UI](#optimistic-updates-in-ui)
- [Optimistic Updates in Cache](#optimistic-updates-in-cache)
- [Suspense in Queries](#suspense-in-queries)
- [Conclusion](#conclusion)

# Introduction

This is one of the "must install" libraries in the world of Frontend, it serves as a layer to control the server state. In this article we will learn how it works, some simple examples so you can grasp the concepts.

Tanstack Query, is a powerful state management library for fetching, caching, and synchronizing server state in React applications. It eliminates the need for manual data synchronization, reduces boilerplate, and provides advanced features like caching, background updates, and optimistic mutations, all with a clean, intuitive API.

In this guide, we’ll walk through 14 essential Tanstack Query concepts, each with a brief explanation and a practical TypeScript/React code example.

# Simple Queries

**What it is:** The `useQuery` hook fetches data from an API and manages loading, error, and success states automatically.

**Why it’s useful:** It replaces manual `useState`/`useEffect` data fetching with a declarative, cache-aware alternative.

```jsx
import { useQuery } from "@tanstack/react-query";

const fetchTodos = () => fetch("/api/todos").then((res) => res.json());

function Todos() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading todos</div>;

  return (
    <ul>
      {data?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

# Custom Queries

**What it is:** Reusable hooks that wrap `useQuery` to encapsulate logic for specific data.

**Why it’s useful:** Promotes code reuse and separation of concerns.

```jsx
function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/api/todos").then((res) => res.json()),
  });
}

function TodoList() {
  const { data, isLoading } = useTodos();
  // ... render logic
}
```

# Selectors

**What it is:** The `select` option transforms the query result before it’s returned.

**Why it’s useful:** Extract or compute specific data without affecting the cache.

```jsx
const { data: todoTitles } = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  select: (data) => data.map((todo) => todo.title),
});
```

# Parametrized Queries

**What it is:** Queries that accept dynamic parameters (e.g., user ID, page number).

**Why it’s useful:** Enables fetching data based on runtime values.

```jsx
function useUser(userId) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetch(`/api/users/${userId}`).then((res) => res.json()),
    enabled: !!userId,
  });
}
```

# Prefetching

**What it is:** Load data in advance before it’s needed (e.g., on hover or route anticipation).

**Why it’s useful:** Improves perceived performance and UX.

```jsx
function UserLink({ userId }) {
  const queryClient = useQueryClient();

  return (
    <a
      href={`/users/${userId}`}
      onMouseEnter={() => {
        queryClient.prefetchQuery({
          queryKey: ["user", userId],
          queryFn: () =>
            fetch(`/api/users/${userId}`).then((res) => res.json()),
        });
      }}
    >
      View User
    </a>
  );
}
```

# Infinite Queries

**What it is:** Fetch paginated data and load more on demand (e.g., infinite scroll).

**Why it’s useful:** Efficiently handle large datasets.

```jsx
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["posts"],
  queryFn: ({ pageParam = 1 }) =>
    fetch(`/api/posts?page=${pageParam}`).then((res) => res.json()),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

return (
  <>
    {data?.pages.map((page, i) => (
      <div key={i}>
        {page.items.map((post) => (
          <p key={post.id}>{post.title}</p>
        ))}
      </div>
    ))}
    <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
      Load More
    </button>
  </>
);
```

For a more real application of this:

```jsx
import { useInfiniteQuery } from '@tanstack/react-query';

// Simulated API response type
type PostsResponse = {
  items: { id: string; title: string; body: string }[];
  nextPage: number | null;
};

// Fetch function with pagination support
const fetchPosts = async ({ pageParam = 1 }): Promise<PostsResponse> => {
  const res = await fetch(`/api/posts?page=${pageParam}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage, // tells Tanstack Query the next cursor/page
    initialPageParam: 1,
  });

  if (isLoading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {(error as Error).message}</div>;

  return (
    <div>
      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.items.map((post) => (
            <article key={post.id} className="post">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </article>
          ))}
        </React.Fragment>
      ))}

      <div className="controls" style={{ textAlign: 'center', margin: '16px 0' }}>
        {hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </button>
        ) : (
          <p><em>You've reached the end!</em></p>
        )}
      </div>

      {isFetchingNextPage && <p style={{ textAlign: 'center' }}>Fetching more posts...</p>}
    </div>
  );
}
```

If we want an infinite scrolling, we can use Intersection Observer:

```jsx
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

type Post = {
  id: string;
  title: string;
  body: string;
};

type PostsResponse = {
  items: Post[];
  nextPage: number | null;
  prevPage: number | null;
};

const fetchPosts = async ({ pageParam = 1 }): Promise<PostsResponse> => {
  const res = await fetch(`/api/posts?page=${pageParam}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

function InfinitePostList() {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['infinite-posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Auto-load when user scrolls to bottom
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {(error as Error).message}</div>;

  return (
    <div>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.items.map((post) => (
            <article key={post.id} className="post" style={{ margin: '16px 0', padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </article>
          ))}
        </React.Fragment>
      ))}

      {/* Sentinel element for infinite scroll */}
      <div ref={loadMoreRef} style={{ height: '40px', textAlign: 'center' }}>
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? '⬇️ Keep scrolling' : '🎉 End of content'}
      </div>
    </div>
  );
}
```

Finally lets check a bi-directional pagination (prev and next):

```jsx
type PaginatedPostResponse = {
  items: Post[];
  currentPage: number;
  totalPages: number;
};

const fetchPage = async ({ pageParam = 1 }): Promise<PaginatedPostResponse> => {
  const res = await fetch(`/api/posts?page=${pageParam}`);
  if (!res.ok) throw new Error('Failed to fetch page');
  return res.json();
};

function BidirectionalPaginatedList() {
  const {
    data,
    fetchPreviousPage,
    fetchNextPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['paginated-posts'],
    queryFn: fetchPage,
    queryKeyHashFn: (key) => JSON.stringify(key),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined,
    getPreviousPageParam: (firstPage, pages) =>
      firstPage.currentPage > 1 ? firstPage.currentPage - 1 : undefined,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const currentPage = data?.pages.at(-1)?.currentPage || 1;
  const totalPages = data?.pages.at(-1)?.totalPages || 1;

  return (
    <div>
      {/* Render all fetched pages */}
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.items.map((post) => (
            <article key={post.id} className="post" style={{ margin: '16px 0', padding: '16px', border: '1px solid #ccc', borderRadius: '6px' }}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </article>
          ))}
        </React.Fragment>
      ))}

      {/* Pagination Controls */}
      <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button
          onClick={() => fetchPreviousPage()}
          disabled={!hasPreviousPage || isFetching}
          style={{ padding: '10px 16px', background: hasPreviousPage ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          ← Previous
        </button>

        <span style={{ alignSelf: 'center', fontSize: '14px' }}>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>

        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetching}
          style={{ padding: '10px 16px', background: hasNextPage ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Next →
        </button>
      </div>

      {isFetching && <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Loading...</p>}
    </div>
  );
}
```

# Query Key Factories

**What it is:** A centralized object that defines and standardizes query keys.

**Why it’s useful:** Prevents typos and makes refactoring easier.

```jsx
// queryOptions.ts
import { queryOptions } from '@tanstack/react-query';

// Define your API types
type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

// Query Key Factories (centralized)
const todoKeys = {
  all: () => ['todos'] as const,
  lists: () => [...todoKeys.all(), 'list'] as const,
  list: (filters?: { completed: boolean }) =>
    [...todoKeys.lists(), { filters }] as const,
  detail: () => [...todoKeys.all(), 'detail'] as const,
  detailById: (id: number) => [...todoKeys.detail(), id] as const,
};

// Reusable query options
export const todoQueryOptions = {
  getTodos: () => queryOptions({
    queryKey: todoKeys.lists(),
    queryFn: () => fetch('/api/todos').then(res => res.json() as Promise<Todo[]>),
  }),
  getTodoById: (id: number) => queryOptions({
    queryKey: todoKeys.detailById(id),
    queryFn: () => fetch(`/api/todos/${id}`).then(res => res.json() as Promise<Todo>),
    enabled: !!id,
  }),
};
```

Using `getTodos`:

```jsx
// TodoList.tsx
import { useQuery } from "@tanstack/react-query";
import { todoQueryOptions } from "./queryOptions";

function TodoList() {
  const { data, isLoading } = useQuery(todoQueryOptions.getTodos());

  if (isLoading) return <div>Loading todos...</div>;

  return (
    <ul>
      {data?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

Using `getTodoById`:

```jsx
// TodoDetail.tsx
function TodoDetail({ id }: { id: number }) {
  const { data, isLoading } = useQuery(todoQueryOptions.getTodoById(id));

  if (isLoading) return <div>Loading todo...</div>;
  if (!data) return <div>Todo not found</div>;

  return (
    <div>
      <h2>{data.title}</h2>
      <p>Completed: {data.completed ? "Yes" : "No"}</p>
    </div>
  );
}
```

# Simple Mutations

**What it is:** The `useMutation` hook handles data changes (create, update, delete).

**Why it’s useful:** Manages mutation lifecycle (loading, success, error) cleanly.

```jsx
const mutation = useMutation({
  mutationFn: (newTodo) =>
    fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify(newTodo),
    }).then((res) => res.json()),
});

function addTodo() {
  mutation.mutate({ title: "New Todo" });
}
```

# Query Invalidation

**What it is:** Manually mark a query as stale to trigger a refetch.

**Why it’s useful:** Keep data fresh after mutations.

```jsx
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: updateTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

# Automatic Query Invalidation

**Why it’s useful:** Tanstack Query can refetch queries in the background when they become stale.

```jsx
useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  staleTime: 1000 * 60, // 1 minute
  gcTime: 1000 * 60 * 5, // 5 minutes
});
```

> Queries are automatically refetched when:
>
> - They become stale and re-enter view.
> - The window regains focus.
> - Network reconnects.

# Global Error Handling

**What it is:** Catch and handle errors from all queries and mutations in one place.

**Why it’s useful:** Avoid repetitive error checks and show user-friendly messages.

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        console.error("Query error:", error);
        // Show toast, log, etc.
      },
    },
  },
});

// Or use `onError` in individual hooks
```

# Optimistic Updates in UI

**What it is:** Update the UI immediately, assuming the mutation will succeed.

**Why it’s useful:** Makes apps feel faster and more responsive.

```jsx
const mutation = useMutation({
  mutationFn: toggleTodo,
  onMutate: (updatedTodo) => {
    // Optimistically update UI
    setLocalTodos((todos) =>
      todos.map((t) =>
        t.id === updatedTodo.id ? { ...t, completed: !t.completed } : t
      )
    );
  },
});
```

# Optimistic Updates in Cache

**What it is:** Update the Tanstack Query cache before the server responds, with rollback on error.

**Why it’s useful:** Keeps UI and cache in sync, even during failures.

```jsx
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ["todos"] });

    const previousTodos = queryClient.getQueryData(["todos"]);

    queryClient.setQueryData(["todos"], (old) =>
      old?.map((t) => (t.id === newTodo.id ? { ...t, ...newTodo } : t))
    );

    return { previousTodos };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(["todos"], context.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

# Suspense in Queries

**What it is:** The `useSuspenseQuery` hook integrates Tanstack Query with React’s Suspense mechanism, allowing components to declaratively suspend rendering while data is loading.

**Why it’s useful:** Eliminates manual loading and error checks inside components. Instead, you handle fallbacks and errors at a higher level using `Suspense` and `Error Boundary`, leading to cleaner, more predictable UIs.

> ⚠️ **Note:** `useSuspenseQuery` **does not return `isLoading` or `error`** — it throws during loading or on error, which React catches if wrapped in `Suspense` and an error boundary.

```jsx
// TodoDetail.tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { todoQueryOptions } from "./queryOptions"; // From Query Key Factories example

function TodoDetail({ id }: { id: number }) {
  // ✅ No need to check isLoading or error!
  const { data } = useSuspenseQuery(todoQueryOptions.getTodoById(id));

  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #ddd",
        margin: "8px 0",
        borderRadius: "6px",
      }}
    >
      <h2>{data.title}</h2>
      <p>
        <strong>Status:</strong>{" "}
        {data.completed ? "✅ Completed" : "🟡 Pending"}
      </p>
    </div>
  );
}
```

For this to work, we need to wrap it in a parent component:

```jsx
// App.tsx
import { Suspense } from "react";

function App() {
  return (
    <div>
      <h1>My Todo App</h1>

      <Suspense fallback={<div className="skeleton">🌀 Loading todo...</div>}>
        <TodoDetail id={5} />
      </Suspense>
    </div>
  );
}
```

> ⚠️ **Note:** Its better to make the client initialization with a suspense as false, then each query should decide if they want a Suspense or not.

# Conclusion

Tanstack Query simplifies data fetching in React by handling caching, synchronization, and state management with minimal boilerplate. From simple queries to advanced patterns like optimistic updates and infinite loading, it empowers developers to build fast, reliable, and scalable applications.

By mastering these 14 core concepts, you’ll be well-equipped to use Tanstack Query to its full potential, writing cleaner code and delivering a smoother user experience.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**

```

```
