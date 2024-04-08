---
title: "End-to-End (E2E) testing with Cypress"
description: "We will start learning how to test our applications with Cypress, this is a end-to-end testing framework for web test automation. We use this to test the application as a whole, instead of isolated components (cypress can do it, but RTL is better for unit testing), which is done using unit testing and integration testing when you want to make multiple components and layers work together"
category: ["frontend", "test", "cypress", "end-to-end"]
pubDate: "2023-11-27"
published: true
---

> End-to-end testing is a technique that tests the entire software product from beginning to end to ensure the application flow behaves as expected. It defines the product's system dependencies and ensures all integrated pieces work together as expected.

> Cypress is **an end-to-end testing framework for web test automation**. It enables front-end developers and test automation engineers to write automated web tests in JavaScript, the main language used for developing websites. The use of JavaScript makes Cypress automation especially attractive to a developer audience.

## Features

Cypress comes fully baked, batteries included. Here is a list of things it can do that no other testing framework can:

- **Time Travel:** Cypress takes snapshots as your tests run. Hover over commands in the [Command Log](https://docs.cypress.io/guides/core-concepts/test-runner#Command-Log) to see exactly what happened at each step.
- **Debuggability:** Stop guessing why your tests are failing. [Debug directly](https://docs.cypress.io/guides/guides/debugging) from familiar tools like Developer Tools. Our readable errors and stack traces make debugging lightning fast.
- **Automatic Waiting:** Never add waits or sleeps to your tests. Cypress [automatically waits](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Cypress-is-Not-Like-jQuery) for commands and assertions before moving on. No more async hell.
- **Spies, Stubs, and Clocks:** Verify and [control the behavior](https://docs.cypress.io/guides/guides/stubs-spies-and-clocks) of functions, server responses, or timers. The same functionality you love from unit testing is right at your fingertips.
- **Network Traffic Control:** Easily [control, stub, and test edge cases](https://docs.cypress.io/guides/guides/network-requests) without involving your server. You can stub network traffic however you like.
- **Consistent Results:** Our architecture doesn’t use Selenium or WebDriver. Say hello to fast, consistent and reliable tests that are flake-free.
- **Screenshots and Videos:** View screenshots taken automatically on failure, or videos of your entire test suite when run from the CLI.
- **Cross browser Testing:** Run tests within Firefox and Chrome-family browsers (including Edge and Electron) locally and [optimally in a Continuous Integration pipeline](https://docs.cypress.io/guides/guides/cross-browser-testing).

## Installing and configurations

We start by installing cypress `npm install cypress --save-dev` and `npm install eslint-plugin-cypress -D`. Inside our `package.json` we add these scripts:

```json
"scripts": {
  "cypress:open": "cypress open",
  "test:e2e": "cypress run"
}

"eslintConfig": {
  "env": {
    "cypress/globals": true
  },
  "extends": "react-app",
  "plugins": [
    "cypress",
  ]
}

```

We can run cypress by using `npm run cypress:open`.

Inside our `cypress.json` configuration file we can add different options:

```json
{
  "baseUrl": "http://localhost:3000"
}
```

And if we visit the URL:

```javascript
describe("The Home Page", () => {
  it("successfully loads", () => {
    cy.visit("/");
  });
});
```

Check the other available options [here](https://docs.cypress.io/guides/references/configuration).

We added the `eslint` plugin because otherwise it would complain that `cy` is not defined, which we could solve by adding as a comment `/* global cy */` at the top of the file, but this is better.

### Seeding Data

To test various page states - like an empty view, or a pagination view, you'd need to seed the server so that this state can be tested.

**While there is a lot more to this strategy, you generally have three ways to facilitate this with Cypress:**

- [`cy.exec()`](https://docs.cypress.io/api/commands/exec) - to run system commands
- [`cy.task()`](https://docs.cypress.io/api/commands/task) - to run code in Node via the [pluginsFile](https://docs.cypress.io/guides/references/configuration#Folders-Files)
- [`cy.request()`](https://docs.cypress.io/api/commands/request) - to make HTTP requests

If you're running `node.js` on your server, you might add a `before` or `beforeEach` hook that executes an `npm` task.

```javascript
describe("The Home Page", () => {
  beforeEach(() => {
    // reset and seed the database prior to every test
    cy.exec("npm run db:reset && npm run db:seed");
  });

  it("successfully loads", () => {
    cy.visit("/");
  });
});
```

Instead of just executing a system command, you may want more flexibility and could expose a series of routes only when running in a test environment.

**For instance, you could compose several requests together to tell your server exactly the state you want to create.**

```javascript
describe("The Home Page", () => {
  beforeEach(() => {
    // reset and seed the database prior to every test
    cy.exec("npm run db:reset && npm run db:seed");

    // seed a post in the DB that we control from our tests
    cy.request("POST", "/test/seed/post", {
      title: "First Post",
      authorId: 1,
      body: "...",
    });

    // seed a user in the DB that we can control from our tests
    cy.request("POST", "/test/seed/user", { name: "Jane" })
      .its("body")
      .as("currentUser");
  });

  it("successfully loads", () => {
    // this.currentUser will now point to the response
    // body of the cy.request() that we could use
    // to log in or work with in some way

    cy.visit("/");
  });
});
```

## Taking a quick look into Cypress with a real world example

Let's test a login workflow with an API:

```javascript
// loginForm
import React from "react";
import Togglable from "./Togglable.js";
import PropTypes from "prop-types";

export default function LoginForm({ handleSubmit, ...props }) {
  return (
    <Togglable buttonLabel="Show Login">
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={props.username}
            name="Username"
            placeholder="Username"
            onChange={props.handleUsernameChange}
          />
        </div>
        <div>
          <input
            type="password"
            value={props.password}
            name="Password"
            placeholder="Password"
            onChange={props.handlePasswordChange}
          />
        </div>
        <button id="form-login-button">Login</button>
      </form>
    </Togglable>
  );
}
```

And once logged in, you get access to this `noteForm` where we can create notes:

```javascript
// noteForm.js
import React, { useRef, useState } from "react";
import Togglable from "./Togglable.js";

export default function NoteForm({ addNote, handleLogout }) {
  const [newNote, setNewNote] = useState("");
  const togglableRef = useRef();

  const handleChange = (event) => {
    setNewNote(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      important: false,
    };

    addNote(noteObject);
    setNewNote("");
    togglableRef.current.toggleVisibility();
  };

  return (
    <Togglable buttonLabel="Show Create Note" ref={togglableRef}>
      <h3>Create a new note</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Write your note content"
          value={newNote}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </Togglable>
  );
}
```

Inside the cypress folder, we create inside the `integration` folder a file with the name of the workflow we want to test, so we can call it `cypress/integration/note_app.spec.js`, the `.spec` lets `cypress` know its a test file it should run. Let's go step by step into building the testing workflow.

We will start by cleaning our testing DB before starting the tests and then we send our credentials for login in:

```javascript
describe("Note App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    cy.request("POST", "http://localhost:3001/api/testing/reset");

    const user = {
      name: "Miguel",
      username: "midudev",
      password: "lamidupassword",
    };

    cy.request("POST", "http://localhost:3001/api/users", user);
  });
});
```

Now let's check what happens before we login:

```javascript
describe("Note App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    cy.request("POST", "http://localhost:3001/api/testing/reset");

    const user = {
      name: "Miguel",
      username: "midudev",
      password: "lamidupassword",
    };

    cy.request("POST", "http://localhost:3001/api/users", user);
  });

  it("frontpage can be opened", () => {
    cy.contains("Notes");
  });

  it("login form can be opened", () => {
    cy.contains("Show Login").click();
  });

  it("user can login", () => {
    cy.contains("Show Login").click();
    cy.get('[placeholder="Username"]').type("midudev");
    cy.get('[placeholder="Password"]').last().type("lamidupassword");
    cy.get("#form-login-button").click();
    cy.contains("Create a new note");
  });

  it("login fails with wrong password", () => {
    cy.contains("Show Login").click();
    cy.get('[placeholder="Username"]').type("midudev");
    cy.get('[placeholder="Password"]').last().type("password-incorrecta");
    cy.get("#form-login-button").click();

    cy.get(".error")
      .should("contain", "Wrong credentials")
      .should("have.css", "color", "rgb(255, 0, 0)")
      .should("have.css", "border-style", "solid");
  });
});
```

Let's login the user:

```javascript
describe("when logged in", () => {
  beforeEach(() => {
    /* This is the same as below but unneffective
        cy.contains('Show Login').click()
        cy.get('[placeholder="Username"]').type("jesusdev")
        cy.get('[placeholder="Password"]').last().type('password123')
        cy.get('#form-login-button').click()
        */

    cy.request("POST", "http://localhost:3001/api/login", {
      username: "jesusdev",
      password: "password123",
    }).then((res) => {
      localStorage.setItem("loggedNoteAppUser", JSON.stringify(res.body));
      cy.visit("http://localhost:3000");
    });
  });
});
```

Now, what is wrong here? The documentation recommends to avoid using the UI to perform tasks like a login, if we can send the request directly to the API, the better.

To reuse this login you need to create a command, go to `cypress/support/commands.js`:

```javascript
Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3001/api/login", {
    username: "jesusdev",
    password: "password123",
  }).then((res) => {
    localStorage.setItem("loggedNoteAppUser", JSON.stringify(res.body));
    cy.visit("http://localhost:3000");
  });
});
```

And now we can reuse this like:

```javascript
describe("when logged in", () => {
  beforeEach(() => {
    cy.login();
  });
});
```

Another case is doing a HTTP request which needs to contain the token, we can add another command using the token we got inside our `localStorage`:

```javascript
Cypress.Commands.add("createNote", ({ content, important }) => {
  cy.request({
    method: "POST",
    url: "http://localhost:3001/api/notes",
    body: { content, important },
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("loggedNoteAppUser")).token
      }`,
    },
  });

  cy.visit("http://localhost:3000");
});
```

And to use it:

```javascript
describe("when logged in", () => {
  beforeEach(() => {
    cy.login({ username: "midudev", password: "lamidupassword" });
  });

  it("a new note can be created", () => {
    const noteContent = "a note created by cypress";
    cy.contains("Show Create Note").click();
    cy.get("input").type(noteContent);
    cy.contains("save").click();
    cy.contains(noteContent);
  });

  describe("and a note exists", () => {
    beforeEach(() => {
      cy.createNote({
        content: "This is the first note",
        important: false,
      });

      cy.createNote({
        content: "This is the second note",
        important: false,
      });

      cy.createNote({
        content: "This is the third note",
        important: false,
      });
    });
  });
});
```

To store and reuse an element in the DOM with Cypress we can do the following:

```javascript
cy.contains("This is the second note").as("theNote");
```

Which we can reuse it inside our `describe and a note exists` using the `get` and using `as` to declare the variable, in this case `theNote` which we can get by using `cy.get('@theNote')`:

```javascript
describe("and a note exists", () => {
  beforeEach(() => {
    cy.createNote({
      content: "This is the first note",
      important: false,
    });

    cy.createNote({
      content: "This is the second note",
      important: false,
    });

    cy.createNote({
      content: "This is the third note",
      important: false,
    });
  });

  it.only("it can be made important", () => {
    cy.contains("This is the second note").as("theNote");

    cy.get("@theNote").contains("make important").click();
  });
});
```

`cypress run` runs it `headless` which means it will not show the GUI.

Some notes:

- Adding a `data-test-id` to a form and access the children's by `cy.get('[data-test-id="login-form"] input[name="Username"]')` is better than giving each input a `data-test-id` attribute.

## Conclusion

Today we learned how to test! This is a very valuable skill that will help us a lot moving forward, we learned `react-testing-library` and `mock-service-worker` or `msw` for shorts. We learned how the different queries, the firing events, how to handle async cases and how to test our API calls the correct way!

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
