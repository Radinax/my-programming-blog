---
title: "How to implement Feature Flags in a React application"
description: "In this article we will learn how to do implement a feature flags functionality to allow/disallow users from watching certain features in an elegant way"
category: ["javascript", "react", "typescript"]
pubDate: "2024-10-29"
published: true
---

## Table of content

# Introduction

When working with products like a Dashboard, often in times you have your Product team wanting to try out some features with specific clients but not available to other clients, this is to perform some A/B testing to get feedback without fully implementing it. This article is to show how to handle this situation in our codebase.

# Defining our system

Lets start by showing each scenario, first the user.

## User

```javascript
export type UserRole = "admin" | "tester" | "user"
export type User = {
  id: string
  role: UserRole
}

export function getUser() {
  return { id: "1", role: "user" } as User
}
```

This user has 3 types of access, can be the administrator, a normal user of our application or the tester of a new feature, now lets show what new features we can implement.

## Features

```javascript
export const FEATURE_FLAGS = {
  TEST_PRODUCT_A: [{ userRoles: ["admin", "tester"] }],
  ADVANCED_ANALYTICS: true,
  DISABLED_FEATURE: false,
  EXPERIMENTAL_FEATURE: false,
} as const satisfies Record<string, FeatureFlagRule[] | boolean>

export type FeatureFlagName = keyof typeof FEATURE_FLAGS // TEST_PRODUCT_A | ADV...

type FeatureFlagRule = {
  userRoles?: UserRole[] // "admin" | "tester" | "user"
}
```

This means that every user will be able to see `ADVANCED_ANALYTICS` but not `DISABLED_FEATURE` or `EXPERIMENTAL_FEATURE`, while only the tester and admin can see the `TEST_PRODUCT_A`. The idea is that we can push the `TEST_PRODUCT_A` feature in production to be tested by specific users.

## Utility functions

```javascript
export function canViewFeature(featureName: FeatureFlagName, user: User) {
  const rules = FEATURE_FLAGS[featureName];
  if (typeof rules === "boolean") return rules;
  return rules.some((rule) => checkRule(rule, featureName, user));
}
function checkRule(
  { userRoles }: FeatureFlagRule,
  featureName: FeatureFlagName,
  user: User
) {
  return userHasValidRole(userRoles, user.role);
}
function userHasValidRole(
  allowedRoles: UserRole[] | undefined,
  userRole: UserRole
) {
  return allowedRoles == null || allowedRoles.includes(userRole);
}
```

## Implementation

We define a Layout component that handles the authorization:

```javascript
import { canViewFeature, FeatureFlagName } from "@/lib/featureFlags"
import { getUser } from "@/lib/getUser"
import { ReactNode } from "react"

export function FeatureEnabled({
  featureFlag,
  children,
}: {
  featureFlag: FeatureFlagName
  children: ReactNode
}) {
  return canViewFeature(featureFlag, getUser()) ? children : null
}
```

It takes the `featureFlag` consts we defined and if user can see the content it renders the children.

Now where we define our features:

```javascript
import { FeatureEnabled } from "@/components/FeatureEnabled";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

function Feature({ children }: { children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="container mx-auto my-6 px-4">
      <div className="grid gap-4">
        <Feature>Product Management</Feature>
        <FeatureEnabled featureFlag="TEST_PRODUCT_A">
          <Feature>A/B Testing of Product A</Feature>
        </FeatureEnabled>
        <FeatureEnabled featureFlag="ADVANCED_ANALYTICS">
          <Feature>Advanced Analytics</Feature>
        </FeatureEnabled>
        <FeatureEnabled featureFlag="EXPERIMENTAL_FEATURE">
          <Feature>Experimental Feature</Feature>
        </FeatureEnabled>
        <FeatureEnabled featureFlag="DISABLED_FEATURE">
          <Feature>DISABLED</Feature>
        </FeatureEnabled>
      </div>
    </div>
  );
}
```

## Using ENV

We can also control it through ENV variables to save ourselves the extra deployment.

```javascript
// Define the type for FeatureFlagRule
type FeatureFlagRule = {
  userRoles: string[];
};

// Load environment variables
const getBooleanEnvVar = (varName: string, defaultValue: boolean): boolean => {
  const value = process.env[varName];
  if (value === undefined) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true';
};

const getArrayEnvVar = (varName: string, defaultValue: string[]): string[] => {
  const value = process.env[varName];
  if (value === undefined) {
    return defaultValue;
  }
  return value.split(',').map(role => role.trim());
};

// Define the feature flags using environment variables
export const FEATURE_FLAGS = {
  TEST_PRODUCT_A: [{ userRoles: getArrayEnvVar('FEATURE_TEST_PRODUCT_A_ROLES', ['admin', 'tester']) }],
  ADVANCED_ANALYTICS: getBooleanEnvVar('FEATURE_ADVANCED_ANALYTICS', true),
  DISABLED_FEATURE: getBooleanEnvVar('FEATURE_DISABLED_FEATURE', false),
  EXPERIMENTAL_FEATURE: getBooleanEnvVar('FEATURE_EXPERIMENTAL_FEATURE', false),
} as const satisfies Record<string, FeatureFlagRule[] | boolean>;
```

And our ENV will look like:

```bash
FEATURE_TEST_PRODUCT_A_ROLES=admin,tester
FEATURE_ADVANCED_ANALYTICS=true
FEATURE_DISABLED_FEATURE=false
FEATURE_EXPERIMENTAL_FEATURE=true
```

# Conclusion

We have learned how to control features accesibility in an elegant manner without resorting to cumbersome callback hells of `if` which could be the first thought in the mind of a developer, this way we can scale our application and have better control of what features certain type of users can see.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
