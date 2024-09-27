---
title: "Fullstack authentication with React, Node, Hono, React Hook Forms, Zod and React Query"
description: "In this article we will learn how to do a fullstack authentication for any application you wish. Its fundamental to know how to perform auth in a fast way and have all the concepts known by the developer"
category:
  [
    "javascript",
    "react",
    "typescript",
    "node",
    "sqlite",
    "tailwind",
    "tanstack",
  ]
pubDate: "2024-09-27"
published: true
---

## Table of content

# Introduction

In the latest articles we have seen how to do Login/Register forms in the Frontend and using Zod with React Hook Forms separately, in this article I want to hyperfocus on authentication in a full-stack application using email and password, involving several key concepts and steps, particularly when utilizing a stack that includes React, React Hook Form, Hono, and Drizzle.

# Concepts

Authentication in a full-stack application using email and password involves several key concepts and steps, particularly when utilizing a stack that includes React, React Hook Form, Hono, and Drizzle. Below is a detailed explanation of the authentication process along with the underlying concepts.

## Key Concepts of Authentication

**Authentication vs. Authorization:**

- **Authentication** is the process of verifying the identity of a user. This typically involves checking credentials (like an email and password) to confirm that the user is who they claim to be.
- **Authorization**, on the other hand, determines what an authenticated user is allowed to do within the application. This involves checking user roles and permissions to control access to resources (out of the scope of this article, we will focus on role based permissions in later articles).

**User Credentials:**

- In this context, users will provide their email and password as credentials. The application must securely handle these credentials throughout the authentication process.

**Hashing Passwords:**

- For security purposes, passwords should never be stored in plain text. Instead, they are hashed using algorithms like bcrypt before being saved in the database. This ensures that even if the database is compromised, the actual passwords remain secure.

**JSON Web Tokens (JWT):**

- After successful authentication, a JWT is generated and sent to the client. This token contains encoded information about the user and is used for session management, allowing users to access protected routes without needing to log in repeatedly.

**Cookies**

- Cookies are an HTTP state management mechanism used to store data on the client-side. They are automatically sent with each HTTP request to the server that set them. Cookies can be used to store session IDs or authentication tokens like JWT.

### When to use Cookies

- **Automatic inclusion in requests**: Cookies are automatically sent with each HTTP request to the server that set them, making them convenient for maintaining session state.
- **Browser support**: Browsers natively support setting and sending cookies, simplifying the implementation of authentication flows.
- **Cross-site scripting (XSS) protection**: When set with the HttpOnly flag, cookies cannot be accessed by client-side scripts, providing protection against XSS attacks.
- **Cross-site request forgery (CSRF) protection**: When used with anti-CSRF tokens and the SameSite flag, cookies can help mitigate CSRF attacks.

### When to Use JWT

- **API authentication**: When the client is a separate application (e.g., a mobile app or a single-page application), JWT can be used for authentication as they can be easily passed in the Authorization header.
- **Stateless authentication**: JWT contains all the necessary information for authentication, allowing the server to authenticate the user without querying a database on each request.
- **Cross-origin resource sharing (CORS)**: JWT can be used for authentication in CORS scenarios where cookies cannot be used due to browser restrictions.
- **Distributed systems**: In distributed systems, JWT can be used for authentication as they can be verified independently by each service without relying on a centralized session store.

## Steps for Implementing Authentication

### Backend setup

We define our DB:

```javascript
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate as migrator } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "bun:sqlite";
import { join } from "node:path";
import * as schema from "./schema";

const sqlite = new Database("sqlite.db");

// Enable WAL mode
sqlite.exec("PRAGMA journal_mode = WAL;");

export const db = drizzle(sqlite, { schema, logger: true });

// We use this to migrate using a script
export function migrate() {
  migrator(db, { migrationsFolder: join(import.meta.dirname, "migrations") });
}
```

We define our DB schema that uses Drizzle and SQLite:

```javascript
import {
  customType,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import cuid from "cuid";

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
});

export type DatabaseUserType = InferSelectModel<typeof users>;
```

We define our userSchema:

```javascript
import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must not exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .optional(),

  email: z.string().email("Invalid email address"), // Validates email format

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

// Type inference for TypeScript
export type User = z.infer<typeof userSchema>;
```

This is a great way to validate our inputs, the loop would be to define our schema with zod and then using `z.infer<typeof userSchema>` to obtain the `type`.

Next we create the route:

```javascript
const router = new Hono();

/**
 * @api     POST /register
 * @desc    Register user
 * @access  Public
 */
router.post("/register", zValidator("json", userSchema), async (c) => {
  const { username, password, email } = c.req.valid("json");
  const hashedPassword = await Bun.password.hash(password, "argon2id");

  const existingEmail = await db.query.users.findFirst({
    where(fields, { eq }) {
      return eq(fields.email, email);
    },
  });

  if (existingEmail) {
    return c.body("Email is already on use", HttpStatusCode.NotFound);
  }

  try {
    await db
      .insert(users)
      .values({ username: username ?? email, password: hashedPassword, email });
    return c.body("User created successfully", 200);
  } catch (err) {
    console.error(err);
    const error = err as Error;
    return c.body(error.message, 500);
  }
});
```

We implement a login endpoint that verifies user credentials by comparing the provided password with the stored hashed password.

```javascript
/**
 * @api     POST /login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", zValidator("json", userSchema), async (c) => {
  const { password, email } = c.req.valid("json");
  const existingUser = await db.query.users.findFirst({
    where(fields, { eq }) {
      return eq(fields.email, email);
    },
  });

  if (!existingUser) {
    return c.body("User input is not valid", HttpStatusCode.NotFound);
  }

  const passwordMatch = await Bun.password.verify(
    password,
    existingUser.password,
    "argon2id"
  );

  if (!passwordMatch) {
    return c.body("User input is not valid", HttpStatusCode.NotFound);
  }

  setCookie(c, "session", existingUser.id, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400,
  });

  return c.json(
    { username: existingUser.username, email, id: existingUser.id },
    200
  );
});
```

Next we need an endpoint that lets us know if our credentials are still valid:

```javascript
import { getCookie } from "hono/cookie";
/**
 * @api     GET /me
 * @desc    Retrieves current user data
 * @access  Private
 */
router.get("/me", async (c) => {
  const userId = getCookie(c, "session");

  if (!userId) {
    return c.body("User not found", 404);
  }

  const existingUser = await db.query.users.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, userId);
    },
  });

  if (!existingUser) {
    return c.body("User already exists", 404);
  }

  return c.json({
    username: existingUser.username,
    sessionId: existingUser.id,
    email: existingUser.email,
  });
});
```

And finally we need to be able to delete credentials:

```javascript
/**
 * @api     POST /logout
 * @desc    Logout user
 * @access  Public
 */
router.post("/signout", async (c) => {
  // Get the session cookie
  const sessionCookie = getCookie(c, "session");

  if (!sessionCookie) {
    return c.body("No session found", 404);
  }

  // Delete the session cookie
  deleteCookie(c, "session");

  // Return a success response
  return c.json({ message: "Logged out successfully" }, 200);
});

export default router;
```

### Frontend setup

We define our API client with `ky`:

```javascript
import { env } from "@/lib/env";
import ky from "ky";

export const api = ky.extend({
  prefixUrl: env.API_URL,
  credentials: "include",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // TO-DO handle error response via afterResponse
});
```

#### We define our services:

For the register:

```javascript
import { api } from "@/lib/client";

/**
 *
 * @param username
 * @param password
 * @param email
 * @returns
 */
export async function createAccount(
  username: string,
  password: string,
  email: string
) {
  const response = await api.post("register", {
    json: { username, password, email },
  });

  if (response.status !== 200) {
    throw new Error("Could not create account");
  }

  return response;
}
```

For the login:

```javascript
import { api } from "@/lib/client";

/**
 *
 * @param email
 * @param password
 */
export async function createSession(email: string, password: string) {
  try {
    const response = await api.post("signin", {
      json: { email, password },
    });

    // Check for successful response status
    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    // Handle specific error types if necessary
    if (error instanceof HTTPError) {
      const errorMessage = await error.response.text();
      throw new Error(`HTTP error: ${errorMessage}`);
    } else {
      // Re-throw other errors
      throw new Error(`Could not create session`);
    }
  }
}
```

To get current user session:

```javascript
// A helper I made for GET endpoints, feel free to use it normally instead
export async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await api.get(endpoint);
  return await response.json<T>();
}

/**
 *
 * Get current user session
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const data = await fetchData("me");
  const result = currentUserSchema.safeParse(data);
  if (result.success) return result.data;
  return null;
}
export function useMeQuery() {
  return useQuery({
    queryKey: ["users/me"],
    queryFn: getCurrentUser,
  });
}
export function useCurrentUser() {
  const { data } = useMeQuery();
  console.log({ data });
  return data;
}
```

Here we use React Query to cache the session.

#### We create the components

For the login and register:

```javascript
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserCredentials, formSchema } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export type Props = Readonly<{
  type: FormType,
  onSubmit: (value: UserCredentials) => void,
}>;

export function AuthForm({ onSubmit, type }: Props) {
  const form =
    useForm <
    UserCredentials >
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col justify-center items-center">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">{type}</CardTitle>
              <CardDescription>
                Enter your email and password below to {type}
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
              {type === "register" && (
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter your username"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Feel free to use the name you want
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      We wont share your email with anybody.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Try to make it as secure as possible.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                {type}
              </Button>
            </CardFooter>
          </Card>
        </fieldset>
      </form>
    </Form>
  );
}
```

In the login route:

```javascript
export default function LoginRoute() {
  const navigate = useNavigate();

  function onSubmit(values: UserCredentials) {
    const op = createSession(values.email, values.password);
    console.log({ values });
    toast.promise(op, {
      success: () => {
        navigate("/app");
        return "You successfully logged in";
      },
      error: (error: unknown) => {
        console.log({ error });
        return "Something went wrong while authenticating";
      },
      loading: "Authenticating...",
    });
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <AuthForm onSubmit={onSubmit} type="login" />
      <Link className="underline text-xs" to="/register">
        Click to register account
      </Link>
    </div>
  );
}
```

In the register route:

```javascript
export default function Register() {
  const navigate = useNavigate();

  function onSubmit(values: UserCredentials) {
    const op = createAccount(values.username, values.email, values.password);
    console.log({ values });
    toast.promise(op, {
      success: () => {
        navigate("/login");
        return "You successfully register";
      },
      error: (error: unknown) => {
        console.log({ error });
        return "Something went wrong while registering";
      },
      loading: "Registering...",
    });
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <AuthForm onSubmit={onSubmit} type="register" />
      <Link className="underline text-xs" to="/register">
        Click to login
      </Link>
    </div>
  );
}
```

And that's pretty much it! You need to add the providers to your App:

```javascript
export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Loader size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Landing />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/app" element={<DashboardLayout />}>
                  <Route path="" element={<HomeRoute />} />
                  <Route path="profile" element={<ProfileRoute />} />
                </Route>
              </Routes>
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
}
```

# Conclusion

We have learned how to do a real world Authentication, with practice it can take you 20 minutes to do from backend to frontend and its an important pattern to learn in terms of speed since its what interviews usually ask of you. We will handle similar projects in the future.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
