---
title: "Optimize long lists using list virtualization"
description: "Let's learn how to optimize our performance for long lists. The idea is to render only the visible rows, let's check how to do this in detail."
category: ["frontend", "test", "jest"]
pubDate: "2023-11-26"
published: true
---

Title: Testing: Unit Testing and Jest

Excerpt: We will start learning how to test our applications. We will start by understanding the concepts and then getting out feet's wet by using Enzyme, which is no longer used but going to show how to use it for educational purposes.

Categories:

Let's start by understanding what's Jest:

> Jest is a JavaScript testing framework designed to ensure correctness of any JavaScript codebase. It allows you to write tests with an approachable, familiar and feature-rich API that gives you results quickly.

The characteristics of `Jest` are:

- _Zero config:_ “Jest aims to work out of the box, config free, on most JavaScript projects.” This means you can simply install Jest as a dependency for your project, and with no or minimal adjustments, you can start writing your first test.
- _Isolated:_ Isolation is a very important property when running tests. It ensures that different tests don’t influence each other’s results. For Jest, tests are executed in parallel, each running in their own process. This means they can’t interfere with other tests, and Jest acts as the orchestrator that collects the results from all the test processes.
- _Snapshots:_ Snapshots are a key feature for front-end testing because they allow you to verify the integrity of large objects. This means you don’t have to write large tests full of assertions to check if every property is present on an object and has the right type. You can simply create a snapshot and Jest will do the magic. Later, we’ll discuss in detail how snapshot testing works.
- _Rich API:_ Jest is known for having a rich API offering a lot of specific assertion types for very specific needs. Besides that, its [great documentation](https://jestjs.io/docs/en/getting-started) should help you get started quickly.

## What is Unit Testing

> In computer programming, unit testing is a software testing method by which individual units of source code—sets of one or more computer program modules together with associated control data, usage procedures, and operating procedures—are tested to determine whether they are fit for use.

They verify the smallest parts of your application in isolation ensuring that they work as expected. These type of test don't interact with external dependencies like `HTTP` requests.

`Unit tests` are for one single purpose only; to have an automatically running test for functionality you have already verified as working that will inform you if features added to the application later on do or do not impact the existing features.

In most cases, `Unit tests` are not an effective way to find bugs. `Unit tests`, by definition, examine each unit of your code separately. But when your application is run for real, all those units have to work together, and the whole is more complex and subtle than the sum of its independently-tested parts. Proving that components X and Y both work independently doesn’t prove that they’re compatible with one another or configured correctly.

`Unit testing` is not the end all be all of application testing and it certainly does not need to be done for every single function. Doing so is counter-productive and a complete waste of time.

I'd recommend:

- Stop using shallow rendering for anything, under all circumstances.
- Never test against internal react state.
- Test things by interacting with the DOM elements and asserting against the output in the DOM, for example, if you want to see an error message appears on a form if a field isn't entered, actually render the form, don't enter any text, then simulate clicking the submit button, then assert that the expected error message appears in the DOM.
- This style of testing encourages you to think in terms of user behavior and not implementations. It means you start relying on your tests to HELP you make changes instead of battling against them every time you change something internally and your tests fail even though your application is in a working state.

### Example of testing from scratch

Create the folder of the project and access it:

```text
mkdir learning-jest
cd learning-jest
```

Then, run `npm init -y` to create a project. As a result, you should have a `package.json` file inside your folder, with this content:

```json
// package.json
{
  "name": "learning-jest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Create an `index.js` file and add the following function:

```javascript
function fizz_buzz(numbers) {
  let result = [];

  for (number of numbers) {
    if (number % 15 === 0) {
      result.push("fizzbuzz");
    } else if (number % 3 === 0) {
      result.push("fizz");
    } else if (number % 5 === 0) {
      result.push("buzz");
    } else {
      result.push(number);
    }
  }

  return result.join(", ");
}

module.exports = fizz_buzz;
```

Add `jest` to the project as a dev dependency:

```
npm install --save-dev jest
```

Inside the `package.json` change your `scripts` test property to `jest`:

```json
// package.json
{
  "name": "learning-jest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Create an `index.test.js` file and inside:

```javascript
const fizz_buzz = require("./index");

describe("FizzBuzz", () => {
  test('[3] should result in "fizz"', () => {
    expect(fizz_buzz([3])).toBe("fizz");
  });

  test('[5] should result in "buzz"', () => {
    expect(fizz_buzz([5])).toBe("buzz");
  });

  test('[15] should result in "fizzbuzz"', () => {
    expect(fizz_buzz([15])).toBe("fizzbuzz");
  });

  test('[1,2,3] should result in "1, 2, fizz"', () => {
    expect(fizz_buzz([3])).toBe("fizz");
  });
});
```

We’re verifying that:

- passing an array containing 3 should result in “fizz”
- an array containing 5 should result in “buzz”
- an array containing 15 should result in “fizzbuzz”
- passing an array with 1, 2, and 3 should result in “1, 2, fizz”

To run use `npm test` and you will see a window in your terminal with the information about the testing.

## Jest Basics

### Mock

> Mock functions make it easy to test the links between code by erasing the actual implementation of a function, capturing calls to the function (and the parameters passed in those calls).

We can use a mock to return whatever we want it to return. This is very useful to test all the paths in our logic because we can control if a function returns a correct value, wrong value, or even throws an error.

In short, a mock can be created by assigning the following snippet of code to a function or dependency:

```javascript
// We create the mock
const mockFn = jest.fn();
// We run it
mockFn();
// We do the testing
expect(mockFn).toHaveBeenCalled(); // In the above line we called it
```

### Spy

> Creates a mock function similar to `jest.fn()` but also tracks calls to `object[methodName]`. Returns a Jest mock function.

What this means is that the function acts as it normally would—however, all calls are being tracked. This allows you to verify if a function has been called the right number of times and held the right input parameters.

Below, you’ll find an example where we want to check if the _play_ method of a _video_ returns the correct result but also gets called with the right parameters. We spy on the _play_ method of the _video_ object.

Next, we call the _play_ method and check if the spy has been called and if the returned result is correct. Pretty straightforward! In the end, we must call the `mockRestore` method to reset a mock to its original implementation.

```javascript
const video = require("./video");

test("plays video", () => {
  const spy = jest.spyOn(video, "play");
  const isPlaying = video.play();

  expect(spy).toHaveBeenCalled();
  expect(isPlaying).toBe(true);

  spy.mockRestore();
});
```

### Describe blocks

A `describe` block is used for organizing test cases in logical groups of tests. For example, we want to group all the tests for a specific class. We can further nest new describe blocks in an existing describe block.

### "It" or "test"

Furthermore, we use the test keyword to start a new test case definition. The `it` keyword is an alias for the `test` keyword. Personally, I like to use it, which allows for more natural language flow of writing tests. To give an example:

```javascript
describe("Beverage()", () => {
  it("should be delicious", () => {
    expect(myBeverage.delicious).toBeTruthy();
  });
});
```

### Matchers

Next, let’s look at the matchers Jest exposes. A matcher is used for creating assertions in combination with the expect keyword. We want to compare the output of our test with a value we expect the function to return.

Again, let’s look at a simple example where we want to check if an instance of a class is the correct class we expect. We place the test value in the expect keyword and call the exposed matcher function `toBeInstanceOf(<class>)` to compare the values. The test results in the following code:

```javascript
it("should be instance of Car", () => {
  expect(newTruck()).toBeInstanceOf(Car);
});
```

### Cleaning up with `before` and `after`

Both functions allow you to execute logic `before` or `after` each test.

Here’s an example of mocking a database `beforeEach` test and tear it down `afterEach` test has finished.

```javascript
describe("tests with database", () => {
  beforeEach(() => {
    initDB();
  });

  afterEach(() => {
    removeDB();
  });

  test("if country exists in database", () => {
    expect(isValidCountry("Belgium")).toBe(true);
  });
});
```

There are also the `beforeAll` and `afterAll` which runs before and after the tests, but only once:

```javascript
beforeAll(() => {
  return createDBConnection();
});

afterAll(() => {
  return destroyDBConnection();
});
```

### Snapshot testing

> Snapshot testing is a type of “output comparison” or “golden master” testing. These tests prevent regressions by comparing the current characteristics of an application or component with stored “good” values for those characteristics. Snapshot tests are fundamentally different from unit and functional tests.

Snapshot testing can also be applied for checking larger objects, or even the `JSON` response for `API` endpoints.

Let’s take a look at an example for React where we simply want to create a snapshot for a link object. The snapshot itself will be stored with the tests and should be committed alongside code changes.

```javascript
it("renders correctly", () => {
  const tree = renderer
    .create(<Link page="http://www.facebook.com">Facebook</Link>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
```

Which renders:

```text
exports[`renders correctly 1`] = `
<a
  className="normal"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}
>
  Facebook
</a>
`;
```

If you make a change to the UI, the test will fail, you need to update the test using Jest CLI tool by adding a `-u` flag.

## Enzyme

> Enzyme is a library that makes testing React components specifically easier. It integrates with many full testing libraries, including Jest. If you're using React in your application, it might make sense to use Enzyme and Jest together to automatically test your UI.

Using snapshots to test UI components is a useful method, but it has some real drawbacks. For starters, saving HTML snapshots leads to lots of noisy code inside your code base that doesn’t provide much value. If you have a component which might exist in three different states, you need to save three different snapshots of that component for the test of each state.

Even though just one line might have changed, you’ll need to repeat the snapshot three times. A second drawback is that a failing snapshot fails once across the entire component. If you have a component that spans ten lines, but just one failure message, it can be difficult to determine where the test is actually failing.

Enzyme solves these problems. Instead of comparing entire snapshots of a rendered component, Enzyme renders the component in memory, then provides a series of APIs to examine the component’s properties.

Enzyme API has:

- **Static**: Render the given component and return plain HTML (we can't interact with it).
- **Shallow**: Render JUST the given component and none of its children
- **Full DOM**: Render the component and all of its children plus let us modify it afterwards

Let's test this comment box example:

```javascript
const CommentBox: React.FC = () => {
  const [comment, setComment] = React.useState < string > "";
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComment("");
  };
  return (
    <form onSubmit={onSubmit}>
      <h4>Add a Comment</h4>
      <textarea onChange={onChange} value={comment} />
      <div>
        <button>Submit Comment</button>
      </div>
    </form>
  );
};
```

Inside `__tests__` create `CommentBox.test.js`:

Lets simulate this event:

1. Find the `textarea` element
2. Simulate a change event
3. Provide a fake event object
4. Force component to update
5. Assert that the `textareas` value has changed

```javascript
import React from "react";
import { mount } from "enzyme";
import CommentBox from "components/CommentBox";

let wrapped;

beforeEach(() => {
  wrapped = mount(<CommentBox />);
});
afterEach(() => {
  wrapped = unMount(<CommentBox />);
});

it("has a text area and a button", () => {
  expect(wrapped.find("textarea").length).toEqual(1);
  expect(wrapped.find("button").length).toEqual(1);
});

it("has a text area and a button", () => {
  expect(wrapped.find("textarea").length).toEqual(1);
  expect(wrapped.find("button").length).toEqual(1);
});

describe("the text area", () => {
  beforeEach(() => {
    // We're simulating onChange on CommentBox
    wrapped.find("textarea").simulate("change", {
      target: { value: "new comment" },
    });
    wrapped.update();
  });
  it("has a text area that users can type in", () => {
    expect(wrapped.find("textarea").prop("value")).toEqual("new comment");
  });

  it("when form is submitted, text area gets emptied", () => {
    // We simulate the onSubmit
    wrapped.find("form").simulate("submit");
    wrapped.update();
    // It should be emptied just like in the component
    expect(wrapped.find("textarea").prop("value")).toEqual("");
  });
});
```

### Testing Redux Reducers

If we added Redux to the application and the component, then the previous test failed, we need to make this change:

```javascript
import React from "react";
import { mount } from "enzyme";
import CommentBox from "components/CommentBox";
import Root from "Root";

let wrapped;

beforeEach(() => {
  wrapped = (
    <Root>
      mount(
      <CommentBox />)
    </Root>
  );
});
afterEach(() => {
  wrapped = unMount(<CommentBox />);
});

it("has a text area and a button", () => {
  expect(wrapped.find("textarea").length).toEqual(1);
  expect(wrapped.find("button").length).toEqual(1);
});

describe("the text area", () => {
  beforeEach(() => {
    // We're simulating onChange on CommentBox
    wrapped.find("textarea").simulate("change", {
      target: { value: "new comment" },
    });
    wrapped.update();
  });
  it("has a text area that users can type in", () => {
    expect(wrapped.find("textarea").prop("value")).toEqual("new comment");
  });

  it("when form is submitted, text area gets emptied", () => {
    // We simulate the onSubmit
    wrapped.find("form").simulate("submit");
    wrapped.update();
    // It should be emptied just like in the component
    expect(wrapped.find("textarea").prop("value")).toEqual("");
  });
});
```

Where Root is:

```javascript
import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducers from "reducers";

export default ({ children, initialState = {} }) => {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(reduxPromise)
  );

  return <Provider store={store}>{children}</Provider>;
};
```

And the reducer is:

```javascript
import { SAVE_COMMENT, FETCH_COMMENTS } from "actions/types";

export default function (state = [], action) {
  switch (action.type) {
    case SAVE_COMMENT:
      return [...state, action.payload];
    case FETCH_COMMENTS:
      const comments = action.payload.data.map((comment) => comment.name);
      return [...state, ...comments];
    default:
      return state;
  }
}
```

For testing a reducer, we create a folder `src/reducers/__test_/` and we add the `comments.test.js` file to it:

```javascript
import commentsReducer from "reducers/comments";
import { SAVE_COMMENT } from "actions/types";

it("handles actions of type SAVE_COMMENT", () => {
  const action = {
    type: SAVE_COMMENT,
    payload: "New Comment",
  };

  const newState = commentsReducer([], action);

  expect(newState).toEqual(["New Comment"]);
});

it("handles action with unknown type", () => {
  const newState = commentsReducer([], { type: "LKAFDSJLKAFD" });

  expect(newState).toEqual([]);
});
```

### Testing Redux Actions

Let's take the following action as our example:

```javascript
import axios from "axios";
import { SAVE_COMMENT, FETCH_COMMENTS, CHANGE_AUTH } from "actions/types";

export function saveComment(comment) {
  return {
    type: SAVE_COMMENT,
    payload: comment,
  };
}

export function fetchComments() {
  const response = axios.get("http://jsonplaceholder.typicode.com/comments");

  return {
    type: FETCH_COMMENTS,
    payload: response,
  };
}

export function changeAuth(isLoggedIn) {
  return {
    type: CHANGE_AUTH,
    payload: isLoggedIn,
  };
}
```

Testing an action, we create a folder `src/actions/__test_/` and we add the `index.test.js` file to it:

```react
import { saveComment } from 'actions';
import { SAVE_COMMENT } from 'actions/types';

describe('saveComment', () => {
  it('has the correct type', () => {
    const action = saveComment();

    expect(action.type).toEqual(SAVE_COMMENT);
  });

  it('has the correct payload', () => {
    const action = saveComment('New Comment');

    expect(action.payload).toEqual('New Comment');
  });
});
```

### Testing Fake HTTP Requests

We can use a library called `moxios` to mock the request of an API Endpoint. Create a file `src/__tests__/integration.test.js`:

```javascript
import React from "react";
import { mount } from "enzyme";
import moxios from "moxios";
import Root from "Root";
import App from "components/App";

beforeEach(() => {
  moxios.install();
  moxios.stubRequest("http://jsonplaceholder.typicode.com/comments", {
    status: 200,
    response: [{ name: "Fetched #1" }, { name: "Fetched #2" }],
  });
});

afterEach(() => {
  moxios.uninstall();
});

it("can fetch a list of comments and display them", (done) => {
  const wrapped = mount(
    <Root>
      <App />
    </Root>
  );

  wrapped.find(".fetch-comments").simulate("click");

  moxios.wait(() => {
    wrapped.update();

    expect(wrapped.find("li").length).toEqual(2);

    done();
    wrapped.unmount();
  });
});
```

## Conclusion

Today we started our journey into learning testing! It's an important skill every developer should have, for now we started understanding `jest` and we got to know the outdated `enzyme` which helps a lot with testing React components. I say outdated, because the library used for testing in React is called `react-testing-library`, which we will check in the next article and will be the way we will test components from now on.

See you on the next post.

Sincerely,

**End. Adrian Beria**
