---
title: "Live coding with React 19 and Next 15"
description: "This is an article showing an example of a live coding interview for a Senior Frontend Developer position with heavy focus on async"
category: ["typescript", "react", "nextjs"]
pubDate: "2025-06-23"
published: true
---

## Table of contents

# Introduction

Live coding can take over a lot of different possibilities, some of them are as simple as creating a toggle controller by React `useState`, while others can challenge a candidate on real life work. This article focuses on one real life example on how a process of this type can be.

# Initial code

The interviewer will give you something like this:

```tsx
// Initial Naive Idea (Candidate's starting point, you point out the issues)
const fetchFeaturedProperties = async () => {
  const res = await fetch("/api/featured-properties");
  const data = await res.json();
  return data;
};

const fetchRecentListings = async () => {
  const res = await fetch("/api/recent-listings");
  const data = await res.json();
  return data;
};

const DashboardPage = () => {
  // How would you fetch these?
  // ...
  return <div></div>;
};
```

They will tell you how to use those two different fetchers to bring the data that comes from those endpoints.

First, we need to see that those fetchers are not handling errors or typing correctly, so we can propose to make a new fetcher that handles these issues:

```tsx
const fetcher = async <T,>(url: string, schema: Zod.Schema<T>): Promise<T> => {
  const res = await fetch(url);
  // Handling the case when it fails, the Error Boundary should catch this
  if (!res) {
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }
  const rawData = await res.json();
  const result = schema.parseData(rawData);
  if (!result.success) {
    throw new Error(
      `Failed to validate type data from ${url}: ${result.error}`
    );
  }
  return result.data;
};
```

This way you show concepts about Zod and Error Boundary, and that you care on how to handle cases where there is an error either fetching, or validating data.

Next, we will create the zod schema for the data we are expecting, here we can take freedom to make one we think is right:

```tsx
const PropertySchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  location: z.string(),
  price: z.number(),
});
export type Property = z.infer<typeof PropertySchema>;
const FeaturedPropertySchema = z.object({
  featured: z.array(PropertySchema),
});
const RecentPropertySchema = z.object({
  recent: z.array(PropertySchema),
});
```

Here you show how to use Zod to shape the data that's coming from an external API.

Now we will re-write the two initial fetchers:

```tsx
const getFeaturedProperty = () =>
  fetcher("/api/featured-properties", FeaturedPropertySchema);
const getRecentProperty = () =>
  fetcher("/api/recent-properties", RecentPropertySchema);
```

Next, we will assume we're using React 19, which is the technology that is currently being tested.

```tsx
const DashboardPage = () => {
  const [FeaturedProperty, RecentProperty] = use(
    Promise.all([getFeaturedProperty(), getRecentProperty()])
  );
  return <div></div>;
};
```

This step shows a great use of the powerful `use` hook, there are several things happening, first this hook takes a Promise and solves it, but when an error happens, the Error Boundary will catch it, if the state of the promise is `pending`, then it will trigger the `Suspense`, naturally this needs to happen in an external component and not inside this `DashboardPage` component, instead we can put it in another wrapper, for this case we will do it in `App`.

```tsx
const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary FallbackComponent={({ error }) => <div>There was an error: {error}</div>}>
        <DashboardPage>
      </ErrorBoundary>
    </Suspense>
  )
}
```

Now the async operations inside `DashboardPage` will be properly detected by the suspense and error boundary wrappers, ideally each page should have its own separate suspense, otherwise you can trigger the whole app.

Here you can suggest that having two separate `Suspense` and `ErrorBoundary` for each data, in case the endpoint fails in either one, you can easily know which one failed, because inside that `Promise.all`, its an all or nothing situation.

# Example on how to separate the two fetchers

## Featured Property

```tsx
const featuredPropertiesSchema = z.object({
  featured: z.array(propertySchema),
});

const getFeaturedPropertiesPromise = () =>
  fetcher("/api/featured-properties", featuredPropertiesSchema);

function FeaturedPropertiesContent() {
  const featuredData = use(getFeaturedPropertiesPromise());

  return (
    <section>
      <h2>Featured Properties</h2>
      {featuredData.featured.length > 0 ? (
        <ul>
          {featuredData.featured.map((property) => (
            <li key={property.id}>
              {property.address} - ${property.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No featured properties found.</p>
      )}
    </section>
  );
}

export default function FeaturedProperties() {
  return (
    <Suspense fallback={<div>Loading featured properties...</div>}>
      <FeaturedPropertiesContent />
    </Suspense>
  );
}
```

## Recent Properties

```tsx
const recentListingsSchema = z.object({
  listings: z.array(propertySchema),
});

const getRecentListingsPromise = () =>
  fetcher("/api/recent-listings", recentListingsSchema);

function RecentListingsContent() {
  const recentData = use(getRecentListingsPromise());

  return (
    <section>
      <h2>Recent Listings</h2>
      {recentData.listings.length > 0 ? (
        <ul>
          {recentData.listings.map((property) => (
            <li key={property.id}>
              {property.address} - ${property.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent listings found.</p>
      )}
    </section>
  );
}

export default function RecentListings() {
  return (
    <Suspense fallback={<div>Loading recent listings...</div>}>
      <RecentListingsContent />
    </Suspense>
  );
}
```

Further more, notice that the component inside that section is the same, you can abstract that into a separate component since they're both the same:

```tsx
type PropertyComponentProps = {
  title: string;
  properties: Property[];
};
const PropertyComponent = ({ title, properties }: PropertyComponentProps) => {
  return (
    <section>
      <h2>{title}</h2>
      {properties.length > 0 ? (
        <ul>
          {properties.map((property) => (
            <li key={property.id}>
              {property.address} - ${property.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No properties found found.</p>
      )}
    </section>
  );
};
```

All of this we just talked about, is what is usually going inside a day in a Senior Frontend Engineer job, we would also add React Query for server caching, but for this current interview doesn't need this.

# Same code but in Next js 15

The previous is how it would look inside a Client Side Rendering application with Vite, let's see how it would look with Next JS:

```tsx
import { Suspense } from "react";
import { ErrorBoundary } from "./error"; // NextJS uses this patern

async function getFeaturedPropertiesServer() {
  // In a real app, this would hit your actual API endpoint or database
  return fetcher("/api/featured-properties", featuredPropertiesSchema);
}

async function getRecentListingsServer() {
  return fetcher("/api/recent-listings", recentListingsSchema);
}

// Separate Server Components for each section, for granular Suspense
async function FeaturedPropertiesSection() {
  const featuredData = await getFeaturedPropertiesServer();
  return (
    <PropertyComponent
      title="Featured Properties"
      properties={featuredData.featured}
    />
  );
}

async function RecentListingsSection() {
  const recentData = await getRecentListingsServer();
  return (
    <PropertyComponent
      title="Recent Listings"
      properties={recentData.listings}
    />
  );
}

export default async function DashboardPage() {
  return (
    <div>
      <h1>Real Estate Dashboard</h1>

      <Suspense fallback={<div>Loading featured properties...</div>}>
        {/* ErrorBoundary for this section - could be nested or sharedd parent */}
        {/* For page-level errors, use the recommended error.tsx file */}
        <FeaturedPropertiesSection />
      </Suspense>

      <Suspense fallback={<div>Loading recent listings...</div>}>
        <RecentListingsSection />
      </Suspense>

      {/* You could also have other sections of your dashboard here
          that don't require data or fetch their own data. */}
    </div>
  );
}
```

Looks a lot cleaner! With all this your interview should be a success.

# Conclusion

This was an interesting post to make, doing live interviews can be very stressing, in this case it was an example of a company of real estate which the product uses React 19 and Next 15, so the focus tends to be around async operations and how to use Zod properly. Notice how we went from doing two fetchs and going all the way at developing an entire product, this shows how you can scale the code and it should impress the one in charge of assessing your interview.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
