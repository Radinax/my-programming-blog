---
title: "First steps into learning GraphQL"
description: "GraphQL is a new API standard to provide an alternative to REST, it has been gaining popularity along the community and this series is meant to learn what makes it so good over REST."
category: ["frontend", "backend", "graphql"]
pubDate: "2023-11-30"
published: true
---

Title: First steps into learning GraphQL

Excerpt: GraphQL is a new API standard to provide an alternative to REST, it has been gaining popularity along the community and this series is meant to learn what makes it so good over REST.

Categories:

> GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

## Features

### Ask for what you need, get exactly that

Send a GraphQL query to your API and get exactly what you need, nothing more and nothing less. GraphQL queries always return predictable results. Apps using GraphQL are fast and stable because they control the data they get, not the server.

You can send this query:

```graphql
{
  hero {
    name
    height
  }
}
```

And you get:

```json
{
  "hero": {
    "name": "Luke Skywalker",
    "height": 0.172
  }
}
```

### Get many resources in a single request

GraphQL queries access not just the properties of one resource but also smoothly follow references between them. While typical REST APIs require loading from multiple URLs, GraphQL APIs get all the data your app needs in a single request. Apps using GraphQL can be quick even on slow mobile network connections.

```graphql
{
  hero {
    name
    friends {
      name
    }
  }
}
```

And you get:

```json
{
  "hero": {
    "name": "Luke Skywalker",
    "friends": [{ "name": "Obi Wan Kenobi" }, { "name": "RD-D2" }]
  }
}
```

### Describe what’s possible with a type system

GraphQL APIs are organized in terms of types and fields, not endpoints. Access the full capabilities of your data from a single endpoint. GraphQL uses types to ensure Apps only ask for what’s possible and provide clear and helpful errors. Apps can use types to avoid writing manual parsing code.

```graphql
{
  hero {
    name
    friends {
      name
      homeWorld {
        name
        climate
      }
      species {
        name
        lifespan
        origin {
          name
        }
      }
    }
  }
}
```

The schema would look like:

```graphql
type Query {
  hero: Character
}

type Character {
  name: String
  friends: [Character]
  homeWorld: Planet
  species: Species
}

type Planet {
  name: String
  climate: String
}

type Species {
  name: String
  lifespan: Int
  origin: Planet
}
```

## Core Concepts

### Schema Definition Language (SDL)

The following is an example of SDL to define a type called Person:

```graphql
type Person {
  name: String!
  age: Int!
}
```

Where you can define the data type (`String`, `Int`, `Bool`) and you can add the `!` to say its required.

You can also relate two types:

```graphql
type Post {
  title: String!
  author: Person!
}
```

And you need to relate both types by modifying Person:

```graphql
type Person {
  name: String!
  age: Int!
  posts: [Post!]!
}
```

We created a one to many relationship between Person and Post and made posts in Person an array of Post.

### Fetching Data with Queries

Instead of providing several EP so you can fetch information from them like you did with REST, now with GraphQL you have one EP.

#### Basic Query

Lets check a basic query:

```graphql
{
  allPersons {
    name
  }
}
```

Where `allPersons` is the root field of the query and everything that follows is the payload of the query, the response would be:

```javascript
{

  "allPersons": [
    { "name": "Adrian" },
    { "name": "Alberto" },
    { "name": "Carlos" }
  ]
}
```

If you add age to the query you get the response with the age inside each object.

#### Queries with Arguments

```graphql
{
  allPersons(last: 2) {
    name
  }
}
```

This time you add a `last` parameter to return a specific number of persons. This is defined in the **schema** (we will check this later).

#### CRUD with Mutations

For creating:

```graphql
mutation {
  createPerson(name: "Bob", age: 20) {
    name
    age
  }
}
```

This time the root field is `createPerson`, and the response to the server would look like:

```javascript
"createPerson": {
  "name": "Bob",
  "age": 20
}
```

For updating:

```graphql
mutation {
  updatePerson(id: 1) {
    id
  }
}
```

For delete:

```graphql
mutation {
  deletePerson(id: 1) {
    id
  }
}
```

### Realtime updates with Subscription

Instead of the typical request-response cycle from mutations and queries, you can send streams of data at real time.

```graphql
subscription {
  newPerson {
    name
    age
  }
}
```

When a new mutation is performed that creates a new Person, the server sends the information to the client.

### Defining a Schema

A Schema specifies the capacity of the API and defines how the client can request the data, its a collection of GraphQL types.

To write them you need to define the root types:

```graphql
type Query { ... }
type Mutation { ... }
type Subscription { ... }
```

To enable the codes we wrote before we define the schema:

```graphql
type Query {
  allPersons(last: Int): [Person!]!
}
type Mutation {
  createPerson(name: String!, age: Int!): Person!
}
type Subscription {
  newPerson: Person!
}

type Person {
  name: String!
  age: Int!
  posts: [Post!]!
}
type Post {
  title: String!
  author: Person!
}
```

## Architecture

There are three cases:

1. **GraphQL server with a connected database**

When query arrives to server it gets read and fetches the required information from the database, this is called **resolving** the query. You can use a network protocol like `TCP`, `WebSockets`, etc. You can also use the database of your choice.

2. **GraphQL layer that integrates existing systems**

You can connect a legacy system, microservice and third-party API to `GraphQL`, this way new clients can connect to this `GraphQL` server to fetch the data they need, it would connect those three systems to the client.

3. Connected database and integration of existing system

When a query reach the server it will resolve and retrieve the required data from the database or the integrated API.

## Resolver Functions

At the top level of every GraphQL server is a type that represents all of the possible entry points into the GraphQL API, it's often called the _Root_ type or the _Query_ type.

Lets use these schemas as examples:

```graphql
type Query {
  human(id: ID!): Human
}

type Human {
  name: String
  appearsIn: [Episode]
  starships: [Starship]
}

enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}

type Starship {
  name: String
}
```

In the following example, our Query type provides a field called `human` which accepts the argument `id`. The resolver function for this field likely accesses a database and then constructs and returns a `Human` object.

```javascript
// Resolver
Query: {
  human(obj, args, context, info) {
    return context.db.loadHumanByID(args.id).then(
      userData => new Human(userData)
    )
  }
}
```

A resolver function receives four arguments:

- `obj` The previous object, which for a field on the root Query type is often not used.
- `args` The arguments provided to the field in the GraphQL query.
- `context` A value which is provided to every resolver and holds important contextual information like the currently logged in user, or access to a database.
- `info` A value which holds field-specific information relevant to the current query as well as the schema details.

### Asynchronous resolvers

Let's take a closer look at what's happening in this resolver function.

```javascript
human(obj, args, context, info) {
  return context.db.loadHumanByID(args.id).then(
    userData => new Human(userData)
  )
}
```

The `context` is used to provide access to a database which is used to load the data for a user by the `id` provided as an argument in the GraphQL query. Since loading from a database is an asynchronous operation, this returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). When the database returns, we can construct and return a new `Human` object.

Notice that while the resolver function needs to be aware of Promises, the GraphQL query does not. It simply expects the `human` field to return something which it can then ask the `name` of. During execution, GraphQL will wait for Promises, Futures, and Tasks to complete before continuing and will do so with optimal concurrency.

### Trivial resolvers

Now that a `Human` object is available, GraphQL execution can continue with the fields requested on it.

```javascript
Human: {
  name(obj, args, context, info) {
    return obj.name
  }
}
```

A GraphQL server is powered by a type system which is used to determine what to do next. Even before the `human` field returns anything, GraphQL knows that the next step will be to resolve fields on the `Human` type since the type system tells it that the `human` field will return a `Human`.

Resolving the name in this case is very straight-forward. The name resolver function is called and the `obj` argument is the `new Human` object returned from the previous field. In this case, we expect that Human object to have a `name` property which we can read and return directly.

In fact, many GraphQL libraries will let you omit resolvers this simple and will just assume that if a resolver isn't provided for a field, that a property of the same name should be read and returned.

### Scalar coercion

While the `name` field is being resolved, the `appearsIn` and `starships` fields can be resolved concurrently. The `appearsIn` field could also have a trivial resolver, but let's take a closer look:

```javascript
Human: {
  appearsIn(obj) {
    return obj.appearsIn // returns [ 4, 5, 6 ]
  }
}
```

Notice that our type system claims `appearsIn` will return `Enum` values with known values, however this function is returning numbers! Indeed if we look up at the result we'll see that the appropriate `Enum` values are being returned. What's going on?

This is an example of scalar coercion. The type system knows what to expect and will convert the values returned by a resolver function into something that upholds the API contract. In this case, there may be an `Enum` defined on our server which uses numbers like `4`, `5`, and `6` internally, but represents them as `Enum` values in the GraphQL type system.

### List resolvers

We've already seen a bit of what happens when a field returns a list of things with the `appearsIn` field above. It returned a _list_ of enum values, and since that's what the type system expected, each item in the list was coerced to the appropriate enum value. What happens when the `starships` field is resolved?

```javascript
Human: {
  starships(obj, args, context, info) {
    return obj.starshipIDs.map(
      id => context.db.loadStarshipByID(id).then(
        shipData => new Starship(shipData)
      )
    )
  }
}
```

The resolver for this field is not just returning a Promise, it's returning a _list_ of Promises. The `Human` object had a list of ids of the `Starships` they piloted, but we need to go load all of those ids to get real Starship objects.

GraphQL will wait for all of these Promises concurrently before continuing, and when left with a list of objects, it will concurrently continue yet again to load the `name` field on each of these items.

Let's take one last look at the original query to see how all these resolving functions produce a result:

```graphql
// Query
{
  human(id: 1002) {
    name
    appearsIn
    starships {
      name
    }
  }
}
```

And for the result:

```javascript
{
  "data": {
    "human": {
      "name": "Han Solo",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ],
      "starships": [
        {
          "name": "Millenium Falcon"
        },
        {
          "name": "Imperial shuttle"
        }
      ]
    }
  }
}
```

## More concepts

Lets review once again the schema and how resolvers execute each field:

```graphql
type Query {
  author(id: ID!): Author
}

type Author {
  posts: [Post]
}

type Post {
  title: String
  content: String
}
```

Lets check the query we’re sending:

```graphql
query {
  author(id: "abc") {
    posts {
      title
      content
    }
  }
}
```

Every field in the query can be associated with a type:

```graphql
query: Query {
  author(id: "abc"): Author {
    posts: [Post] {
      title: String
      content: String
    }
  }
}
```

### Reusability with Fragments

They’re a collection of fields on a specific type.

If we have the following type:

```graphql
type User {
  name: String!
  age: Int!
  email: String!
  street: String!
  zipcode: String!
  city: String!
}
```

We can turn it into a fragment:

```graphql
fragment addressDetails on User {
  name
  street
  zipcode
  city
}
```

You can now write this as:

```graphql
{
  allUsers {
    ...addressDetails
  }
}
```

### Parametrizing Fields with Arguments

Lets consider these Schemas:

```graphql
type Query {
  allUsers: [User!]!
}

type User {
  name: String!
  age: Int!
}
```

We can pass an argument like:

```graphql
type Query {
  allUsers(olderThan: Int = -1): [User!]!
}
```

And the query would look like:

```graphql
{
  allUsers(olderThan: 30) {
    name
    age
  }
}
```

### Naming Query Results with Aliases

We can do:

```graphql
{
  first: User(id: "1") {
    name
  }
  second: User(id: "2") {
    name
  }
}
```

Which translates to:

```javascript
{
  "first": {
    "name": "Alice"
  },
  "second": {
    "name": "Sarah"
  }
}
```

### Variables

So far, we have been writing all of our arguments inside the query string. But in most applications, the arguments to fields will be dynamic: For example, there might be a dropdown that lets you select which Star Wars episode you are interested in, or a search field, or a set of filters.

When we start working with variables, we need to do three things:

1. Replace the static value in the query with `$variableName`
2. Declare `$variableName` as one of the variables accepted by the query
3. Pass `variableName: value` in the separate, transport-specific (usually JSON) variables dictionary

```graphql
query HeroNameAndFriends($episode: Episode) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```

Were the variable is:

```javascript
{
  "episode": "JEDI"
}
```

And we get as result:

```javascript
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```

Now, in our client code, we can simply pass a different variable rather than needing to construct an entirely new query. This is also in general a good practice for denoting which arguments in our query are expected to be dynamic - we should never be doing string interpolation to construct queries from user-supplied values.

We can also add a default variable:

```graphql
query HeroNameAndFriends($episode: Episode = JEDI) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```

When default values are provided for all variables, you can call the query without passing any variables. If any variables are passed as part of the variables dictionary, they will override the defaults.

## Conclusion

Today we learned about the theory related to `GraphQL`, a very interesting alternative to `REST` that has many advantages but it forces the client and server to work with `GraphQL` which might be something traditional backend developers with experience with `REST` won't accept.

If you have a role as a fullstack developer in charge of the front and back of the application, then using `GraphQL` is a fantastic option.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
