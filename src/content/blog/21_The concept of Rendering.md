---
title: "The concept of rendering and the importance of Next JS"
description: "We will check the concept of rendering, it's something that's critical for web development and it's handled using different patterns like Client-Side rendering, Static rendering, Hydration, Progressive rendering and Server-Side rendering."
category: ["react", "frontend", "nextjs"]
pubDate: "2023-11-24"
published: true
---

Categories:

> Rendering is **a process used in web development that turns website code into the interactive pages users see when** they visit a website. The term generally refers to the use of HTML, CSS, and JavaScript codes. The process is completed by a rendering engine, the software used by a web browser to render a web page.

Rendering content on the web is done in different ways and every year there is a different pattern preferred over others. The different patterns available are Client-Side rendering, Static rendering, Hydration, Progressive rendering and Server-Side rendering.

The Chrome team has encouraged to use `static rendering` or `server side rendering`.

My goal with this post is for us to understand why we will be using frameworks like `next js` and `remix` which focuses more on `server side rendering`.

## History of web rendering

Web development has been in continuous evolution:

- **2000**: We had HTML content rendered by the server, using `server-side` scripting languages like `PHP` and `ASP` to render HTML.
- **2006**: We got introduced to the concept of `Single Page Application` or `SPA` by using `AJAX`. It allowed us to make dynamic requests to the server without loading a new page. `JQuery` became huge because we could use Javascript to fetch and render data.
- **2013**: `React` was introduced where in 2015-2020 we worked with `client-side rendering` with supporting data-flow architecture libraries like `Redux`, CSS frameworks like `Bootstrap`, routing libraries (`React Router`) and mobile applications (`React Native`).

## Rendering - Key Performance Indicators

| Acronym | Description                                                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| TTFB    | `Time to First Byte` - Time between clicking a link and the first bit of content coming in.                                                       |
| FP      | `First Paint` - First time any content becomes visible to the user or the time when the first few pixels are painted.                             |
| FCP     | `First Contentful Paint` - Time when all requested content becomes visible.                                                                       |
| LCP     | `Largest Contentful Paint` - Time when the main page becomes visible. This refers to the largest image or text block visible within the viewport. |
| TTI     | `Time to Interactive` - Time when the page becomes interactive e.g., events are wired up, etc.                                                    |
| TBT     | `Total Blocking Time` - The total amount of time between FCP and TTI                                                                              |

## Rendering Patterns summary

Let's take a quick look:

|             | Server                                                | Static SSR                                                                            | SSR with (Re)hydration                                                               | CSR with Prerendering                          | CSR                                                                                              |
| ----------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Overview    | Input navigation requests and output HTML as response | Built as SPA, but all pages rendered as static HTML as a build step and JS is removed | Built as SPA. The server prerenders pages, but the full app is also booted on client | SPA where initial shell is prerendered as HTML | SPA where all logic, render and booting is done on the client, so HTML is a script and style tag |
| Authoring   | Server Side                                           | Built as client side                                                                  | Built as client side                                                                 | Client side                                    | Client side                                                                                      |
| Server role | Controls everything                                   | Delivers static HTML                                                                  | Render pages                                                                         | Partial static HTML then JS                    | JS                                                                                               |
| Pros        | TTI = FCP, Full streaming                             | Fast TTFB, TTI = FECP, Fully streaming                                                | Flexible                                                                             | Flexible, Fast TTFB                            | Flexible, Fast TTFB                                                                              |
| Cons        | Slow TTFB, Inflexible                                 | Inflexible, leads to hydration                                                        | Slow TTFB, TTI >>> FCP, usually buffered                                             | TTI > FCP, Limited streaming                   | TTI >>> FCP, no streaming                                                                        |
| Scales via  | Infra size/cost                                       | Build/Deploy size                                                                     | Infra size/JS size                                                                   | JS size                                        | JS size                                                                                          |
| Examples    | Gmail HTML                                            | Netflix                                                                               | Next JS                                                                              | Gatsby                                         | Most apps                                                                                        |
| Rendering   | Dynamic HTML                                          | Static HTML                                                                           | Dynamic HTML and JS                                                                  | Partial static-HTML then JS                    | JSON                                                                                             |

Now let's look at a summary:

|                     | Server                         | SSR with (Re)hydration                           | Streaming                                           | Progressive Hydration                                                             | Static Generation                          | Incremental Static Generation                                               | CSR                                           |
| ------------------- | ------------------------------ | ------------------------------------------------ | --------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------- | --------------------------------------------- |
| HTML generated on   | Server                         | Server                                           | Server                                              | Server                                                                            | Server                                     | Server                                                                      | Client                                        |
| JS in Hydration     | No                             | JS for all components to be loaded for hydration | JS is streamed with HTML                            | JS is loaded progressively                                                        | Minimal JS                                 | Minimal JS                                                                  | No hydration but JS is required for rendering |
| SPA behavior        | No                             | Limited                                          | Limited                                             | Limited                                                                           | No                                         | No                                                                          | Extensive                                     |
| Crawler Readability | Full                           | Full                                             | Full                                                | Full                                                                              | Full                                       | Full                                                                        | Limited                                       |
| Caching             | Minimum                        | Minimum                                          | Minimum                                             | Minimum                                                                           | Extensive                                  | Extensive                                                                   | Minimum                                       |
| TTFB                | High                           | High                                             | Low                                                 | High                                                                              | Low                                        | Low                                                                         | Low                                           |
| TTI : FCP           | TTI = FCP                      | TTI > FCP                                        | TTI > FCP                                           | TTI > FCP                                                                         | TTI > FCP                                  | TTI = FCP                                                                   | TTI >> FCP                                    |
| Implemented using   | Server side scripting with PHP | Next JS                                          | React                                               | React                                                                             | Next JS                                    | Next JS                                                                     | React, Angular, Vue                           |
| Used for            | Static content like news       | Few interactions like a blog                     | Static pages streamed in chunks like search results | Interactive pages where activation of components might be delayed like a Chat Bot | Static content that does not change often. | Large amount of static content that changes frequently like Product Listing | Highly interactive apps where UX is critical. |

## Client-Side Rendering

Client-side rendering was made popular with the advent of the **Single Page Application** (or SPA). JavaScript Frameworks like **AngularJS**, **React JS**, **BackBone.JS** and many more use this approach. With Client-Side-Rendered Applications, the server sends static HTML and JavaScript files to the client. Then the client makes any API calls necessary to get initial data, and then it renders the application.

### Advantages

- **They are cheap and easy to host**: For client-side rendered applications, you don’t need a web server. You can simply host your application on any CDN or static file host like Amazon S3. There are lots of ways to host your client-side rendered application for free.
- **No full page reload required**: Users can navigate between your pages without having to make a server roundtrip. This makes your website feel fast, almost like a native application.

### Disadvantages

- **They have poor SEO**: Client-side rendered applications often struggle with SEO. While Google claims they will crawl JavaScript rendered websites, they tend to rank poorly. If your website takes too long to load, it can end up being indexed as an empty page.

- **Poor user experience on slower devices**: Leaving rendering to the client-side can add seconds of load time on slower laptops and mobile devices. This can lead to users getting frustrated and leaving your website before it finishes loading.

- **They load slower**: A client-side rendered application needs to make an additional round-trip to your API server to render. This means your website will always load slower than an equivalent server-side rendered or static application.
- **Web crawlers can't reach on time**: In a waterfall of network requests may result in critical content not being rendered fast enough for a crawler to index it.

### Improving CSR performance

- **Budgeting Javascript**: Ensure your initial bundle is less than 170KB.
- **Preloading**: This ensures critical resources are already loading before the rendering starts, for example `<link rel="preload" as="script" href="critical.js">`.
- **Lazy loading**: You identify resources that are not critical and load these only when needed. This can improve the initial load time. For example a chat widget component won't be needed immediately.
- **Code splitting**: To avoid a large bundle of JS code, you can split your bundles by using `Webpack` which creates multiple ones loaded dynamically.
- **Caching with service workers**: The Service Worker API comes with a [Cache interface](https://developer.mozilla.org/en-US/docs/Web/API/Cache), that lets you create stores of responses keyed by request. While this interface was intended for service workers it is actually exposed on the window, and can be accessed from anywhere in your scripts. The entry point is `caches`.

### Caching with service workers

For example:

```javascript
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll([
        "/css/bootstrap.css",
        "/css/main.css",
        "/js/bootstrap.min.js",
        "/js/jquery.min.js",
        "/offline.html",
      ]);
    })
  );
});
```

#### On user interaction

One method is to give the user a "Read later" or "Save for offline" button. When it's clicked, fetch what you need from the network and put it in the cache:

```javascript
document
  .querySelector(".cache-article")
  .addEventListener("click", function (event) {
    event.preventDefault();
    var id = this.dataset.articleId;
    caches.open("mysite-article-" + id).then(function (cache) {
      fetch("/get-article-urls?id=" + id)
        .then(function (response) {
          // /get-article-urls returns a JSON-encoded array of
          // resource URLs that a given article depends on
          return response.json();
        })
        .then(function (urls) {
          cache.addAll(urls);
        });
    });
  });
```

#### On network response

If a request doesn't match anything in the cache, get it from the network, send it to the page and add it to the cache at the same time.

```javascript
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.open("mysite-dynamic").then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    })
  );
});
```

## Server-Side Rendering

Server-side rendered applications return the full HTML page of your application ready to be rendered. They make any necessary API calls beforehand and pass all the necessary data in the initial request. This means your web browser has everything it needs to render the application right away and has a faster first interaction time for your users.

Server-side rendering is the traditional method for creating websites. The traditional disadvantage of server-side rendering was having to make server roundtrips as you navigate around the site. However, with tools like [NextJS](https://nextjs.org/) and [Remix](https://remix.run/), we can create applications that offer the best of both worlds. By offering the first load with Server-Side rendering, and client-side routing afterwards.

### Advantages

- **They load faster**: Server-side rendered applications load faster than equivalent client-side rendered applications. And since the server takes care of the heavy lifting, they also load quickly on less performant devices.
- **They have good SEO**: The SEO benefits of server-side rendering are [well documented](https://developers.google.com/web/updates/2019/02/rendering-on-the-web). Google rewards websites that load faster with higher page rankings. Google and other search engine crawlers will have no problems indexing your server-side rendered websites.
- **Faster FCP and TTI**: When there are multiple UI elements and the application logic on the page, SSR has considerably less JS when compared to CSR.
- **Provides additional budget for client side Javascript**: With SSR we're eliminating the JS required to render a page and creates additional space for a third party JS that might be required.

### Disadvantages

- **They are expensive to host**: Compared to client-side rendered applications, server-side rendered applications are expensive to host. For every request to your server, your server will need to make API calls, and then render your HTML before passing it to the client.
- **They are more complicated to develop**: Setting up server-side rendering on your own with React can be a daunting task. However, this is made much easier by working with an established framework like `NextJS` or `Remix`.
- **Slow TTFB**: The response from the server might be delayed due to users causing excessive load on the server, have a slow network or server code not optimized enough.

## Static-Site Generation

Static site generators work by generating all of your websites HTML files at build time. The server makes your API calls and generates static HTML files for every and every page of your website. This means that when a client requests one of your webpages, the server doesn’t need to make any API calls, or render any HTML, it only needs to return the pre-rendered HTML file.

Let’s say you are building a blog, and you have written ten blog posts. When your static site builds, it will generate one HTML file for each of your blog posts. When you write another post, you need to rebuild your application and deploy the updated static assets.

[Gatsby](https://www.gatsbyjs.com/) and [NextJS](https://nextjs.org/) are popular ways to make static sites with React. Hugo is another [example](https://gohugo.io/about/what-is-hugo/) of a hugely popular static site generator.

### Advantages

- **They load fast**: Since the HTML is already compiled and ready to go, static site’s load faster than both client-side rendered sites, and server-side rendered sites.
- **They are cheap to host**: Since your website is just made up of a bunch of different HTML files, you can host your site on any static file hosting service like S3, or use a CDN.

### Disadvantages

- **They don't scale well**: As your site grows, so will the build time of your static site. This can cause builds of websites with large amounts of posts to slow down to a crawl. Static sites work best for sites with data that doesn’t change that often, like blogs, and not so well for sites with ever-changing data, like shops.

## Next JS

`NextJS` offers the best of both worlds, by allowing us to build hybrid applications that leverage both server-side rendering and static site generation. `NextJS` offers what it calls [automatic static optimization](https://nextjs.org/docs/advanced-features/automatic-static-optimization) on pages that it determines to be static. This allows you to create hybrid applications that contain both server-rendered, and statically generated pages.

This feature allows Next.js to emit hybrid applications that contain **both server-rendered and statically generated pages**.

With `NextJS` we can implement `SSR`, `Static SSR`, `SSR with Rehydration`, `CSR with prerendering` and `Full CSR`.

### Features

**Pre-rendering**:

`NextJS` generates the HTML for each page in advance and not on the client side, this concept is called `pre-rendering`. It ensures the JS code required for the interactivity is associated with the generated HTML. At this point React works in a shadow DOM to ensure rendered content matches with what the React app would render without actually manipulating it, this is called `hydration`

> In web development, hydration or rehydration is a technique in which client-side JavaScript converts a static HTML web page, delivered either through static hosting or server-side rendering, into a dynamic web page by attaching event handlers to the HTML elements. Because the HTML is pre-rendered on a server, this allows for a fast "first contentful paint" (when useful data is first displayed to the user), but there is a period of time afterward where the page appears to be fully loaded and interactive, but is not until the client-side JavaScript is executed and event handlers have been attached.

Each page is a React component file in the pages directory and the route is determined on the file name, for example, `pages/about.js` corresponds to the route `/about` inside the folder `pages` inside the `routes` folder.

```text
routes/
└── pages/
    └── about.jsx
```

**Data Fetching**:

We can fetch data with both SSR and Static Generation:

- `getStaticProps`: Used with static generation to render data
- `getStaticPaths`: Used with Static generation to render dynamic routes
- `getServerSideProps`: Used in SSR.

Static File Serving:

Served under a folder called `public` in the root directory which can then be referenced as `<img src="/logo.png" />`

**Automatic Image Optimization**:

Allows resizing, optimizing and serving images in modern formats when the browser supports it, so large images are resized for smaller viewports when required, it's implemented by importing it `import Image from 'next/image`.

**Routing**

Routing is done through a `pages` directory. For example, a page `pages/products/[pid].js` will get matched to `/products/1` with `pid=1` as one of the query parameters.

**Code Splitting**

This ensures only the required Javascript is sent to the client which helps to improve performance, this is done using either:

- `Route based`: This is the default option, when a user visits a route, `NextJS` only sends the code needed for the initial route.
- `Component based`: This type of code allows splitting large components into separate chunks to be lazy loaded through `dynamic import`.

Example of `dynamic import`:

```javascript
import { lazy, Suspense } from "react";

const MyComponent = lazy(() => import("path/to/component"));

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  );
};
```

### SSR with Next JS

This pre-renders a page on the server on every request, this is done by exporting an async function called `getServerSideProps()`:

```javascript
export async function getServerSideProps(context) {
  return {
    props: {}, // passed to the page component as props
  };
}
```

The `context` is an object which contains keys for the HTTP request and the response objects, routing parameters, query string, etc.

### React library used on the server

React can be function on the browser and the server, so UI elements can be rendered on the server. This is possible by using `NodeJS` on the server, so JS might be used to fetch data on the server and then render it using isomorphic React.

The function that let React do this is `ReactDOMServer.renderToString(element)`, which returns an HTML string associated with the React element. The HTML can then be rendered to the client for a faster page load.

The `renderToString` can be used with `ReactDOM.hydrate` which ensures the rendered HTML is preserved as is on the client and only the event handlers attached after load.

To do this we use a `.js` file in both client and server, the `.js` on server renders the HTML while the `.js` on the client hydrates it.

For example we can have on the server a file called `ipage.js`:

```javascript
app.get("/", (req, res) => {
  const app = ReactDomServer.renderToString(<App />);
});
```

That constant `app` can be used to generate the HTML to be rendered and in the client another `ipage.js`:

```javascript
ReactDOM.hydrate(<App />, document.getElementById("root"));
```

### Static Side Generation (SSG)

Delivers pre-rendered HTML content that was generated when the site was built.

As we learned, high request processing time on the server affects negatively the TTFB. `SSG` attempts to solve these problems by delivering a pre rendered HTML content to the client. Examples of this are `NextJS` and `Gatsby`.

Static files are cached and the HTML response is generated in advance resulting in faster TTFB and performance.

Static rendering `is ideal for static content` where pages doesn't change based on logged in users.

```javascript
// pages/about.js
export default function About() {
  return (
    <div>
      <h1>About us</h1>
      {/*...*/}
    </div>
  );
}
```

This page will be pre rendered when the site is built and its accessible at the `route/about`.

If we depend on a external data, we need to fetch this from the database and its done in build time to construct the page. In `NextJS` this is done by exporting `getStaticProps` in the page component. The function is called at build time on the build server to fetch the data which is passed as props to the component:

```javascript
// Runs at build time on the build server
export async function getStaticProps(context) {
  return {
    props: {
      products: await getProductsFromDatabase(),
    },
  };
}

// The page component receives the products prop from the getStaticProps
export default function Products({ products }) {
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

This `getStaticProps` is not included on the client side bundle and it can be used to fetch data directly from the database.

For individual detailed page for each product we can access it using dynamic routing for routes like `products/1`:

```javascript
// pages/products/[id].js

// In getStaticPaths we need to return the list of ids
// that we like to pre-render at build time
// which we can do by fetching all products from DB
export async function getStaticPaths(context) {
  const products = await getProductsFromDatabase();
  const paths = products.map((product) => ({
    params: { id: product.id },
  }));
  // fallback: false means pages with incorrect id will be 404
  return { paths, fallback: false };
}

// params will contain the id for each page
export async function getStaticProps({ params }) {
  return {
    props: {
      products: await getProductsFromDatabase(params.id),
    },
  };
}

export default function Product({ product }) {
  return <li key={product.id}>{product.name}</li>;
}
```

There are some cons:

- Edits on any posts will require a rebuild for the update to be reflected which makes hard to maintain a large number of HTML files.
- Its not suitable for dynamic content, because a `SSG` site needs to be built and re-deployed every time the content changes.

This means SSG is only for static content, but a new patterns called `Incremental Static Regeneration` has been introduced and allows us to update existing pages and add new ones by pre-rendering a subset of pages on the background. So this allows addition of new pages and updates on existing pages.

Adding new pages can be done by `lazy loading` non-existent pages:

```javascript
export async function getStaticPaths(context) {
  const products = await getProductsFromDatabase();
  const paths = products.map((product) => ({
    params: { id: product.id },
  }));
  // fallback: true means that instead of 404 we render a fallback
  return { paths, fallback: false };
}

// params will contain the id for each page
export async function getStaticProps({ params }) {
  return {
    props: {
      products: await getProductsFromDatabase(params.id),
    },
  };
}

export default function Product({ product }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;
  return <li key={product.id}>{product.name}</li>;
}
```

`NextJS` will generate the product on the background and it will show a fallback until it's generated. The cached version of the page will be shown to any subsequent visitors immediately upon request.

We can update existing pages as well:

```javascript
// Runs at build time on the build server
export async function getStaticProps(context) {
    return {
        props: {
            products: await getProductsFromDatabase()
            revalidate: 60, // force site to revalidate every 60s
        }
    }
}

// The page component receives the products prop from the getStaticProps
export default function Products({ products }) {
    return (
    	<div>
        	<h1>Products</h1>
        	<ul>
        		{products.map(product => (
                 	<li key={product.id}>{product.name}</li>
                 ))}
        	</ul>
        </div>
    )
}
```

Every 60 seconds the static page gets refreshed in the background with new data, once generated the new version of the static file becomes available and will be served for any new requests.

Pros of `iSSG`:

- Dynamic Data.
- Speed.
- Availability: Even if regeneration fails in the background, the old version remains.
- Consistent
- Ease of distribution.

### Progressive Hydration

Delay loading Javascript for less import parts of the page.

While in SSR the FCP is very fast, the TTI is not ready yet, so a button might render but the event handlers are not attached yet, this will happen once the Javascript bundle has been loaded and processed, this is called `hydration`, React checks the current DOM nodes and hydrates the nodes with the corresponding JS.

This can seriously hurt the UX, so instead of hydrating the entire application at once we hydrate the DOM nodes over time and not all at once, which we can do by requesting the minimum necessary JavaScript. We can delay the hydration of less important parts of the page by using a condition.

On the client:

```javascript
import React from "react";
import { hydrate } from "react-dom";
import App from "./components/App";

hydrate(<App />, document.getElementById("root"));
```

On the server:

```javascript
import React from "react";
import { renderToNodeStream } from "react-dom/server";
import App from "./components/App";

export default async () => renderToNodeStream(<App />);
```

### React concurrent mode

The problems Progressive Hydration solves will be solved when this is available. It allows React to work on different tasks at the same time and switch between them based on the given priority. When switching a partially rendered tree need not be committed, so that the rendering task can continue once React switched back to the same task.

Concurrent mode allows progressive hydration as well for each chunk of the page. If a task of higher priority needs to be performed, React will pause the hydration task and switch to accepting the user input. `lazy` and `suspense` allows you to use declarative loading states which can be used to show loaders while these chunks are being loaded.

Concurrent can also be combined with `Server Components`. We can re-fetch components from the server and render them on the client as they stream instead of waiting for the whole fetch to finish, so the client's CPU is working while we wait for the network fetch to finish.

## Streaming Server-Side Rendering

Generate HTML to be rendered on the server in response to a user request.

We can reduce the `TTI` while the server is rendering our application by streaming server rendering the contents of our application. Instead of generating one large HTML file containing the necessary markup for the current navigation, we can split up into smaller chunks! So we can continuously send data down to the client. The moment the client receives the chunks of data, it can start rendering the contents.

React built in `renderToNodeStream` makes it possible for us to send out application in small chunks. As the client can start painting the UI when it's receiving data, we can create a very performant first-load experience, calling the hydrate method on the received DOM nodes will attach the corresponding event handlers.

```javascript
import React from "react";
import path from "path";
import express from "express";
import { renderToNodeStream } from "react-dom/server";

import App from "./src/App";

const app = express();

app.get("/favicon.ico", (req, res) => res.end());
app.use("/client.js", (req, res) => res.redirect("build/client.js"));

const DELAY = 500;
app.use((req, res, next) => {
  setTimeout(() => next(), DELAY);
});

const BEFORE = `
	<!DOCTYPE html>
		<html>
			<head>
				<title>Cat Facts</title>
				<link rel="stylesheet" href="/style.css" />
				<script type="module" defer src="/build/client.js" />
			</head>
			<body>
				<h1>Stream Rendered Cat Facts!</h1>
				<div id="approot">
`.replace(/s*/g, "");

app.get("/", async (request, response) => {
  try {
    const stream = renderToNodeStream(<App />);
    const start = Date.now();

    stream.on("data", function handleData() {
      console.log("Render Start: ", Date.now() - start);
      stream.off("data", handleData);
      response.useChunkedEncodingByDefault = true;
      response.writeHead(200, {
        "content-type": "text/html",
        "content-transfer-encoding": "chunked",
        "x-content-type-options": "nosniff",
      });
      response.write(BEFORE);
      response.flushHeaders();
    });
    await new Promise((resolve, reject) => {
      stream.on("error", (err) => {
        stream.unpipe(response);
        reject(err);
      });
      stream.on("end", () => {
        console.log("Render End: ", Date.now() - start);
        response.write("</div></body></html>");
        response.end();
        resolve();
      });
      stream.pipe(response, { end: false });
    });
  } catch (err) {
    response.writeHead(500, { "content-type": "text/plain" });
    response.end(String((err && err.stack) || err));
    return;
  }
});

app.use(express.static(path.resolve(__dirname, "src")));
app.use("/build", express.static(path.resolve(__dirname, "build")));
```

Let's say we have an app that shows the user a thousand cats in the App component:

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Cat Facts</title>
		<link rel="stylesheet" href="/style.css" />
		<script type="module" defer src="/build/client.js" />
	</head>
	<body>
		<h1>Stream Rendered Cat Facts!</h1>
		<div id="approot">
	</body>
</html>
```

The App gets stream rendered using the `renderToNodeStream` method, the initial HTML gets sent to the response object alongside the chunks of data from the App component.

This data contains useful information that our app has to use in order to render the contents correctly like the title and a stylesheet. If we were to serve render the App component using `renderToString` method, we would need to wait for the app to receive all the data before it can start loading and process this metadata. With `renderToNodeStream` we can start loading and process this information as it's still receiving the chunks of data from the App component.

Let's check another case:

```javascript
import { renderToNodeStream } from "react-dom/server";
import Frontend from "../client";

app.use("*", (req, res) => {
  // Send the start of your HTML to the browser
  response.write('<html><head><title>Page</title></head><body><div id="root">');

  // Render your frontend to a stream and pipe it to the response
  const stream = renderToNodeStream(<Frontend />);
  stream.pipe(res, { end: "false" });
  // Tell the stream to not automatically end the RES when renderer finish

  // When React finishes rendering send the rest of your HTML to the browser
  stream.on("end", () => {
    response.end("</div></body></html>");
  });
});
```

The readable stream output by both functions can emit bytes once you start reading from it. This can be achieved by piping the readable stream to a writable stream such as the response object. The response object progressively sends chunks of data to the client while waiting for new chunks to be rendered.

With this we have better performance, our `TTFB` is better than that for `SSR`, is also more consistent irrespective of the size of the page. The `FP` and `FCP` are also lower.

Handles the pressure really well and supports SEO.

## React Server Components

> Server Components compliment SSR, rendering to an intermediate abstraction without needing to add to the JavaScript bundle

As of 2021, the React team are working on zero bundle size React Server Components which enables modern UX with a server driven mental model.

### Server-side rendering limitations

JavaScript for your components is rendered on the server into an HTML string. This HTML is delivered to the browser, which can result in a fast FCP or LCP.

JavaScript stills needs to be fetched for interactivity which is often achieved via hydration step. Server-side rendering is generally used for the initial page load, so post-hydration is unlikely to be used again.

Let's check what happens before Server components:

```javascript
import marked from "marked"; // 35.9k (11.2k gzipped)
import sanitizeHtml from "sanitize-html"; // 206k (63.3k gzipped)

const NoteWithMarkdown = ({ text }) => {
  const html = sanitizeHtml(marked(text));
};
```

### Server Components

It aims to compliment `SSR`, enabling rendering into an intermediate abstraction format without needing to add to the JavaScript bundle. This allows merging the server tree with the client tree without a loss of state and enables scaling up to more components.

When paired together they support quickly rendering in an intermediate format, then having `SSR` infrastructure rendering this into HTML enabling early pains to still be fast.

After server components:

```javascript
import marked from "marked"; // zero bundle size
import sanitizeHtml from "sanitize-html"; // zero bundle size

const NoteWithMarkdown = ({ text }) => {
  const html = sanitizeHtml(marked(text));
};
```

### Automatic code splitting

It's best practice to only serve code users need as they need it by using code splitting. This allows you to break your app down into smaller bundles requiring less code to be sent to the client.

Before `server components`, we would manually use `React.lazy()` to define split points or rely on a heuristic set by a meta framework, like routes/pages to create new chunks.

Challenges faced with code-splitting:

- Outside of `NextJS`, you would have to do this manually, replacing import statements with dynamic imports.
- It might delay when the app beings loading the component impacting UX.

`server components` introduce **AUTOMATIC CODE SPLITTING** treating all normal imports in Client components as possible code-split points. They also allow developers to select which component to use much earlier (on the server).

## Selective Hydration

Let's check how to combine streaming `SSR` with `selective hydration`.

`SSR` with `hydration` can improve UX. React generates a tree on the server using `renderToString` which is sent to the client after the entire tree is generated. The rendered HTML is **non interactive**, until the JavaScript bundle has been fetched and loaded, which React walks down the tree to hydrate and attaches the handlers.

Another problem is that React only hydrates the tree once. Before React is able to hydrate any component, it needs to have fetched the JavaScript for all the components before it's able to hydrate any of them. This means smaller components (with smaller bundlers) have to wait for the larger component's code to be fetched and loaded, until React is able to hydrate anything on the website.

React 18 solves these issues by allowing us to combine streaming SSR with a new approach to hydration: Selective Hydration.

Instead of `renderToString`, we can stream render HTML using the new `pipeToNodeStream` on the server.

This method, in combination with the `createRoot` method and `Suspense`, makes it possible to start streaming HTML without having to wait for the larger components to be ready. This means we can `lazy-load` components when using `SSR` which wasn't possible before!

```javascript
// index.js
import { hydrateRoot } from "react-dom";
import App from "./App";

hydrateRoot(document, <App />);
```

```javascript
// server.js
import { pipeToNodeStream } from "react-dom/server";

export function render(res) {
  const data = createServerData();
  const { startWritting, abort } = pipeToNodeWritable(
    <DataProvider data={data}>
      <App assets={assets} />
    </DataProvider>,
    res,
    {
      onReadyToStream() {
        res.setHeader("Content-type", "text/html");
        res.write("<!DOCTYPE html>");
        startWriting();
      },
    }
  );
}
```

## Conclusion

That was long! We learned how deep the concept of rendering and optimization has been going from before to now, its an evolving concept that developers are trying to improve everyday, with Frameworks like `NextJS` and `Remix`, we're one step closer to make much more optimized applications

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
