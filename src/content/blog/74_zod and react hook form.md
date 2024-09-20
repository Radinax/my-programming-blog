---
title: "Power up your forms with React Hook Forms and Zod"
description: "In this article we will learn what is Zod and React Hook Form, why its the proper way to handle forms and use some real life examples"
category: ["javascript", "react", "typescript"]
pubDate: "2024-09-20"
published: true
---

## Table of content

# Introduction

Zod is a TypeScript-first schema declaration and validation library designed to enhance data integrity in applications. It allows developers to define schemas for data structures, enabling both compile-time and runtime validation. This dual capability is particularly useful in ensuring that incoming data conforms to expected types and shapes, which is crucial in web development for validating user inputs, API responses, and configuration data.

React Hook Form is a powerful library designed for managing forms in React applications. It simplifies form handling by leveraging React Hooks, making it efficient and less complex compared to traditional methods.

# Installing

`npm install zod` and `npm install react-hook-form @hookform/resolvers`

The resolvers package helps us connect RHF with Zod.

# Example with Zod

Let's just check a simple example using Zod and its useage:

```javascript
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional(),
});

// Validating an object against the schema
const userData = { name: "John Doe", email: "john@example.com" };
const parsedData = UserSchema.parse(userData); // This will succeed

// Example of error handling
try {
  UserSchema.parse({ name: "Jane Doe", age: "twenty" }); // This will throw a ZodError
} catch (e) {
  console.error(e.errors); // Outputs validation errors
}
```

# Example with React Hook Form

```javascript
import React from "react";
import { useForm } from "react-hook-form";

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: true })} placeholder="Name" />
      {errors.name && <span>This field is required</span>}

      <input
        {...register("email", {
          required: true,
          pattern: /^\S+@\S+$/i,
        })}
        placeholder="Email"
      />
      {errors.email && <span>Invalid email address</span>}

      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
```

In this example, the useForm hook is utilized to manage the form's state and handle submissions. The register function connects input fields to the form, while validation rules are applied directly within the registration process.

# Example with React Hook Form and Zod

```javascript
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userFormSchema = z.object({
  firstName: z.string().nullish(),
  email: z.string().email(),
  profileUrl: z.string().url(),
  age: z.number().min(1),
  friends: z.array(z.string()).max(3),
  settings: z.object({
    isSubscribed: z.boolean(),
  }),
});

type UserForm = z.infer<typeof userFormSchema>;

export default function App() {
  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
  };)


  function handleSubmit(data: UserForm) {
    const result = userFormSchema.safeParse(data);

    if (result.success) {
      // Handle success
    } else {
      // Handle error usually with a toaster
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">RHF and ZOD example</h1>
    </div>
  );
}
```

Take note about this line:

```javascript
type UserForm = z.infer<typeof userFormSchema>;
```

This line creates a TypeScript type named UserForm, which infers the type structure based on the userFormSchema. This type will be used throughout the component to ensure type safety.

# Example with Zod and API validation

```javascript
import { env } from "@/utils/env";
import { z } from "zod";

const getUsersSchema = z.object({
  limit: z.number(),
  offset: z.number(),
});

type UsersFilters = z.infer<typeof getUsersSchema>;

export async function getUsers(filters: UsersFilters) {
  // Use the filters

  const result = getUsersSchema.safeParse(filters);

  fetch("/api", {
    headers: {
      Authorization: `Bearer ${env.SECRET_KEY}`,
    },
  });

  //
}
```

This is a great way to validate the data you're sending to the API before making the request.

# Conclusion

We have learned an important tool in dealing with Forms and validation from the frontend, which is using RHF and Zod together. Its a powerful development loop we can use to create more robusts application and its the way real life products are handling things. We will see more examples in the future.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
