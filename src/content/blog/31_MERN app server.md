---
title: "Social Media App using MERN - Server"
description: "In these series of posts we will learn how to build a social network from scratch, we can login using JSON web token, create a user profile, edit it, delete it, post comments in a feed, delete your comments, you can comment other people comments. This will provide for a complete experience of the stack."
category: ["backend", "node", "express", "mongodb", "nosql"]
pubDate: "2023-12-03"
published: true
---

This is the link of the [project](https://github.com/Radinax/mern-social-network) we will be using to learn about this stack.

MERN stack is:

> MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas

> Express.js, or simply Express, is a back end web application framework for Node.js, released as free and open-source software under the MIT License. It is designed for building web applications and APIs. It has been called the de facto standard server framework for Node.js.

> React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications

> Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.

This is one of the most popular stacks out there, we will use this to create this Social Media App.

## Folder Structure

```text
├── config
│   ├── key.js
│   └── passport.js
├── models
│   ├── Posts.js
│   ├── Profile.js
│   └── User.js
├── routes
|   └── api
|       ├── user.js
|       ├── profile.js
|       └── post.js
├── validation
│   ├── education.js
│   ├── experience.js
|   ├── isEmpty.js
|   ├── login.js
|   ├── posts.js
|   ├── profile.js
│   └── register.js
└── server.js
```

## Setup MongoDB with mLab

[mLab](https://mlab.com/) it’s a Database as a Service for MongoDB, we can use the free account for this project. Now signup or login, click

- AWS free sandbox account and we choose a region. Then we can assign it a name and we create it.
- Click on the DB name, now create a database user for this project and register your name (different from your mLab).
- Take the string given to you and use it in your app.

## Setup App

- `npm init`.
- `yarn add express mongoose passport passport-jwt jsonwebtoken body-parser bcryptjs validator gravitar`
- `yarn add —dev nodemon`
- Create `server.js` file
- Configure `Nodemon` in `package.json`

```javascript
"scripts": {
  "server": "nodemon src/index.js"
}
```

Let’s create our `server.js` file, we import `express` and use it to instantiate the GET request and the port.

```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
```

Do `yarn server` to run your app.

## Connect our server to Mongo

Inside `config/key.js`

```javascript
module.exports = {
  mongoURI:
    "mongodb://Adrian:AdrianPassword123@ds157956.mlab.com:57956/socialnetwork",
};
```

Now in your `server.js file` we connect our express app with MongoDB:

```javascript
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// DB CONFIG
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
```

Run yarn server and it will show `MongoDB connected`

## Building our resources

```javascript
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body  Parser middleware
// bodyParser let us handle JSON data in the body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DB CONFIG
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello"));

// Use Routes
// These are our endpoints
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
```

Now on our `routes/api/users.js` we configure the other parts of the EP, in this case when we go to `https://localhost:5000/api/users/tests` we will get as a result **Users works**.

```javascript
const express = require("express");
const router = express.Router();

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get("/tests", (req, res) =>
  res.json({
    msg: "Users works",
  })
);

module.exports = router;
```

Now on our profile.js

```javascript
const express = require("express");
const router = express.Router();

// @route  GET api/profile/test
// @desc   Tests profile route
// @access Public
router.get("/tests", (req, res) =>
  res.json({
    msg: "Profile works",
  })
);

module.exports = router;
```

Now on our post.js

```javascript
const express = require("express");
const router = express.Router();

// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get("/tests", (req, res) =>
  res.json({
    msg: "Post works",
  })
);

module.exports = router;
```

## Summary so far

- `npm init`.
- `yarn add express mongoose passport passport-jwt jsonwebtoken body-parser bcryptjs validator gravitar`
- `yarn add —dev nodemon`
- Create `server.js` file
- Configure `Nodemon` in `package.json` like in our previous posts.
- Inside our `server.js` we connect our `mongoDB `with our express app using our key inside `config/keys` file which we get from `mongoDB`.
- Inside our `routes/api` we add all the endpoints we will use and test that they work.
- In our server file we request the exported values and we assign each a endpoint which we will use to provide data as service.

## Authentication

In this section we will continue with the next part of our application which is authentication, which we covered using `Prisma` and `Apollo` with `GraphQL` using the same libraries, now we will apply the same knowledge with `REST`.

### Create users model

We will create a schema (similar to graphQL):

> A database schema is the skeleton structure that represents the logical view of the entire database. It defines how the data is organized and how the relations among them are associated. It formulates all the constraints that are to be applied on the data.

- `models/User.js`

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
```

### Using POSTMAN

This is a very valuable tool for testing your EPs provided to the client or service that wants to consume your API.

- Go to https://www.postman.com/ and download the app.
- Now on the GET input put the URL you want to test, add `http://localhost:5000/api/users/test`, click send and see the result you get!

### Registration

Our next step is to add registration.

In `routes/api/users.js`

```javascript
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("brypt");

// Load User model
const User = require("../../models/User");

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users works",
  })
);

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: "Email alredy exists",
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });
      // new model Name
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
```

Now go to POSTMAN and make a POST request to register the user:

URL: `http://localhost:5000/api/users/test`.

BODY:

| KEY      | VALUE             |
| -------- | ----------------- |
| name     | Jon               |
| email    | `jhondoe@doe.com` |
| password | 123456            |

### Login

Once the email and password are verified, they get as response a TOKEN, which we can use to access a protected route, for this we will use passport-jwt.

```javascript
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("brypt");

// Load User model
const User = require("../../models/User");

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users works",
  })
);

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: "Email alredy exists",
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });
      // new model Name
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route  GET api/users/login
// @desc   Login User / Returning JWT Token
// @access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check for user
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        res.json({ msg: "Success" });
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
```

If we test it in POSTMAN forcing an error:

| KEY      | VALUE                  |
| -------- | ---------------------- |
| email    | `jhondoeERROR@doe.com` |
| password | 123456                 |

It would return:

```javascript
{
    "email": "User not found"
}
```

If we add the correct credentials:

| KEY      | VALUE             |
| -------- | ----------------- |
| email    | `jhondoe@doe.com` |
| password | 123456            |

It would return:

```javascript
{
    "msg": "Success"
}
```

### Handling TOKENS

Inside in our config/key.js we need to add a secret key in order to use JWT:

```javascript
module.exports = {
  mongoURI:
    "mongodb://Adrian:AdrianPassword123@ds157956.mlab.com:57956/socialnetwork",
  secretOrKey: "secret",
};
```

Now in our user API:

```javascript
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("brypt");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load User model
const User = require("../../models/User");

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users works",
  })
);

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: "Email alredy exists",
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });
      // new model Name
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route  GET api/users/login
// @desc   Login User / Returning JWT Token
// @access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // user is from DB
    // Check for user
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        };

        // Sign Token
        // Takes a Payload, key
        // It expires after certain time
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3600,
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
```

Now if we POST again we get a message with success and the token.

### Connecting PASSPORT

Inside server.js we add passport for authentication.

```javascript
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body  Parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DB CONFIG
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Passport middelware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
```

Now create the config file:

```javascript
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
// This 'users' comes from the string in the model
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // This payload is the one we used in User Match
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
```

Now we need to create a protected route inside our user API:

```javascript
const passport = require("passport");

// @route  GET api/users/current
// @desc   Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);
```

Now to test everything works perform a POST request to login:

| KEY      | VALUE             |
| -------- | ----------------- |
| email    | `jhondoe@doe.com` |
| password | 123456            |

Which returns:

```javascript
{
    "success": true,
    "token": "Bearer [token]"
}
```

With the token perform a GET request to the endpoint `http://localhost:5000/api/users/current` with the token in the headers getting as result:

```javascript
{
    "id": "UUID",
    "name": "Jon",
    "email": "jondoe@doe.com"
}
```

### Summary

- We perform authentication with `JWT` and `Tokens`.
- When user login we get a token which we use with a GET request to obtain the data we need.
- If we try this without token we get “UNAUTHORIZED” message.
- We created our Schema file.
- In our users API file we configured our endpoints, we import the schema (model), validate the email and then use `bcrypt` to hash the password.
- With the login EP we check if the email is valid and then we compare the password, once we got it we get a token.
- With said token we use passport, initialize it in our server file, then configure the authentication using the token in our configuration file, finally we use `passport.authenticate` to use that token to obtain the information we need after we login.

## Validations

### Validating name

Inside `validation/register.js`

```javascript
const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must between 2 and 30 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
```

Inside `validation/isEmpty.js`

```javascript
const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

module.exports = isEmpty;
```

In `routes/api/users` change the following lines:

```javascript
// Load Input Validation
const validateRegisterInput = require("../../validation/register");

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email alredy exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });
      // new model Name
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});
```

To test send a POST request to `http://localhost:5000/api/users/register` with a name value of `A`:

```javascript
{
    "name": "Name must be between 2 and 30 characters",
}
```

Our validation works!

### Validation for email and login

Inside validation/register.js

```javascript
const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.name = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
```

Now lets go for login:

```javascript
const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
```

Import this inside users.js

```javascript
// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        };

        // Sign Token
        // Takes a Payload, key
        // It expires after certain time
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3600,
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});
```

Now lets check our POSTMAN to see if everything works correctly and in the right order of validation.

### Summary

- We did validations for name, email and passwords, we created two files called login and register inside validation, to make the logic for validating the respective information.
- For doing the logic we’re using the library [validator](https://github.com/validatorjs/validator.js) which comes with several helpers to make it easier to validate the data we need.
- Then we import this inside our API for users and show if there is any error.

## Profiles

## Profiles Schema

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    // Associates user with id
    type: Sceham.Types.ObjectId,
    // This is our collection in DB
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  company: {
    type: String,
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String,
  },
  githubUsername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    },
    education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldOfStudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    linkedin: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Profile = mongoose.model('profile', ProfileScehma)
```

Now we created our schema for Profiles!

## Profile Rute

```javascript
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile Model
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");

// @route  GET api/profile/test
// @desc   Tests profile route
// @access Public
router.get("/tests", (req, res) =>
  res.json({
    msg: "Profile works",
  })
);

// @route  GET api/profile
// @desc   Get current users profile
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    // The model alredy match with the ID
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.noProfile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

module.exports = router;
```

If we test this it will only show ‘There is no profile for this user’, so we need to create one, to be able to do that we need to login, get the token and use it for the respective GET request, once we’re logged in we can make a POST request to create out profile.

On the same file add:

```javascript
// @route  POST api/profile
// @desc   Create or Edit users profile
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubUsername)
      profileFields.githubUsername = req.body.githubUsername;

    // Skills - Split into array
    if (typeof req.body.skills !== "undefined") {
      // Its CSV we need to split it into array
      profileFields.skills = req.body.skills.split(",");
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        // UPDATE
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            errors.handle = "That handle alredy exists";
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields)
            .save()
            .then((profile) => res.json(profile));
        });
      }
    });
  }
);
```

Now that we created the route for the post request to API Profile, we need to test it, but before we need to add validations.

Inside validation/profiles.js:

```javascript
const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be between 2 and 40 characters";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid URL";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid URL";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid URL";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid URL";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
```

Now lets return to our API Profile and add these validators to our post request:

```javascript
const { errors, isValid } = validateProfileInput(req.body);

// Check validation
if (!isValid) {
  // Return any errors with 400 status
  return res.status(400).json(errors);
}
```

Now lets go to POSTMAN to test our post request by not adding anything on the fields, which returns `Unauthorized`.

Now login using the endpoint `/api/profile` by doing a GET request, which returns:

```javascript
{
    "noProfile": "There is no profile for this user"
}
```

This means we need to create the profile first by doing a POST request to `/api/profile` (remember to add the Bearer Token in your Authorization tab!):

| KEY    | VALUE               |
| ------ | ------------------- |
| handle | Jon                 |
| status | Developer           |
| skills | HTML,CSS,Javascript |

Which returns as response:

```javascript
{
    "skills": ["HTML", "CSS", "Javascript"],
    "_id": "UUID",
    "user": "UUID",
    "handle": 'Jon',
    "status": "Developer",
    "experience": {},
    "education": {},
    "date": "2021-05-09T02:12:44.6122",
    "__v": 0,
}
```

Notice the empty fields we haven’t included because they’re not required. But remember we can update our profile, so if send another POST request to this same URL we can add new fields.

Great! Now if we go to `api/profile` we get our updated profile.

One last thing we need to add is a user object from our “users” collection in the database, remember this line inside models/Profile

```javascript
user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
```

This automatically adds the information from that collection into the Profile, but we need to put the respective line for it:

```javascript
Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]);
```

Now if we make a GET request to `api/profile`:

```javascript
{
    "skills": ["HTML", "CSS", "Javascript"],
    "_id": "UUID for profile",
    "user": {
       	"_id": "UUID for user",
        "name": "Jon",
        "avatar": "gravatar link"
    },
    "handle": 'Jon',
    "status": "Developer",
    "experience": {},
    "education": {},
    "date": "2021-05-09T02:12:44.6122",
    "__v": 0,
}
```

We get that the user key was populated using as reference in the schema, the database collection called “users” and we fetched the name and avatar into it.

### Get profile by id

Inside our same `routes/api/profile` file add:

```javascript
// @route  GET api/profile/all
// @desc   Get all profiles
// @access Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noProfile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch((err) => res.status(404).json({ profile: "There are no profiles" }));
});

// @route  GET api/profile/handle/:handle
// @desc   Get profile by handle
// @access Public
route.get("/handle/:handle", (req, res) => {
  const errors = {};
  // params is :handle, its whatever is on the url
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noProfile = "There is no profile for this user";
        rest.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public
route.get("/user/:user_id", (req, res) => {
  const errors = {};
  // params is :handle, its whatever is on the url
  Profile.findOne({ handle: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noProfile = "There is no profile for this user";
        rest.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});
```

Now test this going to `api/profile/handle/:handle` where in my case `:handle` was `Jon`, getting the profile we created before, now by handle. This is the public profile.

You can also check by ID, go to `api/profile/user_id/:user_id` where `:user_id` is obtained from the profile which is a bunch of random characters.

And you can check `api/profile/all` to obtain all the profiles as an array of objects.

### Summary

- We added the profiles endpoint, we have the private route where we can create/update and the public routes which can be accessed by anyone.
- For private routes we use passport adding the`jwt` option.
- In the model we used `type: Schema.Types.ObjectId` to populate inside our profile routes API, specifically to add the user element which comes directly from the database into the Profile collection making a relation between them.
- We worked on the validation of the inputs, handling the errors in a consistent way giving the respective HTTP status.

## Comments and Likes

### Post model

Inside models/Post.js, we want to add the avatar and the name. The idea is that if the user deletes his profile, we don’t want their posts to be deleted as well. We want each like to be linked with the user as well so they don’t hit the like button more than once.

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = newSchema({
  user: {
    type: Schema.Types.ObjectId,
    refs: "users",
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        refs: "users",
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        refs: "users",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model("post", PostSchema);
```

We have user associated with posts, we have likes and comments.

### Post routes API

Inside `routes/api/posts.js`

```javascript
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post model
const Post = require("../../models/Post");

// Validation
const validatePostInput = require("../../validation/post");

// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get("/tests", (req, res) =>
  res.json({
    msg: "Post works",
  })
);

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost.save().then((post) => res.json(post));
  }
);

module.exports = router;
```

For our validation create inside `validation/post.js`

```javascript
const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 300 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
```

To test it we login as usual in `api/user/login` with your email and password, take the token and then go to `api/posts` put it in the headers and add a text value in the body and we get our post back.

Now we need to set the routes for all comments and to single out a specific comment.

### GET all posts

Inside the same `routes/api/posts`:

```javascript
// @route  GET api/posts
// @desc   GET posts
// @access Public
router.get('/', (req, res) => {
  Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(noPostFound:'No posts found'))
})
```

Since its public you don’t need to login, so make a GET request to `api/posts` to obtain all the posts.

### GET single post

```javascript
// @route  GET api/posts/:id
// @desc   GET post by id
// @access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json(noPostFound:'No post found with that id'))
})
```

Grab an id from one of the posts and add it to `api/post/:id` where `:id` is the value you copied.

### DELETE post

This is going to be private now:

```javascript
// Profile model
const Profile = require("../../models/Profile");
// @route  DELETE api/posts/:id
// @desc   Delete post
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ noAuthorize: "User not authorized" });
            // 401 is non authorized
          }

          // Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch((err) =>
          res.status(404).json({ postNotFound: "No post found" })
        );
    });
  }
);
```

To try this delete the post you created the last time, so take that id, make a DELETE request in `api/posts/:id`, remember to login!

Now in GET `api/posts` check to see if it was deleted.

### Likes route

For this route we will make it possible for the user to like a post and remove the like if he wants.

```javascript
// @route  POST api/posts/like/:id
// @desc   Like post
// @access Private
router.delete(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alredyLiked: "User alredy liked this post" });
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ postNotFound: "No post found" })
        );
    });
  }
);
```

Test it in `api/posts/like/:id`, where :`id` is the one from any post. The result will be an array of objects with each like having its own ID and user ID

### Remove like

```javascript
// @route  POST api/posts/unlike/:id
// @desc   Unlike post
// @access Private
router.delete(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notLiked: "You have not yet like this post" });
          }

          // Get remove index
          const removeIndex = post.likes
            .map((item) => item.user.String())
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          // Save
          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ postNotFound: "No post found" })
        );
    });
  }
);
```

Now go to `api/posts/unlike/:id` where `:id` is the post id.

### Add comments

We can use the same posts validation here since we only need to validate the text.

In the same `routes/api/posts`

```javascript
// @route  POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        const { errors, isValid } = validatePostInput(req.body);

        // Check Validation
        if (!isValid) {
          // if any errors, send 400 with errors object
          return res.status(400).json(errors);
        }

        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postNotFound: "No post found" }));
  }
);
```

Now go to `api/posts/comment/:id` where `:id` is the post id, add the token to headers and in the body add a text field.

### Delete comment

```javascript
// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Remove comment from post
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      // Check to see if the comment exists
      if(posts.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({commentNotExist: 'Comment does not exist'})
      }

      // Get remove index
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id)

      // Splice comment out of array
      post.comments.splice(removeIndex, 1)

      post.save().then(post -> res.json(post))
    })
    .catch(err => res.status(404).json({postNotFound: 'No post found'}))
})
```

Now go to to `api/posts/comment/:id/:comment_id` where `:id` is the post id and the other id is the comment one, then perform the DELETE request.

### Summary

- We added the POST models and routes.
- User can create posts now with its respective validation.
- User can GET all posts and a single post by id.
- User can delete its own posts.
- User can like/unlike posts.
- User can add/remove comments

## ## Complete Summary for server

For this particular section I want to take the time to make a summary and a step by step instruction manual on how to do certain things we did when we built our server, they’re patterns we will be using for our whole career and this post can be useful to people learning the stack.

### Folder Structure

```bash
├── config
│   ├── key.js
│   └── passport.js
├── models
│   ├── Posts.js
│   ├── Profile.js
│   └── User.js
├── routes
|   └── api
|       ├── user.js
|       ├── profile.js
|       └── post.js
├── validation
│   ├── education.js
│   ├── experience.js
|   ├── isEmpty.js
|   ├── login.js
|   ├── posts.js
|   ├── profile.js
│   └── register.js
└── server.js
```

### Configuration folder

The config folder has our Mongo URI key generated through mLabs which let us connect our app with mongoDB using:

```javascript
// DB CONFIG
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
```

We also have the passport configuration which let us handle our authentication. This is rather mechanical as well:

```javascript
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
// This 'users' comes from the string in the model
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // This payload is the one we used in User Match
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
```

Now everytime we need to login or use a private route we can use passport like:

```javascript
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);
```

This way we can use a token from our login.

### Models folder

Models are Schemas which basically defines how data is organized and the relationship between them. Once defined it’s imported into the API of each route.

Lets take Post as an example, a post will have the `user_id` (info from the database), `text`, `name`, `avatar`, `likes`, `comments` and the current `date`.

Where comment and likes are their own little world, the first is an array of objects where each object (comment) has a `user_id`, `text`, `avatar`, `name` and current `date`. While likes is just the `user_id`.

In this case comment and like are children's of post, each with their own ID generated in the database, this way we can target them easier when we want to delete them.

You can check the examples [here](https://github.com/Radinax/mern-social-network/tree/master/models).

### Routes

It defines how exactly each Endpoint will behave. Let’s explore each route.

#### Users

For Users we can register, login and `GET` our profile, the first two are public routes and the next one is private for when we’re logged in.

For **register** it’s a `POST` request so we need to validate our inputs, in our case `name`, `email`, `password`, `confirm password`, `length of name`, and if a input is required, while confirming both passwords are the same. Once this is done we take the requested data and add a new User model where we define the `name`, `email`, `avatar` and `password`, then we hash the password and save it in the database.

For **login** it’s also a `POST` request, we need to validate the inputs, in this case `email` and `password`, compare the password we input with the one in the database and return a `JWT` token which we use for the user private routes.

For **current profile** it’s a `GET` request where we use passport to authenticate and get as response our `user_id`, `name` and `email`.

#### Profile

For profiles, a logged in user can look at its own profile (which is empty if it’s a new account), we can create/edit/delete profiles, add/remove experience, education, while any user can check public profiles and individual ones as well with limited information.

For **profiles** we can check them when we’re logged in (we need to authenticate with passport), we can populate it using another collection, in this case user, and obtain the name and avatar, with that we can get the profile. For creating one there are several fields like `handle`, `company`, `website`, `location`, `bio`, `status`, `githubUsername`, social media (`youtube`, `instagram`, `twitter`, `facebook`, `linkedin`), once they’re all validated we can update one or create a new Profile. For delete we need to authenticate and find the Profile by ID and use the mongoose method to remove.

For **education and experience** which are children of profile, we need to be authenticated with passport and just send a new education/experience with the proper validation of each input. For deleting we need to get the experience/education ID of the profile, which is generated in the database, once we get it we need to use Javascript to remove it from the array of objects.

### Posts

In the case of Posts we need both the Post and Profile model. We can make posts, which can have comments and one like for each user (including its own), a public user can see all posts including individual ones, but only a logged in user can make posts, comments or like a post.

For **Posting** user needs to be authenticated with passport and validate each input which is basically the text, we send the text, `name`, `avatar` and `user_id` and save this in a new collection. For deleting a post we need to find the profile ID and then the post ID, then we can remove it.

For **comments** we need to authenticate using passport, then get the `post_id`, make the respective validations and post a new comment which will contain a `text`, `name`, `avatar` and the `user_id`, you add this to the comments array inside the Post using unshift or push. For removing a comment we need to handle two `params`, first we authenticate, then find the `post_id` using the first `param`, then check if the comment inside post exists, once we know it does, we can then use the second `param` to remove it from the array of objects (**Post**)

For **likes** we need to authenticate with passport, then get the Profile of the user using its `user_id` and then get the `post_id` so we can add an object (like) to the likes array, which is a children of post, same as comments. For removing a like it’s the same thing, except we remove the like from the array using Javascript.

## Conclusion

Today we learned how to create a server based on Node, Express and MongoDB! This is a social media app, where a user can register/login, then he's able to create a profile, make comments, likes and dislikes.

See you on the next post.

Sincerely,

**End. Adrian Beria**
