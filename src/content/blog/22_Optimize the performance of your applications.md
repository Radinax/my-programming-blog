---
title: "Optimize the performance of your applications"
description: "Let's learn how to optimize our performance, last post we learned about rendering and the different patterns applied, the importance of SSR and hydration."
category: ["react", "frontend", "concept"]
pubDate: "2023-11-25"
published: true
---

## Optimize your loading sequence

The idea is to have components and resources available at just the right time to give you a smooth loading experience to ensure the user have great UX.

### Problem 1: Sub-optimal sequencing

> Web Vitals is a **landmark announcement from Google** that enables you to peak into their top secret ranking algorithm to see how they measure your site for one of their key website quality indicators: User Experience

`FCP` (First Contentful Paint) occurs before `LCP` (Largest Contentful Paint) which occurs before `FID` (First Input Delay), this means that resources required for achieving `FCP` should be prioritized over `LCP` and `FID`.

Resources are not sequenced and pipelined in the correct order.

### Problem 2: Network/CPU utilization

Resources are not pipelined appropriately to ensure full CPU and Network utilization which results in dead time on the CPU when the process is network bound.

The idea here is that we have to download the scripts sequentially, the CPU can start processing the first one as soon as it is downloaded which results in better CPU and Network utilization.

### Problem 3: Third-Party products

Examples are ads, analytics, social widgets, live chat and other embeds. A third party library comes with its own process and scripts which are sometimes not optimized to support our site performance.

### Problem 4: Resource level optimization

Effective sequencing needs that the resources that are being sequenced to be served optimally. This includes CSS to be inline, images to be sized correctly and JS should be code-split and delivered incrementally.

To apply code-splitting:

- Modern React: Suspense with Concurrent mode.
- Lazy loading using dynamic imports which is done manually.

### Solution 1: Critical CSS

This is the minimum `CSS` required for `FCP` which has to be inline within the `HTML` rather than import from another `CSS` file. Only the `CSS` required for the route should be downloaded at any given time and all critical `CSS` should be split accordingly.

If inline is not possible, then preload the `CSS` and serve it from the same origin as the document. Don't do it from multiple domains and don't use 3rd party like Google Fonts. Your own server could serve as proxy for the 3rd party `CSS` instead.

Delay in fetching CSS can impact `FCP` and `LCP`, to avoid prioritize non-inline `CSS`.

Too much inline `CSS` can cause `HTML` bloating which can hurt the `FCP`, identify which is critical and apply code splitting.

Inline `CSS` cannot be cached, you could have a duplicate request for the `CSS` to be cached, but this can impact the `FID`.

### Solution 2: Fonts

Delay in fetching fonts can hurt the `FCP`, as such you need to either inline it or fetch it with `preconnect`.

Inline fonts can bloat the `HTML` a lot and delay initiating other critical resource fetching. Font fallback could be used to unblock `FCP` but this hurts `CLS` due to jumping fonts and it also affects `FID` due to potentially large style and layout task on the main thread when the real font arrives

### Solution 3: Images

For `ABT` (Above The Fold) images which the ones initially visible to the user, they should all be sized correctly otherwise it hurts the `CLS`. Placeholders for `ABT` images should be rendered by the server.

For `BTF` (Below The Fold) images which are the ones not initially visible to the user on page load, are great candidates for lazy loading which ensures they don't content with `1P-JS` or important `3P-JS` needed on the page. If `BTF` images were loaded before, the `FID` would get delayed.

### 1P Javascript

Impacts the interaction readiness of the application, this should start loading before `ABT` images and execute before `3P-JS` on the main thread. `1P-JS` does not block `FCP` and `LCP` in pages rendered on the server side.

### 3P Javascript

Sync script in the head could block `CSS` and font parsing, but also `HTML` body parsing and also delay `1P-JS` execution and push out hydration.

### The ideal loading sequence

`NextJS` SSR application before being optimized loads like this:

| CSS        | CSS is preloaded before JS but not inline                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Javascript | 1PJS is preloaded<br />3PJS is not managed and can still be render blocking anywhere                                                                           |
| Fonts      | Fonts are neither inline nor use preconnect<br />Fonts are loaded via external stylesheets which delays the loading<br />Fonts may or may not be display block |
| Images     | Hero images are not optimized<br />Both ABT and BTF images are not optimized                                                                                   |

Let's check how a sequence without `3P-JS` would look like:

| Sequence of events on the main browser thread |                                               | Sequence of requests on the network            |     |
| --------------------------------------------- | --------------------------------------------- | ---------------------------------------------- | --- |
| 1                                             | Parse HTML                                    | Small inline 1P scripts                        | 1   |
|                                               |                                               |                                                |     |
| 2                                             | Execute small inline 1P scripts               | Inline critical CSS (Preload if external)      | 2   |
|                                               |                                               | Inline critical Fonts (Preconnect if external) | 3   |
| 3                                             | Parse FCP resources like CSS and fonts        | LCP image (Preconnect if external)             | 4   |
| FCP                                           |                                               | Inline Fonts (Preconnect if external)          | 5   |
| 4                                             | Render LCP resources like Hero image and text | Non critical CSS                               | 6   |
|                                               |                                               | 1P JS                                          | 7   |
|                                               |                                               | ABF images (preconnect)                        | 8   |
| LCP                                           |                                               | BTF images                                     | 9   |
| 5                                             | Render important ABT images                   |                                                |     |
| Visually complete                             |                                               |                                                |     |
| 6                                             | Parse non critical CSS                        |                                                |     |
| 7                                             | Execute 1PJS and hydrate                      | Lazy loaded JS chunks                          | 10  |
| FID                                           |                                               |                                                |     |

- Avoid preload as much as possible, especially for fonts.
- Font CSS should inline. If from another origin, use preconnect.
- Preconnect is recommended for all sources from another origin.
- Non critical `CSS` should be fetched before `FID`.
- Start fetching `1P-JS` before `ABT` on the network.
- Parsing `HTML` on the main thread and download of `ABT` can continue in parallel while `1p-JS` is parsed.

This process with a `3P-JS` would look like:

| Sequence of events on the main browser thread |                                               | Sequence of requests on the network            |     |
| --------------------------------------------- | --------------------------------------------- | ---------------------------------------------- | --- |
| 1                                             | Parse HTML                                    | FCP blocking 3P resources                      | 1   |
|                                               |                                               |                                                |     |
|                                               |                                               | Small inline 1P scripts                        | 2   |
| 2                                             | Execute small inline 1P scripts               | Inline critical CSS (Preload if external)      | 3   |
| 3                                             | Parse FCP blocking 3P resources               | Inline critical Fonts (Preconnect if external) | 4   |
| 4                                             | Parse FCP resources like CSS and fonts        | 3P personalized ABT image required for LCP     | 5   |
| FCP                                           |                                               | LCP image (Preconnect if external)             | 6   |
| 5                                             | Render 3P personalized ABT required for LCP   | Inline Fonts (Preconnect if external)          | 7   |
|                                               |                                               | Non critical CSS                               | 8   |
| 6                                             | Render LCP resources like Hero image and text | 3P that must execute before FID                | 9   |
|                                               |                                               | 1P JS for interactivity                        | 10  |
| LCP                                           |                                               | ABT images (preconnect)                        | 11  |
| 7                                             | Render important ABT images                   | Default 3P JS                                  | 12  |
| 8                                             | Parse non critical CSS                        |                                                |     |
| 9                                             | Execute 3P required for FID                   | BTF images                                     | 13  |
| 10                                            | Execute 1PJS and hydrate                      | Lazy loaded JS chunks                          | 14  |
| FID                                           |                                               | Less important 3P JS                           | 15  |

Preconnect is recommended for the following 3P Requests:

- FCP blocking 3P resources
- 3P personalized ABT image required for LCP
- 3P that must execute before FID
- Default `3P-JS`

We need to use `ScriptLoader` from `NextJS`, this component optimize critical rendering path and ensure external scripts don't become a bottleneck to optimal page load. Loading Priorities allows us to schedule the scripts at different milestones to support different use cases:

- `After-Interactive`: Loads the specific 3P script after the next hydration. This can be used to load tag managers, ads or analytic scripts that we want to execute as early as possible but after 1P scripts.
- `Before-Interactive`: Loads the specific 3P script before hydration. It can be used in cases where we want the 3P script to execute before the 1P script. For example polyfill, bot detection, security and authentication, user consent management, etc.
- `Lazy-Onload`: Prioritize all other resources over the specified 3P script and lazy load the script. It can be used for CRM components like Google Feedback or Social Network specific scripts like share buttons, comments, etc.

In summary, preconnect, script attributes and `ScriptLoader` for `NextJS` can help us get the desired sequence for our scripts.

## Static Import

The modules get executed as soon as the engine reaches the line on which we import them. When you open the console, you can see the order in which the modules have been loaded. On static import `Webpack` bundles the modules into the initial bundle.

### Dynamic Import

Let's assume a Chat application which has four key components: `UserInfo`, `ChatList`, `ChatInput` and `EmojiPicker`, but only three of these are used instantly, with the `EmojiPicker` not rendered initially or at all, so we can dynamic import it with `React Suspense`.

When the user clicks on the emoji the component gets rendered for the first time, but it renders a `Suspense` component which receives the lazy imported module and accepts a fallback prop which receives the component that should get rendered while the suspended component is still loading.

Let's check an example using `React Suspense`:

```javascript
import React, { Suspense, lazy, useReducer } from 'react'
// import Send from './icons/Send'
// import Emoji from './icons/Emoji'
const Send = lazy(() => import ('./icons/Send'))
const Emoji = lazy(() => import ('./icons/Emoji'))
const Picker = lazy(() => import ('./EmojiPicker'))

const ChatInput = () => {
    const [pickerOpen, togglePicker] = useReducer(state => !state, false)
    const loading = <p>Loading...</p>
    return (
    	<Suspense fallback={loading}>
        	<div>
        		<input type="text" placeholder="Type a message..."/>
                <Emoji onClick={togglePicker} />
                {<pickerOpen && <Picker />}
				<Send />
        	</div>
        </Suspense>
    )
}
```

Let's check an example without using `React Suspense` since `NextJS` doesn't support it as of 26/12/2021 (check here how to use it https://nextjs.org/docs/advanced-features/react-18):

```javascript
import React, { useReducer } from 'react'
import loadable from '@loadable/component'
import Send from './icons/Send'
import Emoji from './icons/Emoji'
const EmojiPicker = loadable(() => import ('./EmojiPicker'), {
    fallback: <div>Loading...</div>
})

const ChatInput = () => {
    const [pickerOpen, togglePicker] = useReducer(state => !state, false)
    return (
        <div>
            <input type="text" placeholder="Type a message..."/>
            <Emoji onClick={togglePicker} />
            {<pickerOpen && <EmojiPicker />}
            <Send />
        </div>
 	)
}
```

### Import on visibility

Loading non critical components when they're visible in the viewport.

```javascript
import React, { useReducer } from 'react'
import LoadableVisibility from 'react-loadable-visibility/react-loadable'
import Send from './icons/Send'
import Emoji from './icons/Emoji'
const EmojiPicker = LoadableVisibility({
    loader: () => import ('./EmojiPicker'),
    loading: <div>Loading...</div>
})

const ChatInput = () => {
    const [pickerOpen, togglePicker] = useReducer(state => !state, false)
    return (
        <div>
            <input type="text" placeholder="Type a message..."/>
            <Emoji onClick={togglePicker} />
            {<pickerOpen && <EmojiPicker />}
            <Send />
        </div>
 	)
}
```

When `EmojiPicker` is rendered to the screen, after the user clicks a GIF button, `react-loadable-visibility` will detect that `EmojiPicker` should be visible on the screen and it will start importing the module, the user will see a loading component being rendered.

### Import on interaction

Load non critical resources when a user interacts with the UI requiring it.

The best times to implement this is when:

- The user clicks to interact with that component for the first time.
- The component scrolls into view
- Deferring load of that component until browser is idle (when user isn't active) using `requestIdleCallback`

The different ways to load resources of this type are:

- **Eager**: Load resource right away.
- **Lazy (route based)**: Load when user navigates to a route or component.
- **Lazy (on interaction)**: Load when user clicks an UI.
- **Lazy (in viewport)**: Load when user scrolls towards the component.
- **Prefetch**: Load prior to needed, but after critical resources are loaded.
- **Preload**: Eagerly, with great level of urgency.

Import on interaction for `1P-JS` should only be done if you can't prefetch resources prior to interaction. This should be used for `3p-JS`, where we want to defer it. For example, Google Docs sharing feature is 500KB but is deferred until its interacted by the user.

When doing this type of import, we need to **implement a preview or placeholder** (for example, YouTube lite embed provides a custom element and presents a minimal thumbnail and play button) while the user waits for the `3P-JS` loads. A good way is using `async/defer`.

> The `defer` attribute tells the browser not to wait for the script. Instead, the browser will continue to process the HTML, build DOM. The script loads “in the background”, and then runs when the DOM is fully built.

Concrete cases on when to use:

- Video player embeds.
- Authentication (Login button) which can be heavy JS execution.
- Chat widget.

### Async/Defer

Both `async` and `defer` have one common thing: downloading of such scripts doesn’t block page rendering. So the user can read page content and get acquainted with the page immediately.

But there are also essential differences between them:

|       | Order                                                                                  | DOM Content Loaded                                                                                                                                                   |
| ----- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| async | _Load-first order_. Their document order doesn’t matter – which loads first runs first | Irrelevant. May load and execute while the document has not yet been fully downloaded. That happens if scripts are small or cached, and the document is long enough. |
| defer | _Document order_ (as they go in the document).                                         | Execute after the document is loaded and parsed (they wait if needed), right before `DOMContentLoaded`.                                                              |

In practice, `defer` is used for scripts that need the whole DOM and/or their relative execution order is important.

And `async` is used for independent scripts, like counters or ads. And their relative execution order does not matter.

```javascript
<!-- Google Analytics is usually added like this -->
<script async src="https://google-analytics.com/analytics.js"></script>
```

An example of dynamic importing is:

```javascript
function loadScript(src) {
  let script = document.createElement("script");
  script.src = src;
  script.async = false;
  document.body.append(script);
}

// long.js runs first because of async=false
loadScript("/article/script-async-defer/long.js");
loadScript("/article/script-async-defer/small.js");
```

Without `script.async=false`, scripts would execute in default, load-first order (the `small.js` probably first).

Again, as with the `defer`, the order matters if we’d like to load a library and then another script that depends on it.

### Dynamic importing components with React

```javascript
import React, { useState, createElement } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import ErrorBoundary from './ErrorBoundary'

const Channel = () => {
    const [emojiPickerEl, setEmojiPickerEl] = useState(null)
    const openEmojiPicker = () => {
        import('./EmojiPicker')
        	.then(module => module.default)
        	.then(emojiPicket setEmojiPickerEl(createElement(emojiPicker)))
    }
    const closeEmojiPickerHandler = () => setEmojiPickerEl(null)
    const onClick = () => emojiPickerEl ? openEmojiPicker : closeEmojiPickerHandler
    return (
    	<ErrorBoundary>
        	<div>
        		<MessageList />
        		<MessageInput onClick={onClick} />
				{emojiPickerEl}
        	</div>
        </ErrorBoundary>
    )
}
```

### Import on interaction

If made an app similar to Google Hotels using Client Side Rendering, we would download all the process at once, the `HTML`, `JS`, `CSS` and then fetch data, then we render everything, but this would create the problem of having the user waiting with nothing on the screen, a huge part of that `JS` and `CSS` bundle might not be needed.

If we move to `SSR` the page will look ready, but won't be able to interact at the first `FCP` due to waiting for the hydration process and getting annoyed because the clicks are not working.

What can we do?

Google teams track clicks early because the first chunk of `HTML` includes a small event library (`JSAction`) which tracks all clicks before the framework is bootstrapped. The events are used for:

- Triggering download of component code based on user interactions.
- Replaying user interactions when the framework finishes bootstrapping.
- A period after idle time.
- On user mouse hover over the relevant UI to action.
- Based on sliding scale of eagerness based on browser signals.

The data is loaded based on user interactions.

**What happens if it takes a long time to load a script after the user clicks?**

Small chunks minimize the chance a user is going to wait long for code and data to fetch and execute. If the problem persist, then `prefetch` these resources after critical content is in the page and done loading.

**What about lack of functionality?**

An embedded video player will not be able to auto play media at that instant, if this is key for the app, then `lazy-load` these third party `iframes` on the user scrolling them into view rather than deferring load until interaction.

**What if the resource is very heavy to lazy load?**

For example a social media embed which might be needed immediately can weight 2-3MB of JS, which makes lazy-load and facades less applicable.

We can replace the embed with a static variant that looks similar, linking out to a more interactive version like the original social media post. At build time the data for the embed can be pulled in and transformed into a static HTML version.

### Summary of imports

`1P-JS` can impact the initial interaction of modern pages on the web, but it can get delayed behind non-critical JS. We should avoid synchronous `3P-JS` in the document head and aim to load non blocking `3P-JS` after `1P-JS` has finished loading. `Import on interaction` gives us a way to defer the loading of non-critical resources to a point when the user is much more likely to need the UI they power

## Route based splitting

> Dynamically loading components based on the current route.

We can request resources only needed for specific routes, by adding route-based splitting. Combining `React Suspense` with libraries like `react-router`, we can dynamically load components based on the current route.

```javascript
import React, { lazy, Suspense } from "react";
import { render } from "react-dom";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

const App = lazy(() => import("./App"));
const Overview = lazy(() => import("./Overview"));
const Settings = lazy(() => import("./Settings"));

render(
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route exact path="/overview">
          <Overview />
        </Route>
        <Route exact path="/settings">
          <Settings />
        </Route>
      </Switch>
    </Suspense>
  </Router>,
  document.getElementById("root")
);
```

This way we lazy load components per route! We only request the bundle that contains the code that's necessary for the current route.

## Bundle Splitting

> Split your code into small, reusable pieces

Bundlers like `Webpack` or `Rollup` take the app source code and bundle it together into one or more bundles. When a user visits this website, the bundle is requested and loaded in order to display the data to the user's screen.

Modern browsers have the capacity to parse and compile the code efficiently, but the developer is in charge of:

- The loading time of the requested data
- Execution time of the requested data

The bigger the bundle, the longer it takes before the engine reaches the line on which the first rendering call has been made, until then the user has to wait until the website loads.

Let's take the emoji picker case where we lazy loaded it, we could have a large bundle and a smaller one, the `main.bundle.js` and `emoji-picker.bundle.js`, reducing the amount of data needed for the initial render.

## The solution: PRPL Pattern

Optimize initial load through precaching, lazy loading and minimizing rountrips.

- **P**ushing critical resources efficiently, which minimizes the amount of roundtrips to the server and reducing loading time.
- **R**endering the initial route soon as possible to improve the UX.
- **P**re-caching assets in the background for frequently visited routes to minimize the amount of requests to the server and enable a better offline experience.
- **L**azily loading routes or assets that aren't requested as frequently.

When we visit a site, we first have to make a request to the server in order to get these resources. The file that the entry-point points to, gets returned from the server, which is our app initial `HTML` file.

The browser's HTML parser starts to parse this data as soon as it starts receiving from the server. If the parser discovers that more resources are needed, such as stylesheets or scripts, another `HTTP` request is sent to the server in order to get these resources.

### How to improve HTTP request using PRPL pattern

With `HTTP/1.1` we were able to keep the `TCP` connection between the client and the server alive before a new `HTTP` request gets sent with the keep-alive header. It used a delimited plaintext protocol in the request and response. Had a maximum of 6 `TCP` connections between the client and the server, before a new request could be sent, the previous one had to be resolved, otherwise it would block other incoming requests.

`HTTP/2` splits the requests and responses up in smaller pieces called frames. An `HTTP` request that contains headers and a body field gets split into at least two frames: a headers frame and a data frame. `HTTP/2` makes use of bidirectional streams, where we can have one single `TCP` connection that includes multiple bidirectional streams that can carry multiple request and response frames between the client and the server.

Once the server received all request frames, it reassembles them and generates response frames, these are sent back to the client which reassembles.

`HTTP/2` introduced a more optimized way of fetching data, called server push. Instead of asking for resources every time by sending an `HTTP` request, the server can send additional resources automatically by "pushing" these resources.

Once the client received these resources, it gets stored in the browser's cache, when they get discovered while parsing the entry file, the browser can get the resources from cache instead of making another `HTTP` request to the server.

The problem is that the server push is not `HTTP` cache aware, the pushed resources won't be available to us the next time we visit the website and we will have to make another request.

`PRPL` patterns uses `service workers` after the initial load to cache those resources in order to make sure the client is not making unnecessary requests.

> A service worker is **a script that your browser runs in the background**, separate from a web page, opening the door to features that don't need a web page or user interaction. Today, they already include features like push notifications and background sync

The developers know what resources are critical to fetch, while the browsers try to guess, this can be solved by adding a `preload` resource hint to the critical resources.

Telling the browser that you like to `preload` a certain resource, you're telling it that you would like to fetch it sooner than the browser would discover it.

DON'T OVER DO IT! While it's a great way to optimize loading time, pushing too many files can be harmful because the **browser's cache is limited**.

The `PRPL` pattern focus on optimizing the initial load. No other resources get loaded before the initial route has loaded and rendered completely.

We can do this by code splitting our application into small performant bundles which makes it possible for the users to only load the resources they need, when they need it, while maximizing `cachability`.

But, what happens when multiple bundles share the same resources? A browser has a hard time identifying this.

The `PRPL` pattern makes sure no other resources get requested or rendered before the initial route is visible on the user's device, once the initial route is loaded, a server worker can get installed in order to fetch the resources for the other frequently visited routes in the background.

This way the user won't experience any delay, if the user wants to navigate to a frequently visited route that's been cached by the service worker, this can get the required resource from cache instead of sending a request to the server.

The resources for routes that aren't as frequently visited can be dynamically imported.

## Preload

> Inform the browser of critical resources before they are discovered

It allows the browser to request critical resources, for example:

```html
<html>
  <head>
    <link rel="preload" href="emoji-picker.js" as="script" />
  </head>
  <body>
    ...
    <script src="stickers.js" defer></script>
    <script src="video-sharing.js" defer></script>
    <script src="emoji-picker.js" defer></script>
  </body>
</html>
```

`preload` can be useful to load JS bundles that are necessary for interactivity, but we need to take care, because we want to avoid improving interactivity at the cost of delaying resources.

If we want to optimize loading of `1P-JS` we can use `<script defer>` to help with early discover of these resources.

To `preload` in `SPA` we need to let `Webpack` know that the module needs to be preloaded:

```javascript
const EmojiPicker = import(/* webpackPreload: true */ "./EmojiPicker");
```

For example:

```javascript
import React, { Suspense, lazy, useReducer } from "react";
import Send from "./icons/Send";
import Emoji from "./icons/Emoji";
const EmojiPicker = lazy(() => import("./EmojiPicker"));

const ChatInput = () => {
  const [pickerOpen, togglePicker] = useReducer((state) => !state, false);
  const loading = <p>Loading...</p>;
  return (
    <div>
      <input type="text" placeholder="Type a message..." />
      <Emoji onClick={togglePicker} />
      {pickerOpen && (
        <Suspense fallback={loading}>
          <EmojiPicker />
        </Suspense>
      )}
      <Send />
    </div>
  );
};
```

Inside our `webpack.config.js`

```javascript
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.js",
    emojiPicker: "./src/components/EmojiPicker.js",
  },
  module: {},
  resolve: {},
  output: {},
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "dist", "index.html"),
    }),
    new PreloadWebpackPlugin({
      rel: "preload",
      as: "script",
      include: ["emojiPicker"],
    }),
  ],
};
```

In `Webpack 4.6.0`+ we can add a comment like `/* webpackPreload: true */`, in older versions we need to add `preload-webpack-plugin` to the `webpack.config.js`.

This will make our `EmojiPicker` component be `prefetched`! This will output the following tags in the head:

```html
<link rel="preload" href="emoji-picker.bundle.js" as="script" />
<link rel="preload" href="vendors~emoji-picker.bundle.js" as="script" />
```

Instead of waiting for the component to get loaded **AFTER** the initial render, we can get the resource instantly now. Loading assets in the smart order makes the initial loading time longer, so only `preload` resources that have to be visible ~1 second after the initial render.

If we truly want a script to be downloaded at the highest priority, but not block the parser waiting for a script, we can `preload` + `async`, this makes other resources delayed by the `preload`:

```html
<link rel="preload" href="emoji-picker.js" as="script" />
<scriptsrc="emoji-picker.js" async></script>
```

Be sure to use `preload` only when it's needed.

## Prefetch

> Fetch and cache resources that may be requested some time soon

Prefetch (`<link rel="prefetch">`) is a browser optimization which allows us to fetch resources that may be needed for subsequent routes or pages before they are needed. We can do this declaratively in `HTML`:

```html
<link rel="prefetch" href="/pages/next-page.html" />
<link rel="prefetch" href="/js/emoji-picker.js" />
```

Users will likely need certain resources soon after the initial render, so it shouldn't be included in the initial bundle to reduce the loading time as much as possible.

Components we know are likely to e used at some point can be `prefetched`, we can let `Webpack` know by adding the following comment:

```javascript
const EmojiPicker = import(/* webpackPrefetch: true */ "./EmojiPicker");
```

After building the app, we can see the `EmojiPicker` will be `prefetched`:

```html
<link rel="prefetch" href="emoji-picker.bundle.js" as="script" />
<link rel="prefetch" href="vendors~emoji-picker.bundle.js" as="script" />
```

The browser when idle, will make the request to load the resource and cache it.

DON'T OVER DO IT! If the users don't usually request that resource you can potentially cost the user money. Only prefetch the necessary resources.

## Conclusion

Today we learned about how to properly optimize your web application using concepts like dynamic importing, lazy/suspense, preload, prefetch, bundle splitting, the PRPL pattern, import on interaction, etc, so many concepts that help us create the best user experience possible.

See you on the next post.

Sincerely,

**End. Adrian Beria**
