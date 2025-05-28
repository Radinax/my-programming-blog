---
title: "Building a Reusable Multi-Step Modal Form with React Hook Form and Zod"
description: "Learn how to create a reusable multi-step modal form in React using TypeScript, react-hook-form, and Zod validation."
category: ["typescript"]
pubDate: "2025-05-28"
published: true
---

## Table of contents

# Introduction

In modern web applications, user experience plays a critical role in determining success. One effective way to enhance UX when collecting large amounts of data is by breaking down complex forms into **multi-step modals**.

In one of my recent freelancing jobs, I had two implement a similar feature of multi-step modal with validations using zod, I think its something that would make an interesting article since recently I have been out of ideas.

This article walks you through building a **reusable, scalable multi-step modal form component** using:

- **React + TypeScript**
- **react-hook-form** for efficient form state management
- **Zod** for schema validation
- A custom hook to manage steps and navigation

By the end of this tutorial, you'll have a clean, modular solution that can be reused across your application.

# Why Use Multi-Step Forms?

Multi-step forms help reduce cognitive load by splitting information gathering into manageable chunks. They also allow better control over validation logic, conditional rendering, and step-by-step progression.

Some benefits include:

- Improved accessibility and usability
- Easier validation per step
- Better error handling
- More visually appealing interfaces

# Tech Stack Overview

We will use the following technologies:

| Tool                | Purpose                                |
| ------------------- | -------------------------------------- |
| React               | UI framework                           |
| TypeScript          | Type safety                            |
| react-hook-form     | Form state management                  |
| Zod                 | Schema validation                      |
| @hookform/resolvers | Bridge between Zod and react-hook-form |

# Project Setup

Start by creating a new React + TypeScript project (or integrate into an existing one), and install the required dependencies:

```bash
npm install react-hook-form @hookform/resolvers zod
```

Once installed, we're ready to start building our components.

# Define Your Zod Schemas

To ensure type safety and validation consistency, we define Zod schemas for each step of our form. In this example, we'll build a two-step form:

1. Collect basic user info (name, email)
2. Choose a role (admin or user), with conditional field `adminSecret` for admins

Here's the schema definition:

```ts
// schemas.ts
import { z } from "zod";

export const BaseUserInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export const AdminRoleSchema = z.object({
  role: z.literal("admin"),
  adminSecret: z.string().min(6, "Admin secret must be at least 6 characters"),
});

export const UserRoleSchema = z.object({
  role: z.literal("user"),
});

export const RoleInfoSchema = z.union([AdminRoleSchema, UserRoleSchema]);

export type BaseUserInfo = z.infer<typeof BaseUserInfoSchema>;
export type RoleInfo = z.infer<typeof RoleInfoSchema>;
export type UserInfo = BaseUserInfo & RoleInfo;

export const FullUserInfoSchema = BaseUserInfoSchema.merge(RoleInfoSchema);
```

# Create a Custom useFormSteps Hook

To make the multi-step logic reusable, we encapsulate it in a custom hook:

```ts
// hooks/useFormSteps.ts
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

type Step<T> = {
  id: string;
  label: string;
  schema?: any; // optional per-step validation
  component: React.ComponentType<{ form: UseFormReturn<T> }>;
};

type UseFormStepsProps<T> = {
  steps: Step<T>[];
  onSubmit: (data: T) => void;
};

export const useFormSteps = <T extends Record<string, any>>({
  steps,
  onSubmit,
}: UseFormStepsProps<T>) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const nextStep = async (
    trigger: () => Promise<boolean>,
    isValid: boolean
  ) => {
    if (!isValid) return false;

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((i) => i + 1);
    } else {
      await onSubmit(await trigger());
    }

    return true;
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i) => i - 1);
    }
  };

  const currentStep = steps[currentStepIndex];

  return {
    currentStep,
    currentStepIndex,
    totalSteps: steps.length,
    nextStep,
    prevStep,
  };
};
```

# Build a Generic MultiStepForm Component

Now we’ll implement the generic `MultiStepForm` component that uses `react-hook-form`, the custom hook, and dynamically renders step components.

```tsx
// components/MultiStepForm.tsx
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormSteps } from "../hooks/useFormSteps";
import { FullUserInfoSchema, UserInfo } from "../schemas";

interface MultiStepFormProps<T> {
  defaultValues: T;
  onSubmit: (data: T) => void;
  steps: ReturnType<typeof useFormSteps<T>>["steps"];
}

const MultiStepForm = <T extends Record<string, any>>({
  defaultValues,
  onSubmit,
  steps,
}: MultiStepFormProps<T>) => {
  const methods = useForm<T>({
    resolver: zodResolver(FullUserInfoSchema),
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, trigger } = methods;

  const { currentStep, currentStepIndex, totalSteps, nextStep, prevStep } =
    useFormSteps<T>({
      steps,
      onSubmit: handleSubmit(onSubmit),
    });

  const handleNext = async () => {
    const isValid = await trigger();
    await nextStep(trigger, isValid);
  };

  return (
    <FormProvider {...methods}>
      <form>
        <h2>{currentStep.label}</h2>
        <currentStep.component form={methods} />

        <div style={{ marginTop: "1rem" }}>
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStepIndex === 0}
          >
            Back
          </button>
          <button type="button" onClick={handleNext}>
            {currentStepIndex === totalSteps - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default MultiStepForm;
```

# Implement Step Components

Each step is implemented as a separate component. These components receive the `form` object via props and register fields accordingly.

### Step 1: Basic Info

```tsx
// components/StepOneFields.tsx
import React from "react";
import { useFormContext } from "react-hook-form";

export const StepOneFields = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label>Name:</label>
      <input {...register("name")} />
      {errors.name && <p className="error">{errors.name.message as string}</p>}

      <label>Email:</label>
      <input {...register("email")} />
      {errors.email && (
        <p className="error">{errors.email.message as string}</p>
      )}
    </div>
  );
};
```

### Step 2: Choose Role

```tsx
// components/StepTwoFields.tsx
import React from "react";
import { useFormContext } from "react-hook-form";

interface StepTwoProps {
  form: any;
}

export const StepTwoFields = ({ form }: StepTwoProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const role = watch("role");

  const handleRoleChange = (selectedRole: "admin" | "user") => {
    setValue("role", selectedRole);
    if (selectedRole === "user") {
      setValue("adminSecret", "");
    }
  };

  return (
    <div>
      <button type="button" onClick={() => handleRoleChange("admin")}>
        Admin
      </button>
      <button type="button" onClick={() => handleRoleChange("user")}>
        User
      </button>

      {role === "admin" && (
        <>
          <label>Admin Secret:</label>
          <input {...register("adminSecret")} />
          {errors.adminSecret && (
            <p className="error">{errors.adminSecret.message as string}</p>
          )}
        </>
      )}

      {errors.role && <p className="error">{errors.role.message as string}</p>}
    </div>
  );
};
```

# Putting It All Together in App.tsx

Finally, we bring everything together in the main app file:

```tsx
// App.tsx
import React, { useState } from "react";
import MultiStepForm from "./components/MultiStepForm";
import { StepOneFields, StepTwoFields } from "./components";
import { UserInfo, FullUserInfoSchema } from "./schemas";

const steps = [
  {
    id: "info",
    label: "Basic Info",
    schema: undefined, // optional
    component: StepOneFields,
  },
  {
    id: "role",
    label: "Choose Role",
    schema: undefined, // optional
    component: StepTwoFields,
  },
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultValues = {
    name: "",
    email: "",
    role: "user",
    adminSecret: "",
  };

  const handleSubmit = (data: UserInfo) => {
    console.log("Submitted:", data);
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>

      {isModalOpen && (
        <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <MultiStepForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            steps={steps}
          />
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
```

# Testing

Tests are a good way to understand how the feature works and serves as both a reasurance that your changes didnt affect anything else, and a way to document your code.

Test the following behaviors of the `MultiStepForm`:

1. Renders the first step initially.
2. Validates required fields before allowing progression.
3. Displays validation errors when invalid.
4. Navigates to the next step after valid input.
5. Handles conditional rendering (e.g., admin secret field).
6. Submits the form successfully on final step.

```typescript
// __tests__/MultiStepForm.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MultiStepForm from "../components/MultiStepForm";
import { UserInfo, FullUserInfoSchema } from "../schemas";

// Mock step components
const StepOneFields = () => (
  <div>
    <label>Name:</label>
    <input data-testid="name-input" {...register("name")} />
    {errors.name && <p data-testid="error-name">{errors.name.message}</p>}

    <label>Email:</label>
    <input data-testid="email-input" {...register("email")} />
    {errors.email && <p data-testid="error-email">{errors.email.message}</p>}
  </div>
);

const StepTwoFields = ({ form }: any) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const role = watch("role");

  return (
    <div>
      <button type="button" onClick={() => setValue("role", "admin")}>
        Admin
      </button>
      <button type="button" onClick={() => setValue("role", "user")}>
        User
      </button>

      {role === "admin" && (
        <>
          <label>Admin Secret:</label>
          <input data-testid="admin-secret" {...register("adminSecret")} />
          {errors.adminSecret && (
            <p data-testid="error-admin-secret">{errors.adminSecret.message}</p>
          )}
        </>
      )}

      {errors.role && <p data-testid="error-role">{errors.role.message}</p>}
    </div>
  );
};

describe("MultiStepForm", () => {
  const onSubmitMock = jest.fn();

  const defaultValues = {
    name: "",
    email: "",
    role: "user",
    adminSecret: "",
  };

  const steps = [
    {
      id: "info",
      label: "Basic Info",
      component: StepOneFields,
    },
    {
      id: "role",
      label: "Choose Role",
      component: StepTwoFields,
    },
  ];

  beforeEach(() => {
    onSubmitMock.mockClear();
  });

  test("renders the first step by default", () => {
    render(
      <MultiStepForm
        defaultValues={defaultValues}
        onSubmit={onSubmitMock}
        steps={steps}
      />
    );

    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Admin Secret:/i)).not.toBeInTheDocument();
  });

  test("shows validation errors when submitting empty first step", async () => {
    render(
      <MultiStepForm
        defaultValues={defaultValues}
        onSubmit={onSubmitMock}
        steps={steps}
      />
    );

    // Click Next
    await userEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Errors should appear
    expect(await screen.findByTestId("error-name")).toHaveTextContent(
      "Name is required"
    );
    expect(await screen.findByTestId("error-email")).toHaveTextContent(
      "Invalid email address"
    );
  });

  test("navigates to second step after valid input", async () => {
    render(
      <MultiStepForm
        defaultValues={defaultValues}
        onSubmit={onSubmitMock}
        steps={steps}
      />
    );

    // Fill out first step
    await userEvent.type(screen.getByTestId("name-input"), "John Doe");
    await userEvent.type(screen.getByTestId("email-input"), "john@example.com");

    // Click Next
    await userEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Check if we're on the second step
    expect(screen.getByText(/Choose Role/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Admin/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /User/i })).toBeInTheDocument();
  });

  test("validates adminSecret when role is admin", async () => {
    render(
      <MultiStepForm
        defaultValues={defaultValues}
        onSubmit={onSubmitMock}
        steps={steps}
      />
    );

    // Fill first step
    await userEvent.type(screen.getByTestId("name-input"), "John Doe");
    await userEvent.type(screen.getByTestId("email-input"), "john@example.com");
    await userEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Select Admin
    await userEvent.click(screen.getByRole("button", { name: /Admin/i }));

    // Click Submit without admin secret
    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    // Expect error
    expect(await screen.findByTestId("error-admin-secret")).toHaveTextContent(
      "Admin secret must be at least 6 characters"
    );
  });

  test("successfully submits form with valid admin info", async () => {
    render(
      <MultiStepForm
        defaultValues={defaultValues}
        onSubmit={onSubmitMock}
        steps={steps}
      />
    );

    // Step 1
    await userEvent.type(screen.getByTestId("name-input"), "Jane Doe");
    await userEvent.type(screen.getByTestId("email-input"), "jane@example.com");
    await userEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Step 2 - Admin
    await userEvent.click(screen.getByRole("button", { name: /Admin/i }));
    await userEvent.type(screen.getByTestId("admin-secret"), "supersecret");

    // Submit
    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    // Form submitted
    expect(onSubmitMock).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "jane@example.com",
      role: "admin",
      adminSecret: "supersecret",
    });
  });

  test("does not require adminSecret when role is user", async () => {
    render(
      <MultiStepForm
        defaultValues={defaultValues}
        onSubmit={onSubmitMock}
        steps={steps}
      />
    );

    // Step 1
    await userEvent.type(screen.getByTestId("name-input"), "Alice Smith");
    await userEvent.type(
      screen.getByTestId("email-input"),
      "alice@example.com"
    );
    await userEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Step 2 - User
    await userEvent.click(screen.getByRole("button", { name: /User/i }));

    // Submit
    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    // Should submit without adminSecret
    expect(onSubmitMock).toHaveBeenCalledWith({
      name: "Alice Smith",
      email: "alice@example.com",
      role: "user",
    });
  });
});
```

Some notes:

1. We’re mocking the step components directly in the test file for simplicity.
2. If you're using a modal wrapper around `MultiStepForm`, wrap it similarly as in `App.tsx`.
3. You can extract shared setup logic into a helper function or custom render method if needed.

# Conclusion

Creating reusable and maintainable UI patterns like multi-step forms is essential in large-scale React applications. By combining `react-hook-form`, `Zod`, and a custom hook, we've built a clean, scalable, and type-safe solution.

With this foundation, you can now easily extend the form to support more steps, dynamic fields (`useFieldArray`), and even remote validation.

---

**See you on the next post.**

Sincerely,

**Eng. Adrian Beria.**
