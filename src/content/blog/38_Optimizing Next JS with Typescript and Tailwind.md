---
title: "Setting up NextJS with Redux, Storybook, Typescript and Tailwind"
description: "TIn our posts about application optimizations we talked a lot about SSR. Lately we have been focusing on CSR with create-react-app, today we will learn how to use NextJS properly and set it up from the beginning creating a base to setup future projects."
category: ["typescript", "react", "frontend", "nextjs", "tailwind"]
pubDate: "2023-12-15"
published: true
---

In our posts about application optimizations we talked a lot about SSR. Lately we have been focusing on CSR with create-react-app, today we will learn how to use NextJS properly and set it up from the beginning. The application will be a simple counter.

## Folder Structure

```text
project/
├── .next
├── .storybook/
│   ├── main.js
│   └── preview.js
├── api/
│   └── counterApi.ts
├── components/
│   ├── Button/
│   │   ├── Base.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   └── Counter/
│       └── Counter.tsx
├── config/
│   └── store.ts
├── hooks/
│   └── redux.ts
├── pages/
│   ├── api/
│   │   └── counter.ts
│   ├── _app.tsx
│   └── index.tsx
├── public/
│   └── favicon.ico
├── reducers/
│   ├── counterSlice.ts
│   └── rootReducer.ts
├── styles/
│   └── globals.scss
├── .gitignore
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind-preset.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Installation

We will start by doing:

`npx create-next-app --example with-tailwindcss nextjs-tailwind-starting`

Where `nextjs-tailwind-starting ` is the name of the project.

`npm install sass`

Which creates a project with TailwindCSS and TypeScript.

Which produces the following folder structure:

```text
nextjs-tailwind-redux-starting/
├── pages/
│   ├── api/
│   │   └── hello.js
│   ├── index.js
│   └── _app.js
├── public/
│   ├── favicon.ico
│   └── vercel.svg
├── styles/
│   ├── globals.css
│   └── Home.module.css
├── .gitignore
├── next-env.d.ts
├── next-config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## Configuring Tailwind

Inside `tailwind.config.js` add:

```json
presets: [require("./tailwind-preset.config.js")],
```

And create a `tailwind-preset.config.js` file, inside add the following:

```javascript
module.exports = {
  theme: {
    fontFamily: {
      // This one is very specific
      apple: [
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
      ],
    },
    backgroundColor: (theme) => ({
      ...theme("colors"),
    }),
    // we preserve the Tailwind values and add new ones
    extend: {
      screens: {
        "2xl": "1440px",
        "3xl": "1560px",
        "4xl": "1920px",
      },
      colors: {
        blue: {
          DEFAULT: "#197ACF",
          light: "#E8F0FE",
          dark: "#1F3044",
          darkest: "#1D2228",
        },
        gray: {
          DEFAULT: "#606060",
          light: "#F2F2F2",
          medium: "#CCCCCC",
          dark: "#51596D",
        },
        red: {
          DEFAULT: "#EA4444",
          light: "#F95050",
        },
        green: {
          DEFAULT: "#4BBC56",
          light: "#4AB270",
        },
        yellow: {
          DEFAULT: "#FFBC00",
        },
        orange: {
          DEFAULT: "#EA7D24",
        },
      },
      fontSize: {
        xxxs: ["8px"],
        xxs: ["10px"],
      },
      padding: {
        sm: "35px",
      },
      height: {
        xxs: "8px",
        xs: "10px",
        sm: "35px",
      },
      width: {
        xxs: "8px",
        xs: "10px",
        sm: "35px",
      },
    },
  },
  plugins: [
    // Uncomment this to use, remember to install them
    // require("@tailwindcss/typography"),
    // require("@tailwindcss/aspect-ratio"),
    // require("'@tailwindcss/forms"),
  ],
};
```

Now we need to create our global styling for our components inside `styles/globals.css`, first rename it to `styles/globals.scss`:

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  padding: 0;
  margin: 0;
  &:before {
    content: "";
    content: "";
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: -1;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
  }
}

* {
  box-sizing: border-box;
}

@layer base {
  body {
    @apply font-apple;
  }
  h1 {
    @apply text-4xl;
  }

  h2 {
    @apply text-3xl;
  }

  h3 {
    @apply text-2xl;
  }

  h4 {
    border-bottom: 1px solid hsla(0, 0%, 0%, 0.07);
    @apply text-xl;
    @apply uppercase;
  }

  p {
    @apply text-gray-darkest;
    @apply text-base;
  }

  p.tag {
    @apply text-base;
    @apply uppercase;
  }

  ul,
  ol {
    @apply inline-grid;
    @apply pb-4;
  }

  li {
    @apply text-base;
    @apply inline-flex;
    @apply pb-2;
    &:before {
      content: "- ";
    }
    @apply block;
  }

  .link a {
    @apply text-sm;
    @apply underline;
    @apply text-blue;
    @apply font-bold;
    cursor: pointer;
  }
}
```

Remember, it depends on your design guideline, this is just a boilerplate to get going quickly.

## Configuring TypeScript

Inside our `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## Using SVG

If your designer gives you the assets of the icons, set them inside a folder called `assets/icons` and inside add the SVG.

Otherwise one of the suggested ways of using SVG components in 2022 is using [`Hero Icons`](https://github.com/tailwindlabs/heroicons):

```shell
npm install @heroicons/react
```

```jsx
import { CheckIcon } from "@heroicons/react/outline";

const icon = <CheckIcon className="h-5 w-5" />;
```

You could also create a `components/Icons` folder and inside add the Icons you be using in the project.

## Setting up the components folder

Let's start by adding a `components/Button/Base.tsx` folder to the root:

```jsx
import { ButtonHTMLAttributes, MouseEvent, ReactElement } from "react";

export type IButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string,
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void,
  className?: string,
  disabled?: boolean,
  variant: "primary" | "secondary" | "inverse",
  size: "sm" | "md" | "lg",
  startIcon?: ReactElement,
  endIcon?: ReactElement,
};

const variants = {
  primary: "bg-blue text-white border-blue hover:bg-white hover:text-blue",
  inverse: "bg-white text-blue-600 hover:bg-blue-600 hover:text-white",
  secondary: "bg-red-600 text-white hover:bg-red-50 hover:text-red-600",
};

const sizes = {
  sm: "py-2 px-4 text-sm",
  md: "py-2 px-6 text-md",
  lg: "py-3 px-8 text-lg",
};

const BaseButton: React.FC<IButton> = ({
  label,
  onClick,
  className = "",
  disabled = false,
  children,
  variant = "primary",
  size = "md",
  startIcon,
  endIcon,
}) => {
  const buttonClass = `
    flex
    justify-center
    items-center
    border
    disabled:opacity-70
    disabled:cursor-not-allowed
    rounded-md
    shadow-sm
    font-medium
    focus:outline-none
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick}>
      {startIcon && <span className="mr-3">{startIcon}</span>}
      {label || children}
      {endIcon && <span className="ml-3">{endIcon}</span>}
    </button>
  );
};

export default BaseButton;
```

This is a generic button that has different variants depending on your design and sizes which could vary depending on the screen size, this is up to your designer and should be adjusted accordingly.

Additionally create an `index.ts` file:

```
export * from './Button';
```

You can create different types of buttons using the `Button.tsx` component and add them as export in the `index.ts` file.

Your designer will usually handle you a guideline they worked with and it will have different sets of buttons which would go inside this folder.

These type of component being purely visual with only the `onClick` as its functionality, doesn't need a test, but for the other common components, you will need to add a `__tests__` folder and inside the respective tests.

### Storybook

Its a fantastic tool for the whole team to check individual components and how they work inside a great UI site.

It's recommended that the dev ops engineer to create a specific site to put all these components so your UI designer can check it and handle feedback as needed.

To start `npx sb init --type react`.

Now we want for Storybook to search inside our components folder and read the `.stories` inside our components, for example:

```text
components/
└── Button/
    ├── Base.tsx
    ├── Button.stories.tsx
    └── index.ts
```

We want that `.stories` file to be read by Storybook, to do that we need to go inside `.storybook/main.js`:

```json
module.exports = {
  stories: ["../components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-postcss",
    {
      name: "@storybook/addon-postcss",
      options: {
        cssLoaderOptions: {
          importLoaders: 1,
        },
        postcssLoaderOptions: {
          implementation: require("postcss"),
        },
      },
    },
  ],
  framework: "@storybook/react",
};
```

What we're doing on the `stories` key is tell it to check inside the components folder, inside the specific component and get the needed files. If your file configuration is different then you must change it, otherwise it will give an error.

We're also adding `postcss` for Tailwind.

Next we need to add this line to our `.storybook/preview.js` file:

```jsx
import "!style-loader!css-loader!postcss-loader!tailwindcss/tailwind.css";
```

This compiles Tailwind CSS generated files.

Next create `components/Button/Button.stories.tsx`

```jsx
// Button.stories.js|jsx|ts|tsx
import React from "react";
import { Meta, Story } from "@storybook/react";
import BaseButton, { IButton } from "./Base";
import { CheckIcon } from "@heroicons/react/outline";

const meta: Meta = {
  title: "Components/Buttons",
  component: BaseButton,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    variant: {
      options: ["primary", "secondary", "inverse"],
      control: { type: "radio" },
    },
  },
};

export default meta;

const Template: Story<IButton> = (args) => <BaseButton {...args} />;

export const Base = Template.bind({});
Base.args = {
  children: "Base Button",
  variant: "primary",
};

export const Icon = Template.bind({});
Icon.args = {
  children: "Icon Button",
  variant: "primary",
  icon: <CheckIcon className="h-5 w-5" />,
};
```

## Redux Toolkit

I have written a lot about Redux Toolkit in the past, but in NextJS we need to take extra steps considering that in a SSR application it can behave differently.

Let's install it as usual:

```shell
npm install @reduxjs/toolkit @types/react-redux react-redux next-redux-wrapper
```

### Next Redux Wrapper

When Next.js static site generator or server side rendering is involved, things start to get complicated as another store instance is needed on the server to render Redux-connected components.

Furthermore, access to the Redux `Store` may also be needed during a page's `getInitialProps`.

This is where `next-redux-wrapper` comes in handy: It automatically creates the store instances for you and makes sure they all have the same state.

Moreover it allows to properly handle complex cases like `App.getInitialProps` (when using `pages/_app`) together with `getStaticProps` or `getServerSideProps` at individual page level.

Library provides uniform interface no matter in which Next.js lifecycle method you would like to use the `Store`.

We could not use this library, but it **lets you avoid to instantiate the store every time you render on the server and other handy functionalities**.

### Configuring store and types

Create a `config/store.ts` file and inside:

```typescript
import {
  configureStore,
  ThunkAction,
  Action,
  AnyAction,
} from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";

import combinedReducer from "../reducers/rootReducer";

const reducer = (
  state: ReturnType<typeof combinedReducer> | undefined,
  action: AnyAction
) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer,
  });

type Store = ReturnType<typeof makeStore>;

const store = makeStore();

export type AppState = ReturnType<Store["getState"]>;

export type AppDispatch = Store["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper(makeStore, { debug: true });

export default store;
```

This is very basic configuration the documentation recommends doing.

Now inside our `pages/_app` we need to add our `wrapper` from `next-redux-wrapper`:

```jsx
import "../styles/globals.scss";

import type { AppProps } from "next/app";

import { wrapper } from "../config/store";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default wrapper.withRedux(MyApp);
```

### Creating an API

Create an `api/counterApi.ts`:

```jsx
export async function fetchCount(amount = 1): Promise<{ data: number }> {
  const response = await fetch("/api/counter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
  const result = await response.json();

  return result;
}
```

As you can see we're doing a request to the endpoint `api/counter`, so let's create it inside `pages/api`:

```jsx
import type { NextApiHandler } from "next";

const countHandler: NextApiHandler = async (request, response) => {
  const { amount = 1 } = request.body;

  // simulate IO latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  response.json({ data: amount });
};

export default countHandler;
```

### Creating a Slice

Create a `reducers/counterSlice.ts` file:

```tsx
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState, AppThunk } from "../config/store";
import { fetchCount } from "../api/counterApi";

export interface CounterState {
  value: number;
  status: "idle" | "loading" | "failed";
}

const initialState: CounterState = {
  value: 0,
  status: "idle",
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const incrementAsync = createAsyncThunk(
  "counter/fetchCount",
  async (amount: number) => {
    const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.value += action.payload;
      });
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export const selectCount = (state: AppState) => state.counter.value;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState());
    if (currentValue % 2 === 1) {
      dispatch(incrementByAmount(amount));
    }
  };

export default counterSlice.reducer;
```

### Create a hooks folder

Create a `hooks/redux.ts` file:

```typescript
import type { ChangeEvent } from "react";
import { useEffect, useRef } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import type { AppDispatch, AppState } from "../config/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
```

### Using it in a component

Create a `components/Counter` folder and inside add `Counter.tsx`:

```jsx
import { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from "../../reducers/counterSlice";
import Button from "../Button/Base";

function Counter() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const [incrementAmount, setIncrementAmount] = useState("2");

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <div className="flex flex-col w-fit ml-auto mr-auto border border-black rounded-lg p-4">
      <div className="flex justify-center mb-3">
        <Button
          aria-label="Decrement value"
          className="mr-3"
          onClick={() => dispatch(decrement())}
        >
          -
        </Button>
        <div className="px-3 flex items-center">{count}</div>
        <Button
          aria-label="Increment value"
          className="ml-3"
          onClick={() => dispatch(increment())}
        >
          +
        </Button>
      </div>
      <div className="flex justify-center flex-col">
        <input
          aria-label="Set increment amount"
          className="border border-black rounded-lg mb-3 text-center"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <div className="flex flex-row">
          <Button
            className="mr-3"
            onClick={() => dispatch(incrementByAmount(incrementValue))}
          >
            Add Amount
          </Button>
          <Button
            className="mr-3"
            onClick={() => dispatch(incrementAsync(incrementValue))}
          >
            Add Async
          </Button>
          <Button onClick={() => dispatch(incrementIfOdd(incrementValue))}>
            Add If Odd
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Counter;
```

### Import it in your page folder

Go inside `pages/index.tsx` and add this:

```jsx
import type { NextPage } from "next";

import Counter from "../components/Counter/Counter";

const IndexPage: NextPage = () => {
  return (
    <div>
      <Counter />
    </div>
  );
};

export default IndexPage;
```

## Conclusion

Today we learned how to create a NextJS application with the best libraries! This setup serves as a starting point where you can create anything you want and the goal is to save you time with all the configurations you need to do in order to have everything working fluidly.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
