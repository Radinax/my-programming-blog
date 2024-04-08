---
title: "How to use GraphQL on the client using Apollo and on the server using Prisma"
description: "GraphQL has different libraries that enhances the experience of the developer and helps us produce code easier. In the case of React we have Apollo has a our connection with the server that uses Prisma."
category: ["react", "frontend", "backend", "graphql", "prisma"]
pubDate: "2023-12-02"
published: true
---

> The Apollo platform helps you [build](https://www.apollographql.com/docs/intro/platform/#1-build-your-graph-with-apollo-server), [query](https://www.apollographql.com/docs/intro/platform/#2-query-your-graph-with-apollo-client), and [manage](https://www.apollographql.com/docs/intro/platform/#3-manage-your-graph-with-apollo-studio) a unified **graph**: a data layer that enables applications to interact with data from any combination of connected data stores and external APIs.
>
> Your graph sits between application clients and back-end services, facilitating the flow of data between them.

Apollo is a client that let us handle global state.

## Installing dependencies

```text
yarn add apollo-boost react-apollo graphql
```

Here’s an overview of the packages you just installed:

- `apollo-boost` offers some convenience by bundling several packages you need when working with Apollo Client:
- `apollo-client`: Where all the magic happens
- `apollo-cache-inmemory`: Our recommended cache
- `apollo-link-http`: An Apollo Link for remote data fetching
- `apollo-link-error`: An Apollo Link for error handling
- `apollo-link-state`: An Apollo Link for local state management
- `graphql-tag`: Exports the `gql` function for your queries & mutations
- `react-apollo` contains the bindings to use Apollo Client with React.
- `graphql` contains Facebook’s reference implementation of GraphQL - Apollo Client uses some of its functionality as well.

## How to use

We will use create-react-app and on the root we look for `index.js` file and add the client:

```javascript
import React from "react";
import { render } from "react-dom";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
```

It’s very similar to what we did with Redux and the Provider

## How to do a Query

```javascript
import gql from "graphql-tag";

export const GET_GAMES = gql`
  query getGames {
    allGames {
      title
      description
    }
  }
`;
```

## How to CREATE

```javascript
import gql from "graphql-tag";

export const CREATE_GAME = gql`
  mutation CreateGame($title: String!, $description: String!) {
    createGame(title: $title, description: $description) {
      title
      description
    }
  }
`;
```

## How to UPDATE

```javascript
import gql from "graphql-tag";

export const UPDATE_GAME = gql`
  mutation UpdateGame($id: ID!, $title: String!, $description: String!) {
    updateGame(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;
```

## How to DELETE

```javascript
import gql from "graphql-tag";

export const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id) {
      id
    }
  }
`;
```

## How to apply queries and mutations in code

### READ

```javascript
...
import { useQuery } from '@apollo/react-hooks'
...

const { loading, error, data } = useQuery(GET_GAMES)
if (loading) return <div>LOADING</div>
if (error) return <div>There was an error: {error}</div>
return (
  {data.map(o => (
    <div key={o.title}>{o.title}</div>
  ))}
)
```

### CREATE

```javascript
...
import { useMutation } from '@apollo/react-hooks'
...

const [title, setTitle] = useState('')
const [description, setDescription] = useState('')
const [createGame] = useMutation(CREATE_GAME, {
    refetchQueries: [ { query: GET_GAMES } ]
  })

const handleSubmit = () => {
  createGame({ variables: {title, description} })
}

return (
  <form onSubmit={handleSubmit}>
    <input type='text' value={title} onChange={e => setTitle(e.target.value)} />
    <input type='text' value={description} onChange={e => setDescription(e.target.value)} />
  </form>
)
```

We can perform similar codes for updating and deleting using the previous examples.

## Starting from scratch

### Installing dependencies

On the same project we worked on last post, write the following commands:

```text
npx create-react-app client
cd client
yarn add apollo-boost react-apollo graphql
```

#### File Structure

```text
Project/
├── src/
│   ├── App.js
│   └── App.css
└── index.js
```

Erase everything until it looks like this.

Now configure index.js with Apollo Provider and use the EP provided by Prisma.

Inside App.js import everything necesary to perform a GET request like this:

```javascript
import React from "react";
import "./App.css";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const GET_DATA = gql`
  query getData {
    feed {
      id
      description
      url
    }
  }
`;

const App = () => {
  const { loading, error, data } = useQuery(GET_DATA);
  if (loading) return <div>LOADING</div>;
  if (error) return <div>There was an error: {error}</div>;
  console.log(data);
  return <div>Test</div>;
};

export default App;
```

Check your console and you will see the information you requested!

Now lets add a POST query from the client side.

```javascript
import React from "react";
import "./App.css";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

const GET_DATA = gql`
  query getData {
    feed {
      id
      description
      url
    }
  }
`;

const CREATE_LINK = gql`
  mutation CreateLink($url: String!, $description: String!) {
    post(url: $url, description: $description) {
      url
      description
    }
  }
`;

const App = () => {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const { loading, error, data } = useQuery(GET_DATA);
  const [createLink] = useMutation(CREATE_LINK, {
    refetchQueries: [
      {
        query: GET_DATA,
      },
    ],
  });
  if (loading) return <div>LOADING</div>;
  if (error) return <div>There was an error: {error}</div>;

  const onChange = (setter) => (e) => setter(e.target.value);
  const onSubmit = () => createLink({ variables: { url, description } });

  const createForm = (
    <form onSubmit={onSubmit}>
      <label>Url: </label>
      <input type="text" name="url" value={url} onChange={onChange(setUrl)} />
      <label>Description: </label>
      <input
        type="text"
        name="description"
        value={url}
        onChange={onChange(setUrl)}
      />

      <input type="submit" value="submit" />
    </form>
  );

  const information = (
    <ul>
      {data.feed.map((o) => (
        <li key={o.id}>
          URL: {o.url} | DESCRIPTION: {o.descriiption}
        </li>
      ))}
    </ul>
  );
  return (
    <div>
      {createForm}
      {information}
    </div>
  );
};

export default App;
```

And finally inside our `index.js`:

```javascript
import React from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import App from "./App";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  // server url
  uri: "http://localhost:5000/",
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
```

### Summary

- Have a server ready with Prisma
- In client side add the respective libraries and add Apollo Provider with its client
- In the app you can do queries or mutation based of the schema you made on the backend

## Conclusion

Today we learned how to use Apollo with React! Its very similar to the way we handle Redux, in the sense that we wrap our App with a provider which connects with the server, where we send queries and in the server we have the resolvers waiting to solve those queries and return the requested information.

We will be doing more projects related to GraphQL.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
