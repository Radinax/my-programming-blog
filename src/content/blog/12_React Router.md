---
title: "React router"
description: "Let's learn how to properly set your routes with React Router!"
category: ["react", "frontend"]
pubDate: "2023-11-11"
published: true
---

## How to use

We will show it applies to a Navbar since it’s the most common case.

In App.js we `import { BrowserRouter as Router, Route } from “react-router-dom”`, where Router will be the container of our routing system, and Route will be the component in charge of saying which component to show at which link:

```javascript
import React from "react";
import Home from "./pages/home";
import Gamelist from "./pages/gamelist";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/game-list" component={Gamelist} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
```

The important part is this:

```javascript
<Route path="/" exact component={Home} />
```

Where path is the url path we’re going to use for Home component, so when a user clicks the `Link` from `react-router-dom` and if it has assigned to the `to` prop, the same path `url`, then it will take the user to the desired path.

So… how do we actually manage our links? Inside Navbar of course! So inside we will `import Link from react-router-dom`:

```javascript
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";

const links = [
  { name: "Home", path: "./", url: "/" },
  { name: "Game List", path: "./game-list", url: "/game-list" },
];

const Navbar = () => {
  return (
    <div>
      {links.map((link) => (
        <Link key={link.name} to={link.path}>
          {link.name}
        </Link>
      ))}
    </div>
  );
};
```

Where the important prop is the “to” which indicates the path `url` we’re going to use.

## What are Switch and Router?

`<Router />` can include many nested routes that render inclusively. And what does "render inclusively" mean? It just means that whenever a route's path matches the url path, **the router will render the route's component**. Let's take a look at the below example.

```javascript
ReactDOM.render(
  <Router>
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/explore" component={Explore} />
  </Router>,
  document.getElementById("root")
);
```

In this example, when a user goes the url path `/`, the `Home`,`Login`, and `Explore` components **will all render**. This is because all three routes include `/` in their paths. The `<Route />` component is handy in this way in that it can render certain components all the time, such as the header, navbar, and other components that should appear on every page of a website.

One way to ensure that routes don't render inclusively is by adding "exact paths" to routes.

```javascript
ReactDOM.render(
  <Router>
    <Route path="/" component={Home} />
    <Route exact path="/login" component={Login} />
    <Route path="/explore" component={Explore} />
  </Router>,
  document.getElementById("root")
);
```

Above, I added an exact path to the login route. So when we visit /login, only the Login component will now render on the page.

So what exactly is the advantage of using `<Switch />`? The `<Switch />` component will only render the first route that matches/includes the path. Once it finds the first route that matches the path, it will not look for any other matches. Not only that, it allows for nested routes to work properly, which is something that `<Router />` will not be able to handle.

```javascript
ReactDOM.render(
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/explore" component={Explore} />
  </Switch>,
  document.getElementById("root")
);
```

In the example above, when the user goes to `/login`, only the `Login` component will now be rendered. It is also important to note that an exact path can and should still be utilized for routes that are inside a `<Switch />`. An exact path for a route that is inside a `<Switch />` makes sure that the route matches exactly the path that is specified. For example, without the exact path for `/` above, a user who goes to `/login` would find the `Home` component rendered on the web page.

## Redirects

Sometimes when you work for a company they have to handle multiple languages so the URL can’t look like “www.website.com/programacion” for the Portuguese version which should be `www.website.com/programacao`, this is where redirects come in handy. I usually have a redirects.js file with the following structure:

```javascript
export default {
  portuguese: [
    { from: "/programming", to: "/programacao" },
    {
      from: "/programming/bunny-adventures",
      to: "/programacao/aventuras-de-coelho",
    },
  ],
  spanish: [
    { from: "/programming", to: "/programacion" },
    {
      from: "/programming/bunny-adventures",
      to: "/programacion/aventuras-de-conejo",
    },
  ],
  internal: [
    {
      from: "/page/terms-and-conditions",
      to: "/pagina/terminos-y-condiciones",
    },
  ],
  external: [
    { from: "/page/animated-cartoons", location: "https://www.cartoons.com" },
  ],
};
```

And we can map them easily:

```javascript
import { Router, Route, Redirect } from "react-router-dom";
import { Home, Gamelist, Navbar } from "../components";
import redirects from "../utils/redirects";

const langcode = process.env.REACT_APP_LANG || "es-VE";

const AppRouter = () => {
  const portugueseRedirects =
    langcode === "pt-BR" &&
    redirects.portuguese.map((redirect) => (
      <Redirect from={redirect.from} to={Redirect.to} />
    ));
  const spanishRedirects =
    langcode === "ES" &&
    redirects.spanish.map((redirect) => (
      <Redirect from={redirect.from} to={Redirect.to} />
    ));
  const internalRedirects = redirects.internal.map((redirect) => (
    <Redirect from={redirect.from} to={Redirect.to} />
  ));
  const externalRedirects = redirects.internal.map((redirect) => (
    <Route
      exact
      path={redirect.path}
      component={() => {
        window.location = redirect.location;
        return null;
      }}
    />
  ));
  return (
    <Router>
      <Navbar />
      <Route path="/" exact component={Home} />
      <Route path="/game-list" component={Gamelist} />
      {/* Portuguese Redirects */}
      {portugueseRedirects}
      {/* Spanish Redirects */}
      {spanishRedirects}
      {/* Internal Redirects */}
      {internalRedirects}
      {/* External Redirects */}
      {externalRedirects}
    </Router>
  );
};
```

Redirects are self explanatory, they require two props, **from** and **to**.

## useHistory hook

We can access the history of the URLs the user has visited.

```javascript
const history = useHistory();
```

`history` has the following attributes:

- **POP**: Visits the route via url, we can use `history.goBack()`, `history.goForward()`, `history.go()`.
- **PUSH**: We can use `history.push(pathname: string)` to send the user to a URL by adding it to the history.

Examples of using push:

```javascript
// Using pathname which is the most common
// Before this push the URL is 'http://localhost:3000'
history.push("/maps");
// After this push the URL is 'http://localhost:3000/maps'

history.push("/maps", { fromPopup: true });
// After this push the URL is 'http://localhost:3000/maps'

history.push({
  pathname: "/maps",
  search: "?id='ES'",
  hash: "#madrid",
  state: { fromPopup: true },
});
// After this push the URL is 'http://localhost:3000/maps?id=ES#madrid'
```

- **REPLACE**: We can use `history.replace()`. It removes the specific history and replaces it.

## useLocation hook

This grabs the information of your current URL and you have access to the following information:

```javascript
// If the URL is http://localhost:3000/maps?id=ES#madrid'
{
    key="asaferf",
    pathname: '/maps',
    search: '?id="ES"',
    hash: '#madrid',
    state: {
        [fromPopup]: true
    }
}
```

## useParams hook

Provides access to search parameters in the URL

```javascript
// If the URL is http://localhost:3000/maps?id=ES#madrid'
import { useParams, Route } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  return <p>The country is {id}</p>;
}

function Dashboard() {
  return (
    <>
      <nav>
        <Link to={`/maps`}>Main Map</Link>
      </nav>
      <main>
        <Route path="/maps/:id">
          <Profile />
        </Route>
      </main>
    </>
  );
}
```

This way we can obtain the value of the `id` parameter of the URL which is one of the most common cases for using this hook.

## useRouteMatch hook

We get access to the `match` object and its primarily use is to construct nested paths.

```javascript
import { useRouteMatch, Route } from "react-router-dom";

function Auth() {
  const match = useRouteMatch();
  return (
    <>
      <Route path={`${match.url}/login`}>
        <Login />
      </Route>
      <Route path={`${match.url}/register`}>
        <Register />
      </Route>
    </>
  );
}
```

`match` has the `url` and `path` property:

- The `path` property contains the dynamic path pattern with URL parameters (eg. `/bands/:band/songs/:song`) and should be used for creating relative `path` props for `Route` components.
- The `url` property has the values of URL parameters filled in (eg. `/bands/queen/songs/bohemian_rhapsody`) and should be used for creating relative `to` props for `Link` components.

## Conclusion

We have learned how to use `react-router-dom`, since `react` doesn't have its own routing we need to add this library to enable routing to different pages in the application.

The documentation in my opinion is too vague for its own good, I know many people who where confused about how to implement it and mainly what is the `exact` for and when to use `switch` or why use `router`.

Hopefully this post was helpful to understand this library in depth.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
