---
title: "[Roadmap_Node] 10_Authentication and Authorization"
description: "Let us talk about the most famous Node framework, express js, why its so popular and what problems does it solve"
category: ["node"]
pubDate: "2024-04-07T10:00:00-04:00"
published: true
---

## Table of content

# Introduction

In Node.js applications, ensuring the security of your data and functionality is crucial. Authentication and Authorization are fundamental concepts that form the backbone of this security. Here's a breakdown of Authentication and Authorization in Node.js:

**Authentication:**

- The process of verifying a user's identity. It answers the question: "Who are you?"
- In Node.js applications, this typically involves validating user credentials (e.g., username and password) against a data source like a database.
- Upon successful authentication, a token or session might be generated to identify the user in subsequent requests.

**Authorization:**

- The process of determining what a user is allowed to do within the application. It answers the question: "What can you do?"
- Based on the user's identity (roles, permissions), the application decides whether to grant access to specific resources or functionalities.

**Importance of Authentication and Authorization:**

- **Protects Sensitive Data:** Ensures only authorized users can access sensitive information or actions.
- **Prevents Unauthorized Access:** Mitigates the risk of unauthorized users tampering with data or compromising system integrity.
- **Improved User Experience:** Provides a seamless experience for authenticated users while restricting access for unauthorized users.

**Common Authentication Mechanisms in Node.js:**

- **Username and Password:** A traditional approach where users provide credentials for verification.
- **Social Logins:** Users can log in using existing accounts from social media providers (e.g., Google, Facebook).
- **Token-Based Authentication:** JSON Web Tokens (JWT) are a popular option where a signed token is used to identify users after initial login.

**Authorization Strategies in Node.js:**

- **Role-Based Access Control (RBAC):** Users are assigned roles with predefined permissions, and access is granted based on those roles.
- **Attribute-Based Access Control (ABAC):** Access decisions are based on various attributes, such as user role, resource type, and specific actions being performed.

**Implementing Authentication and Authorization:**

- **Libraries and Frameworks:** Popular libraries like Passport.js or frameworks like Express.js with middleware can simplify authentication and authorization tasks.
- **Data Storage:** User credentials and roles are typically stored securely in a database (e.g., hashed passwords).
- **Session Management:** Sessions or tokens are used to maintain user state across requests.

**Best Practices:**

- **Secure Password Storage:** Always hash and salt user passwords to prevent storing them in plain text.
- **Regular Security Audits:** Conduct regular security checks to identify and address potential vulnerabilities.
- **Input Validation:** Sanitize user input to prevent security vulnerabilities like SQL injection attacks.

# JWT

JWT, standing for JSON Web Token, is a popular method for secure authentication in Node.js applications. It's an open standard (RFC 7519) that defines a compact and self-contained way to securely transmit information between parties as a JSON object.

Here's a breakdown of JWT in Node.js:

**Components of a JWT:**

- **Header:** Contains information about the token type (JWT) and the signing algorithm used (e.g., HMAC, RSA).
- **Payload:** The most crucial part, containing claims (data) about the user. This data is typically in JSON format and might include user ID, username, roles, or any other relevant information.
- **Signature:** Ensures the integrity and authenticity of the token. It's created by signing the header and payload with a secret key known only to the server.

**How JWT Works in Node.js:**

1. **Login Process:**

   - User provides credentials (username/password) to the Node.js server.
   - Server authenticates the user against a data source (e.g., database).
   - Upon successful authentication, the server creates a JWT payload containing user information.

2. **JWT Signing:**

   - The server signs the payload with a secret key, generating the JWT signature.

3. **Sending the JWT:**

   - The server sends the generated JWT back to the client (usually stored in browser local storage or cookies).

4. **Client-side Storage:**

   - The client stores the JWT for subsequent requests to the server.

5. **Authorization with JWT:**

   - With every request to a protected resource, the client includes the JWT in the authorization header.

6. **Server-side Verification:**
   - The server receives the JWT and verifies its signature using the same secret key.
   - If the signature is valid, the server extracts the user information from the payload and grants access to the resource based on the user's claims.

**Benefits of Using JWT:**

- **Stateless Authentication:** The server doesn't need to maintain session state on the server side, reducing resource usage and improving scalability.
- **Security:** JWTs are signed, making them tamper-evident.
- **Flexibility:** The payload can carry various user information depending on your application's needs.
- **Cross-Origin Resource Sharing (CORS) Friendly:** JWTs can be easily passed between different origins, making them suitable for microservices architectures.

**Popular JWT Libraries for Node.js:**

- **jsonwebtoken:** A widely used library for creating, signing, and verifying JWTs.

**In conclusion, JWT is a valuable tool for implementing secure authentication in Node.js applications. It offers a standardized, lightweight, and flexible approach to user authentication and authorization.**

# Passport.js Middleware

Passport.js is a popular middleware for Node.js applications that simplifies authentication by providing a unified API for various authentication strategies. It acts as a bridge between your Node.js application and different authentication providers, allowing you to integrate various login methods without reinventing the wheel for each one.

**Key Concepts of Passport.js:**

- **Strategies:** These are modules that define how to authenticate users using specific methods (e.g., username/password, social logins, token-based authentication). Passport.js supports numerous built-in strategies and allows for creating custom ones.
- **Middleware:** Passport.js functions as middleware in your Node.js application's request-response cycle. It intercepts incoming requests, handles authentication logic based on the chosen strategy, and makes user information available to your application code.
- **Sessions:** Passport.js can integrate with session management modules like Express.js sessions to maintain user state across requests.
- **User Serialization:** Passport.js provides mechanisms for serializing and deserializing user objects into sessions, allowing you to store and retrieve user data securely.

**Benefits of Using Passport.js:**

- **Simplified Authentication:** Abstracts away the complexities of different authentication mechanisms, providing a consistent API.
- **Flexibility:** Supports a wide range of authentication strategies and allows for customization.
- **Integration with Popular Frameworks:** Works seamlessly with popular Node.js frameworks like Express.js.
- **Community and Ecosystem:** Large community and ecosystem of plugins and strategies for various use cases.

**How Passport.js Middleware Works:**

1. **Define Strategies:** Choose the authentication strategies you want to support in your application (e.g., local login, social login).
2. **Initialize Passport:** Initialize Passport.js in your application and configure the chosen strategies.
3. **Middleware Integration:** Integrate Passport.js middleware into your route handlers to handle authentication logic.
4. **Authentication Flow:** When a user attempts to access a protected route, Passport.js intercepts the request and performs authentication based on the chosen strategy.
5. **Successful Authentication:** Upon successful authentication, Passport.js typically stores user information in the session or makes it accessible via the request object.
6. **Authorization:** Based on the retrieved user information, your application can then make authorization decisions (e.g., granting access to protected resources).

**Example (Using Passport.js with Local Login):**

Here's a simplified example demonstrating Passport.js with a local username/password login strategy:

```javascript
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Configure local strategy with your user verification logic
passport.use(
  new LocalStrategy((username, password, done) => {
    // Replace with your logic to verify username and password against a database
    if (username === "john" && password === "secret") {
      return done(null, { username: "john" }); // Simulate successful authentication
    } else {
      return done(null, false); // Simulate failed authentication
    }
  })
);

// Serialize and deserialize user objects for sessions (optional)
passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  // Replace with logic to retrieve user data from a database based on username
  done(null, { username });
});

// Middleware to protect routes
const isAuthenticated = passport.authenticate("local", { session: true }); // Replace with your strategy

app.get("/protected-resource", isAuthenticated, (req, res) => {
  // User is authenticated, grant access to the resource
  res.send("Welcome, authorized user!");
});
```

**In conclusion, Passport.js is a powerful middleware for managing authentication in Node.js applications. It streamlines the process, improves maintainability, and offers flexibility for integrating various authentication methods.**

# OAuth and OAuth2

OAuth and OAuth2 are authorization frameworks that enable users to sign in to your application using their existing accounts from other service providers (like Google, Facebook, GitHub). This eliminates the need for users to create separate accounts for your application and simplifies the login process.

Here's a breakdown of OAuth and OAuth2, along with an example implementation in Node.js:

**1. OAuth vs. OAuth2:**

- **OAuth (Older Protocol):** The original OAuth protocol had some security vulnerabilities and complexities. It's generally not recommended for new applications.
- **OAuth2 (Current Standard):** The successor to OAuth, addressing security concerns and offering a more streamlined authorization flow.

**2. Core Concepts of OAuth2:**

- **Resource Owner:** The user who owns the account with the service provider (e.g., Google account owner).
- **Client (Your Application):** The application requesting access to the user's data on the service provider.
- **Authorization Server:** The server responsible for authenticating the resource owner and issuing authorization tokens.
- **Resource Server:** The server that holds the user's protected resources (e.g., user profile data).

**3. OAuth2 Authorization Flow:**

The OAuth2 authorization flow typically involves these steps:

1. **User Redirection:** The user attempts to log in to your application. Your application redirects the user to the authorization server's login page.
2. **User Authentication:** The user logs in with their credentials on the authorization server.
3. **Authorization Grant:** If successful, the authorization server presents the user with a consent screen to grant your application access to specific data.
4. **Authorization Code Grant (Common Flow):** Upon user consent, the authorization server redirects the user back to your application with an authorization code in the URL.
5. **Token Request:** Your application sends a request to the authorization server, exchanging the authorization code for an access token and (optionally) a refresh token.
6. **Access Token Usage:** Your application uses the access token to make authorized requests to the resource server to access the user's protected data.
7. **Refresh Token (Optional):** If a refresh token is obtained, it can be used to acquire new access tokens when the original access token expires.

**4. Implementing OAuth2 in Node.js:**

Here's a simplified example using `node-oauth2-server` to demonstrate a basic OAuth2 login flow with Google:

**Node.js Setup:**

```bash
npm init -y
npm install express node-oauth2-server
```

**Server Code (server.js):**

```javascript
const express = require("express");
const OAuth2Server = require("node-oauth2-server");

const app = express();
const oauth2Server = new OAuth2Server({
  // Configure your authorization server details (client ID, secret, etc.)
  authorizationCodeGrant: {
    type: "oauth2-server-fb", // Replace with 'oauth2-server-google' for Google
    callback: "http://localhost:3000/callback",
  },
});

// Handle login request (redirect to authorization server)
app.get("/login", (req, res) => {
  const authorizationUri = oauth2Server.authorizeCodeGrant({
    responseType: "code",
    scope: ["profile", "email"], // Request access to specific user data
    redirectUri: "http://localhost:3000/callback",
    clientId: "YOUR_CLIENT_ID", // Replace with your Google client ID
  });

  res.redirect(authorizationUri);
});

// Handle authorization code callback
app.get("/callback", async (req, res) => {
  try {
    const token = await oauth2Server.exchangeAuthorizationCode(req.query.code);
    // Use the access token to access user data from the resource server (Google)

    res.send("You have successfully logged in!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Login failed!");
  }
});

app.listen(3000, () => console.log("Server listening on port 3000"));
```

**Important Notes:**

- Replace placeholders like `YOUR_CLIENT_ID` with your actual credentials obtained by registering your application with the service provider (e.g., Google).
- This is a very basic example. In a real application, you would need to handle user data retrieval from the resource server using the access token and implement proper security measures.

# Conclusion

We were able to learn about auth, it can be a bit tricky to understand and this post was mostly focused on a conceptual level with real life examples on how it looks. This is another important step to understand backend development as a whole.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
