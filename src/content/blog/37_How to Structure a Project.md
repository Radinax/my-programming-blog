---
title: "How to structure a project"
description: "We will check how to properly structure a project using the most modern guidelines available for us."
category: ["concept"]
pubDate: "2023-12-11"
published: true
---

We will check how to properly structure a project using the most modern guidelines available for us.

## GIT

### Git rules

- Perform work in a feature branch.
- Branch out from `develop`.
- Never push into `develop` or `master` branch. Make a Pull Request.
- Update your local `develop` branch and do an interactive rebase before pushing your feature and making a Pull Request.
- Resolve potential conflicts while rebasing and before making a Pull Request.
- Delete local and remote feature branches after merging.
- Before making a Pull Request, make sure your feature branch builds successfully and passes all tests (including code style checks).
- Protect your `develop` and `master` branch. Read more here [Github](https://help.github.com/articles/about-protected-branches/), [Bitbucket](https://confluence.atlassian.com/bitbucketserver/using-branch-permissions-776639807.html) and [GitLab](https://docs.gitlab.com/ee/user/project/protected_branches.html).

### GIT workflow

For a new project, initialize a git repository in the project directory.

```text
cd <project directory>
git init
```

Checkout a new feature/bug-fix branch.

```text
git checkout -b <branchname>
```

Make Changes.

```text
git add .
git commit -am <message>
```

Sync with remote to get changes you’ve missed.

```
git checkout develop
git pull
```

Update your feature branch with latest changes from develop by interactive rebase.

```text
git checkout <branchname>
git rebase -i origin/develop
```

Press `:q!` to leave that menu if the VIM UI appears on your terminal. If ERROR `git rebase --abort`.

Solve conflicts if any:

```
git add .
git rebase --continue
```

Finally:

```
git push --force-with-lease
```

IF ERROR use: `git push --set-upstream origin <branch> --force-with-lease`. Where <branch> is usually `develop`.

## Documentation

- Use this [template](https://github.com/elsewhencode/project-guidelines/blob/master/README.sample.md) for `README.md`, Feel free to add uncovered sections.
- For projects with more than one repository, provide links to them in their respective `README.md` files.
- Keep `README.md` updated as a project evolves.
- Comment your code. Try to make it as clear as possible what you are intending with each major section.
- If there is an open discussion on `github` or `stackoverflow` about the code or approach you're using, include the link in your comment.
- Don't use comments as an excuse for a bad code. Keep your code clean.
- Don't use clean code as an excuse to not comment at all.
- Keep comments relevant as your code evolves.

## Environments

Define separate `development`, `test` and `production` environments if needed.

> Different data, tokens, APIs, ports etc... might be needed in different environments. You may want an isolated `development` mode that calls fake API which returns predictable data, making both automated and manual testing much easier. Or you may want to enable Google Analytics only on `production` and so on. [read more...](https://stackoverflow.com/questions/8332333/node-js-setting-up-environment-specific-configs-to-be-used-with-everyauth)

Load your deployment specific configurations from environment variables and never add them to the codebase as constants, [look at this sample](https://github.com/elsewhencode/project-guidelines/blob/master/config.sample.js).

> You have tokens, passwords and other valuable information in there. Your config should be correctly separated from the app internals as if the codebase could be made public at any moment.

`.env` files to store your variables and add them to `.gitignore` to be excluded. Instead, commit a `.env.example` which serves as a guide for developers. For production, you should still set your environment variables in the standard way.

## Testing

Have a `test` mode environment if needed. Your API may have rate limits in `production` and blocks your test calls after a certain amount of requests.

Place your test files next to the tested modules using `*.test.js` or `*.spec.js` naming convention, like `moduleName.spec.js`.

```
components/
├── product/
│   ├── product.tsx
│   └── product.spec.tsx
└── user/
    ├── user.tsx
    └── user.spec.tsx
```

Another way of doing this is:

```
components/
├── product/
│   ├── __tests__/
│   │   └── product.spec.tsx
│   ├── index.tsx
│   └── product.tsx
└── user/
    ├── __tests__/
    │   └── user.spec.tsx
    ├── user.tsx
    └── index.tsx
```

Where `components/product/index.tsx`:

```
export * from './product';
```

In this file you would export everything related to `Product` and you can import it in another view using one line in brackets.

Write testable code, avoid side effects, extract side effects, write pure functions.

Run tests locally before making any pull requests to `develop`.

Document your tests including instructions in the relevant section of your `README.md` file.

## API design

We mostly follow resource-oriented design. It has three main factors: resources, collection, and URLs.

- A resource has data, gets nested, and there are methods that operate against it.
- A group of resources is called a collection.
- URL identifies the online location of resource or collection.

Use `kebab-case` for `URLs`.

Use `camelCase` for parameters in the `query string` or resource fields.

Use `plural kebab-case` for resource names in URLs.

Always use a plural nouns for naming a URL pointing to a collection: `/users`.

Always use a singular concept that starts with a collection and ends to an identifier:

```
/students/<student ID>
/airports/<airport ID>
```

Avoid URLs like this:

```
GET /blogs/:blogId/posts/:postId/summary
```

This is not pointing to a resource but to a property instead. You can pass the property as a parameter to trim your response.

The request body or response type is JSON then please follow `camelCase` for `JSON` property names to maintain the consistency.

For nested resources, use the relation between them in the URL. For instance, using `id` to relate an employee to a company:

```
GET 	/schools/2/students		Get all students from school number 2
GET 	/schools/2/students/31	Get student 31 from school number 2
DELETE 	/schools/2/students/31	Delete student 31 from school number 2
PUT 	/schools/2/students/31	Update info of student 31 from school number 2
POST 	/schools				Creates a new school
```

Use a simple ordinal number for a version with a `v` prefix (v1, v2). Move it all the way to the left in the URL so that it has the highest scope:

```
http://api.domain.com/v1/schools/3/students
```

When your APIs are public for other third parties, upgrading the APIs with some breaking change would also lead to breaking the existing products or services using your APIs. Using versions in your URL can prevent that from happening.

esponse messages must be self-descriptive. A good error message response might look something like this:

```
{
    "code": 500,
    "message" : "Something bad happened",
    "description" : "More details"
}
```

or for validation errors:

```
{
    "code" : 400,
    "message" : "Validation Failed",
    "errors" : [
        {
            "code" : 1233,
            "field" : "email",
            "message" : "Invalid email"
        },
        {
            "code" : 1234,
            "field" : "password",
            "message" : "No password provided"
        }
      ]
}
```

The amount of data the resource exposes should also be taken into account. The API consumer doesn't always need the full representation of a resource. Use a fields query parameter that takes a comma separated list of fields to include:

```
GET /students?fields=id,name,age,class
```

### HTTP request status code

```
200	Success
201	New instance created
204	No Content as response, use when doing DELETE
304	Not modified
400	Bad request
401 Unauthorized
403 Forbidden
404	Not found
500	Server error
```

### API security

- Tokens must be transmitted using the Authorization header on every request: `Authorization: Bearer xxxxxx, Extra yyyyy`.
- Authorization Code should be short-lived.
- Reject any non-TLS requests by not responding to any HTTP request to avoid any insecure data exchange. Respond to HTTP requests by `403 Forbidden`.
- To protect your APIs from bot threats that call your API thousands of times per hour. You should consider implementing rate limit early on.
- Setting HTTP headers appropriately can help to lock down and secure your web application.
- Your API should convert the received data to their canonical form or reject them. Return 400 Bad Request with details about any errors from bad or missing data.
- All the data exchanged with the REST API must be validated by the API.

### API documentation

- Fill the `API Reference` section in [README.md template](https://github.com/elsewhencode/project-guidelines/blob/master/README.sample.md) for API.
- Describe API authentication methods with a code sample.
- Explaining The URL Structure (path only, no root URL) including The request type (Method).

For each endpoint explain:

- URL Params If URL Params exist, specify them in accordance with name mentioned in URL section:

  ```
  Required: id=[integer]
  Optional: photo_id=[alphanumeric]
  ```

- If the request type is POST, provide working examples. URL Params rules apply here too. Separate the section into Optional and Required.

- Success Response, What should be the status code and is there any return data? This is useful when people need to know what their callbacks should expect:

  ```
  Code: 200
  Content: { id : 12 }
  ```

- Error Response, Most endpoints have many ways to fail. From unauthorized access to wrongful parameters etc. All of those should be listed here. It might seem repetitive, but it helps prevent assumptions from being made. For example

  ```
  {
      "code": 401,
      "message" : "Authentication failed",
      "description" : "Invalid username or password"
  }
  ```

- Use API design tools, There are lots of open source tools for good documentation such as [API Blueprint](https://apiblueprint.org/) and [Swagger](https://swagger.io/).

## Client Side Rendering (CSR) project structure

Here is an example of how [Bulletproof React](https://github.com/alan2207/bulletproof-react) handles it:

```
bulletproof-react-master/
┣ .github/
┣ .husky/
┣ .storybook/
┣ .vscode/
┣ cypress/
┣ docs/
┣ public/
┣ src/
┣ .env [ADD TO GIT IGNORE]
┣ .eslintrc.js
┣ .gitignore
┣ .prettierrc
┣ craco.config.js
┣ cypress.json
┣ LICENCE
┣ package.json
┣ README.md
┣ tailwind.config.js
┣ tsconfig.json
┣ tsconfig.paths.json
┗ yarn.lock
```

### Basic files

`.github` is where we add out git actions to validate the code style and the testing before adding a commit.

`.husky` is the same as above, you can choose either one.

`.storybook` is a fantastic tool we can use to create an environment for designers and developers to play with an individual component. This folder provides some basic configuration needed to get it going. For more information check their [documentation](https://storybook.js.org/docs/html/get-started/introduction/).

`.vscode` is where we add important features like `formatOnSave`.

`.cypress` is a folder generated automatically by this testing framework. We add our tests inside the `.cypress/integration` folder and inside `cypress/support` we can add Command lines.

`docs` is a folder where we keep the documentation of the code. Remember to exclude this folder from the build process since we would be adding unnecessary data to our bundle. Or use my preferred option and just add it into your slack channel.

`craco.config.js` is where we add some configuration code needed to enable tailwind.

The rest is self explanatory.

Let's check what is going on inside the `src` folder:

```
src/
┣ assets/
┣ components/
┣ config/
┣ features/
┣ hooks/
┣ lib/
┣ providers/
┣ reducers/
┣ routes/
┣ stores/
┣ test/
┣ types/
┣ utils/
┣ __mocks__/
┣ App.tsx
┣ index.css
┣ index.tsx
┗ setupTests.ts
```

Inside `__mocks__` we can create a mocked Redux store for example.

Inside `config` we add information related to our `.env` variables but as constants (uppercased).

Inside `hooks`:

```
hooks/
┣ __tests__/
┃ ┗ useDisclosure.test.ts
┗ useDisclosure.ts
```

As we can see, we add all our custom hooks and inside the `__tests__` folder we add the respective tests.

### Test folder

Inside `test`:

```
test/
┣ server/
┃ ┣ handlers/
┃ ┃ ┣ auth.ts
┃ ┃ ┣ comments.ts
┃ ┃ ┣ discussions.ts
┃ ┃ ┣ index.ts
┃ ┃ ┣ teams.ts
┃ ┃ ┗ users.ts
┃ ┣ browser.ts
┃ ┣ db.ts
┃ ┣ index.ts
┃ ┣ server.ts
┃ ┗ utils.ts
┣ data-generators.ts
┗ test-utils.ts
```

Where `server` is where we add all our configuration using `MSW` to completely mock the requests from the actual server.

Inside `test/server/handlers` we mock the server implementation for each endpoint.

Inside `test/server/browser.ts` we import our handlers and add it to our `setupWorker` from `MSW`.

Inside `test/server/server.ts` we import our handlers and add it to our `setupServer` from `MSW`. Its the same as above but for the server.

Inside `test/server/db.ts` we create our models and export them.

Inside `test/server/index.ts` we create the listeners for the browser and the server.

## Lib or Libraries

Here we add configuration for libraries like `react-query`, `axios` (interceptors), authorization hook, and login/register functions.

## Components

Here we add the shared or common components of the project, like buttons with their respective `test` and `.stories`.

The typescript types stay local inside each components.

```
components/
├── Elements/
│   ├── Button/
│   │   ├── Button.stories.tsx
│   │   ├── Button.tsx
│   │   └── index.ts
│   └── ConfirmationDialog/
│       ├── __tests__/
│       │   └── ConfirmationDialog.test.tsx
│       ├── ConfirmationDialog.stories.tsx
│       ├── ConfirmationDialog.tsx
│       └── index.ts
└── Form/
    ├── __tests__/
    │   └── Form.test.tsx
    ├── FieldWrapper.tsx
    ├── Form.stories.tsx
    ├── Form.tsx
    ├── FormDrawer.tsx
    ├── index.ts
    ├── InputField.tsx
    ├── SelectField.tsx
    └── TextareaField.tsx
```

Inside the `index.ts` of each file we export every component related, for example in `components/Form/index.ts`:

```
export * from './Form';
export * from './FormDrawer';
export * from './InputField';
export * from './SelectField';
export * from './TextareaField';
```

## Features or Views

Here we add each view and the components related to the view, inside we can also import the common components of the `src/components` as well and we can use them to form related components of the view or feature we're working on.

Each feature comes with:

```
users/
├── components/
│   ├── DeleteUser.tsx
│   ├── UpdateProfile.tsx
│   └── UserList.tsx
├── types/
│   └── index.ts
├── layout/
│   └── index.ts
└── index.ts
```

Inside each view we have the components related to them, the types and inside the layout is where we create the layout of the view. Finally we export everything inside `src/features/users/index.ts`.

The testing of these views or features are being done using cypress.

## Providers

Lets look at a simple example:

```jsx
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {process.env.NODE_ENV !== "test" && <ReactQueryDevtools />}
            <Notifications />
            <AuthProvider>
              <Router>{children}</Router>
            </AuthProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
```

As you can see we have different wrappers around our application, we have `Suspense` for when we're loading data, `ErrorBoundary` to handle the errors (this is from `react-error-boundary`), we have the `HelmetProvider` which adds the SEO tags from `react-helmet-async`, `QueryClientProvider` comes from `react-query`:

```javascript
export const queryClient = new QueryClient({ defaultOptions: queryConfig });
```

`Notifications` are a way of showing notes to the user for HTTP requests for example.

`AuthProvider` is just a way to handle Private and Public routes which depends if the user is logged in or not. We're using `react-query-auth` for this.

## Reducers

Let's use a simple example for a login reducer:

```typescript
export interface AuthState {
  isAuth: boolean;
  session: Session;
  isLoading: boolean;
  error: AuthError;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: state => {
      state.isLoading = true;
      state.error.message = '';
    },
    loginSuccess: (state, { payload }) => {
      state.session = payload;
      state.isLoading = false;
      state.isAuth = true;
      state.error.message = '';
    },
    loginFailed(state, { payload }) {
      state.isLoading = false;
      state.error.message = payload;
    },
    logout: state => {
      Cookie.remove('Authorization');
      state.session = initialState.session;
      state.isAuth = false;
      state.isLoading = false;
      state.error.message = '';
    },
})

export const {
  login,
  loginSuccess,
  loginFailed,
} = authSlice.actions;

export const authSelector = (state: { authReducer: AuthState }) => state.authReducer;

export default authSlice.reducer;
```

And the folder structure would simply be:

```
reducers/
├── authReducer.tsx
└── index.ts
```

## API

Here we have all our API calls related to each view, I prefer having it separate from the features folder.

```jsx
export const getUserService = () => (dispatch: Dispatch) => {
  dispatch(getUser());
  api
    .get("/api/v1/users")
    .then((res) => {
      if (res.data !== undefined) dispatch(getUserSuccess(res.data));
      else throw new Error();
    })
    .catch((err) => {
      dispatch(showNotificationModal({ type: "error", message: err.message }));
      dispatch(getUserFailed());
    });
};
```

## Conclusion

Today we learned how to properly structure a CSR project. The idea is to have everything organized and that it makes sense for the developer to know what is going on, for this a proper documentation is also needed and also a proper testing structure.

Notice how we're doing unit testing for utility functions and shared components. While integration tests and E2E tests are being done by Cypress. This is up to the team you're in.

See you on the next post.

Sincerely,

**End. Adrian Beria**
