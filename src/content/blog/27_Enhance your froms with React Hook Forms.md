---
title: "Enhance your forms with React Hook Forms!"
description: "Forms are seen in pretty much every application and handling them in the correct way is a must, considering that excess code can lead to unneeded complexity and bundle size."
category: ["react", "frontend"]
pubDate: "2023-11-29"
published: true
---

Forms are a tricky subject because when handling large forms your form state can become quite a mess, then adding all those `onChange` handlers on the inputs and error handlings, can make up for repeated code in your components where there are forms.

`react-hook-forms` help us solve these problems thanks to its `useForm` hook providing several useful functions that significantly reduce the code needed to create a functional form.

Let's start by checking out the different hooks available to us:

## `useForm`

This will be our bread and butter, we can manage forms with ease using this:

```javascript
useForm({
  mode: "onSubmit",
  reValidateMode: "onChange",
  defaultValues: {},
  resolver: undefined,
  context: undefined,
  criteriaMode: "firstError",
  shouldFocusError: true,
  shouldUnregister: false,
  shouldUseNativeValidation: false,
  delayError: undefined,
});
```

### `mode`

This option allows you to configure the validation strategy before user submit the form (`onSubmit` event):

| Name        | Type   | Description                                                                                                                                                                                           |
| :---------- | :----- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onSubmit`  | string | Validation will trigger on the `submit` event and invalid inputs will attach `onChange` event listeners to re-validate them.                                                                          |
| `onBlur`    | string | Validation will trigger on the `blur` event.                                                                                                                                                          |
| `onChange`  | string | Validation will trigger on the `change` event with each input, and lead to multiple re-renders. Warning: this often comes with a significant impact on performance.                                   |
| `onTouched` | string | Validation will trigger on the first `blur` event. After that, it will trigger on every `change` event. **Note:** when using with `Controller`, make sure to wire up `onBlur` with the `render` prop. |
| all         | string | Validation will trigger on the `blur` and `change` events.                                                                                                                                            |

### `reValidateMode`: `onChange | onBlur | onSubmit = 'onChange'`

This option allows you to configure validation strategy when inputs with errors get re-validated **after** user submit the form (`onSubmit` event). By default, validation is triggered during the input change event.

### `defaultValues`: `Record<string, any> = {}`

The `defaultValues` for inputs are used as the initial value when a component is first rendered, before a user interacts with it. It is **encouraged** that you set `defaultValues` for all inputs to non-`undefined` values such as the empty `string` or `null`.

### `resolver`

`(values: any, context?: object, options: Object) => Promise<ResolverResult> | ResolverResult `

This function let us use external validations like [Yup](https://www.npmjs.com/package/yup) which in my opinion are a must use when handling forms.

To use resolvers you must install it `npm install @hookform/resolvers`.

**Rules**:

- Make sure you are returning an object that has both a `values` and an `errors` property. Their default values should be an empty object. For example: `{}`.
- Schema validation focus on the field level for error reporting. Parent level error look is only limited to the direct parent level that is applicable for components such as group checkboxes.
- The keys of the `error` object should match the `name` values of your fields.
- This function will be cached, while `context` is a mutable `object` that can be changed on each re-render.
- Re-validation of an input will only occur one field at time during a user’s interaction. The lib itself will evaluate the `error` object to trigger a re-render accordingly.
- A resolver cannot be used with the built-in validators (e.g.: required, min, etc.)

| Name      | Type                                                               | Description                                                                                                         |
| :-------- | :----------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| `values`  | `object`                                                           | This object contains the entire form values.                                                                        |
| `context` | `object`                                                           | This is the `context` object which you have provided to the `useForm` config.                                       |
| `options` | `{   criteriaMode: string,   fields: object,   names: string[]  }` | This is the option object contains information about the validated fields, names and `criteriaMode` from `useForm`. |

Here is a quick example:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import "./styles.css";

const SignupSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string(),
  age: yup.number().required().positive().integer(),
  website: yup.string().url(),
});

const input = ({ label, value }) => (
  <div>
    <label>{label}</label>
    <input type="text" {...register(value)} />
    {errors[value] && <p>{errors[value].message}</p>}
  </div>
);

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });
  const [isShow, setIsShow] = React.useState(false);

  const onSubmit = (data) => alert(JSON.stringify(data));

  const FirstName = input({ label: "First Name", value: "firstName" });
  const LastName = input({ label: "Last Name", value: "lastName" });
  const Age = input({ label: "Age", value: "age" });
  const Website = input({ label: "Website", value: "website" });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isShow ? (
        <>
          <FirstName />
          <LastName />
        </>
      ) : (
        <>
          <Age />
          <Website />
        </>
      )}
      <button onClick={() => setIsShow((p) => !p)}>toggle</button>
      <input type="submit" />
    </form>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

### `context`

This context `object` is mutable and will be injected into the `resolver`'s second argument or [Yup](https://github.com/jquense/yup) validation's context object.

Let's check a quick example:

```javascript
import * as React from "react";
import { useForm } from "react-hook-form";
import Headers from "./Header";
import "./styles.css";

type FormValues = {
  firstName: string;
};

let renderCount = 0;

export default function App() {
  const [isValid, setIsValid] = React.useState(true);
  const { register, handleSubmit } = useForm<FormValues, { isValid: boolean }>({
    resolver: (data, context) => {
      return {
        values: context?.isValid ? data : {},
        errors: context?.isValid
          ? {
              firstName: {
                type: "isValid",
                message: "Message here."
              }
            }
          : {}
      };
    },
    context: {
      isValid
    }
  });
  const onSubmit = (data: FormValues) => console.log(data);
  renderCount++;

  return (
    <div>
      <Headers
        renderCount={renderCount}
        description="Performant, flexible and extensible forms with easy-to-use validation."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("firstName")} placeholder="First Name" />
        <button type="button" onClick={() => setIsValid(!isValid)}>
          Toggle Valid
        </button>
        <input type="submit" />
      </form>
    </div>
  );
}
```

### `criteriaMode`: `firstError | all`

- When set to `firstError` (default), only the first error from each field will be gathered.
- When set to `all`, all errors from each field will be gathered.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";

import "./styles.css";

export default function App() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    // by setting validateCriteriaMode to 'all',
    // all validation errors for single field will display at once
    criteriaMode: "all",
    mode: "onChange",
  });
  const onSubmit = (data) => console.log(data);

  console.log("errors", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="password"
        {...register("password", {
          required: true,
          minLength: 10,
          pattern: /\d+/gi,
        })}
      />
      {/* without enter data for the password input will result both messages to appear */}
      {errors?.password?.types?.required && <p>password required</p>}
      {errors?.password?.types?.minLength && <p>password minLength 10</p>}
      {errors?.password?.types?.pattern && <p>password number only</p>}

      <input type="submit" />
    </form>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

### `shouldFocusError`: `boolean = true`

When set to true (default) and the user submits a form that fails the validation, it will set focus on the first field with an error.

**Note:** only registered fields with a `ref` will work. Custom registered inputs do not apply. For example: `register('test') // doesn't work`

**Note:** the focus order is based on the `register` order.

### `shouldUnregister`: `boolean = false`

By default, an input value will be retained when input is removed. However, you can set `shouldUnregister` to `true` to `unregister` input during unmount.

- This is a global config that overwrites child-level config, if you want to have individual behavior, then you should set the config at the component or hook level, not at `useForm`.

- By default `shouldUnregister: false`: unmounted fields will **not** be validated by build-in validation.

- By setting `shouldUnregister` to true at `useForm` level, `defaultValues` will **not** be merged against submission result.

- set `shouldUnregister: true` will set your form behave more closer as native.

  Form values will be lived inside your inputs itself.

  - input unmount will remove value.
  - input hidden should applied for hidden data.
  - only registered input will be included as submission data.
  - unmounted input will need to notify at either `useForm`, or `useWatch`'s `useEffect` for hook form to verify input is unmounted from the DOM.

```javascript
const NotWork = () => {
  const [show, setShow] = React.useState(false);
  // ❌ won't get notified, need to invoke unregister
  return {show && <input {...register('test')} />}
}

const Work = () => {
  const { show } = useWatch()
  // ✅ get notified at useEffect
  return {show && <input {...register('test1')} />}
}

const App = () => {
  const [show, setShow] = React.useState(false);
  const { control } = useForm({ shouldUnregister: true });
  return (
    <div>
      // ✅ get notified at useForm's useEffect
      {show && <input {...register('test2')} />}
      <NotWork />
      <Work control={control} />
    </div>
  )
}
```

### `delayError`: `number`

This config will delay the error state to be displayed to the end-user in milliseconds. Correct the error input will remove the error instantly and delay will not be applied.

### `shouldUseNativeValidation`: `boolean = false`

This config will enable [browser native validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation). It will also enable CSS selectors `:valid` and`:invalid` making style inputs easier. In fact, you can still use those selectors even the client validation is disabled.

- **Note:** You can turn on this config and set `novalidate` at your form and still use those CSS selectors.
- **Note:** This feature only works for `register` API, not `useController/Controller`.

```javascript
import React from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const { register, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
  });
  const onSubmit = async (data) => {
    console.log(data);
  };

  // you can still disabled the native validation, CSS selectors such as
  // invalid and valid still going to work
  // <form onSubmit={handleSubmit(onSubmit)} novalidate>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("firstName", {
          required: "Please enter your first name.",
        })} // custom message
      />
      <input type="submit" />
    </form>
  );
}
```

## `useController`

`(props?: UseControllerProps) => { field: object, fieldState: object, formState: object }`

This powers the `react-hook-forms` Controller wrapper, which helps us working with external controller components like `react-select` and `material-ui`.

You can check it more in [depth here](https://react-hook-form.com/api/usecontroller).

Here is a quick example:

```javascript
import React from "react";
import { TextField } from "@material-ui/core";
import { useController, useForm } from "react-hook-form";

function Input({ control, name }) {
  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue: "",
  });

  return (
    <TextField
      onChange={onChange} // send value to hook form
      onBlur={onBlur} // notify when input is touched/blur
      value={value} // input value
      name={name} // send down the input name
      inputRef={ref} // send input ref, so we can focus on input when error appear
    />
  );
}

function App() {
  const { control } = useForm();

  return <Input name="firstName" control={control} />;
}
```

## `useFormContext`

This custom hook allows you to access the form context. `useFormContext` is intended to be used in deeply nested structures, where it would become inconvenient to pass the context as a prop.

You need to wrap your form with the `FormProvider` component for `useFormContext` to work properly.

Let's check a quick example:

```javascript
import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

export default function App() {
  const methods = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <FormProvider {...methods}>
      {" "}
      // pass all methods into the context
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <NestedInput />
        <input type="submit" />
      </form>
    </FormProvider>
  );
}

function NestedInput() {
  const { register } = useFormContext(); // retrieve all hook methods
  return <input {...register("test")} />;
}
```

## `useWatch`

`({ control?: Control, name?: string, defaultValue?: any, disabled?: boolean }) => object`

It will notify you whenever an input changes. This way you don’t have to wait for the user to submit the form in order to do something.

Let's check a quick example:

```javascript
import React from "react";
import { useForm, useWatch } from "react-hook-form";

function FirstNameWatched({ control }) {
  const firstName = useWatch({
    control,
    name: "firstName", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
    defaultValue: "default", // default value before the render
  });

  return <div>Watch: {firstName}</div>; // only re-render at the component level, when firstName changes
}

function App() {
  const { register, control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName")} />
      <input {...register("lastName")} />
      <input type="submit" />

      <FirstNameWatched control={control} />
    </form>
  );
}
```

## `useFormState`

`({ control: Control }) => FormState`

This custom hook allows you to subscribe to each form state, and isolate the re-render at the custom hook level. It has its scope in terms of form state subscription, so it would not affect other `useFormState` and `useForm`. Using this hook can reduce the re-render impact on large and complex form application.

If specific state is not subscribed, so make sure you deconstruct or read it before render in order to enable the subscription.

```javascript
const { isDirty } = useFormState(); // ✅
const formState = useFormState(); // ❌ should deconstruct the formState
```

The following table contains information about the arguments for `useFormState`.

| Name       | Type              | Description                                                                       |
| :--------- | :---------------- | :-------------------------------------------------------------------------------- |
| `control`  | `object`          | [`control`](https://react-hook-form.com/api/useform/control) object from useForm. |
| `name`     | `string           | string[]`                                                                         |
| `disabled` | `boolean = false` | Option to disable the subscription.                                               |
| `exact`    | `boolean = false` | This prop will enable an exact match for input name subscriptions.                |

The `useFormState` returns the following props:

| `isDirty`            | `boolean` |                                                                                                                                                                                           |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dirtyFields`        | `object`  | An object with the user-modified fields. Make sure to provide all inputs' `defaultValues` via `useForm`, so the library can compare against the `defaultValues`.                          |
| `touchedFields`      | `object`  | An object containing all the inputs the user has interacted with.                                                                                                                         |
| `isSubmitted`        | `boolean` | Set to `true` after the form is submitted. Will remain `true` until the `reset` method is invoked.                                                                                        |
| `isSubmitSuccessful` | `boolean` | Indicate the form was successfully submitted without any `Promise` rejection or `Error` been threw within the `handleSubmit` callback.                                                    |
| `isSubmitting`       | `boolean` | `true` if the form is currently being submitted. `false` if otherwise.                                                                                                                    |
| `submitCount`        | `number`  | Number of times the form was submitted.                                                                                                                                                   |
| `isValid`            | `boolean` | Set to `true` if the form doesn't have any errors. **Note:** `isValid` is affected by `mode` at `useForm`. This state is only applicable with `onChange`, `onTouched`, and `onBlur` mode. |
| `isValidating`       | `boolean` | Set to `true` during validation.                                                                                                                                                          |
| `errors`             | `object`  | An object with field errors. There is also an `ErrorMessage` component to retrieve error message easily.                                                                                  |

`isDirty` has some interesting peculiarities:

Set to `true` after the user modifies any of the inputs.

- Make sure to provide all inputs' `defaultValues` at the `useForm`, so hook form can have a single source of truth to compare whether the form is dirty.
- File typed input will need to be managed at the app level due to the ability to cancel file selection and `FileList` object.
- Native inputs will return `string` type by default.
- `isDirty` state will be affected with actions from `useFieldArray`.

For example:

```javascript
useForm({ defaultValues: { test: [] } });
const { append } = useFieldArray({ name: "test" });

// append will make form dirty, because a new input is created
// and form values is no longer deeply equal defaultValues.
append({ firstName: "" });
```

To use `useFormState`, here is an example:

```javascript
import * as React from "react";
import { useForm, useFormState } from "react-hook-form";

export default function App() {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      firstName: "firstName",
    },
  });
  const { dirtyFields } = useFormState({
    control,
  });
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName")} placeholder="First Name" />
      {dirtyFields.firstName && <p>Field is dirty.</p>}

      <input type="submit" />
    </form>
  );
}
```

## `ErrorMessage`

A simple component to render associated input's error message.

`npm install @hookform/error-message`

| Name      | Type                | Required                                        | Description                                                                     |
| :-------- | :------------------ | :---------------------------------------------- | :------------------------------------------------------------------------------ |
| `name`    | `string`            | ✓                                               | Name of the field.                                                              |
| `errors`  | `object`            |                                                 | `errors` object from React Hook Form. Optional if you are using `FormProvider`. |
| `message` | `string             | React.ReactElement`                             |                                                                                 |
| `as`      | `React.ElementType  | string`                                         |                                                                                 |
| `render`  | `({ message: string | React.ReactElement, messages?: Object}) => any` |                                                                                 |

To apply:

```javascript
import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

export default function App() {
  const { register, formState: { errors }, handleSubmit } = useForm({
    criteriaMode "all"
  });
  const onSubmit = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("multipleErrorInput", {
          required: "This is required.",
          pattern: {
            value: /d+/,
            message: "This input is number only."
          },
          maxLength: {
            value: 10,
            message: "This input exceed maxLength."
          }
        })}
      />
      <ErrorMessage
        errors={errors}
        name="multipleErrorInput"
        render={({ messages }) =>
          messages &&
          Object.entries(messages).map(([type, message]) => (
            <p key={type}>{message}</p>
          ))
        }
      />

      <input type="submit" />
    </form>
  );
}
```

## `useFieldArray`

`({ control?: Control, name: string, keyName?: string = 'id' }) => object`

Custom hook for working with uncontrolled Field Arrays (dynamic inputs). The motivation is to provide better user experience and form performance.

Check the documentation for more [details](https://react-hook-form.com/api/usefieldarray).

## Advanced Strategies

Let's check some interesting ways we can work with `react-hook-form`:

### Smart Form Component

The idea is to easily compose our form with inputs, lets take the `Form` component:

```javascript
import React from "react";
import { Form, Input, Select } from "./Components";

export default function App() {
  const onSubmit = (data) => console.log(data);

  return (
    <Form onSubmit={onSubmit}>
      <Input name="firstName" />
      <Input name="lastName" />
      <Select name="gender" options={["female", "male", "other"]} />

      <Input type="submit" value="Submit" />
    </Form>
  );
}
```

Where `Form` is a wrapper that takes Children's and adds a `register` prop:

```javascript
import React from "react";
import { useForm } from "react-hook-form";

export default function Form({ defaultValues, children, onSubmit }) {
  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {React.Children.map(children, (child) => {
        return child.props.name
          ? React.createElement(child.type, {
              ...{
                ...child.props,
                register: methods.register,
                key: child.props.name,
              },
            })
          : child;
      })}
    </form>
  );
}
```

Where the `Input` and `Select`:

```javascript
import React from "react";

export function Input({ register, name, ...rest }) {
  return <input {...register(name)} {...rest} />;
}

export function Select({ register, options, name, ...rest }) {
  return (
    <select {...register(name)} {...rest}>
      {options.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}
```

With the `Form` component injecting `react-hook-form`'s `props` into the child component, you can easily create and compose complex forms in your app!

### Error Messages

Error messages are visual feedback to our users when there are issues with their inputs. React Hook Form provides an `errors` object to let you retrieve errors easily. There are several different ways to improve error presentation on the screen.

#### Register

You can simply pass the error message to `register`, via the `message` attribute of the validation rule object, like this:

`<input {...register('test', { maxLength: { value: 2, message: "error message" } })} /> `

#### Optional Chaining

The `?.` [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) operator permits reading the `errors` object without worrying about causing another error due to `null` or `undefined`.

`errors?.firstName?.message`

#### Lodash `get`

If your project is using [lodash](https://lodash.com/), then you can leverage the lodash `get` function. Eg:

`get(errors, 'firstName.message')`

### Connect Form

Use context to create a wrapper and share the data to deeply nested children's!

```javascript
import { FormProvider, useForm, useFormContext } from "react-hook-form";

export const ConnectForm = ({ children }) => {
  const methods = useFormContext();

  return children({ ...methods });
};

export const DeepNest = () => (
  <ConnectForm>
    {({ register }) => <input {...register("deepNestedInput")} />}
  </ConnectForm>
);

export const App = () => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form>
        <DeepNest />
      </form>
    </FormProvider>
  );
};
```

### `FormProvider` Performance

Avoid needless re-renders using when `react-hook-form` triggers a state update by memoizing the data:

```javascript
import React, { memo } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

// we can use React.memo to prevent re-render except isDirty state changed
const NestedInput = memo(
  ({ register, formState: { isDirty } }) => (
    <div>
      <input {...register("test")} />
      {isDirty && <p>This field is dirty</p>}
    </div>
  ),
  (prevProps, nextProps) =>
    prevProps.formState.isDirty === nextProps.formState.isDirty
);

export const NestedInputContainer = ({ children }) => {
  const methods = useFormContext();

  return <NestedInput {...methods} />;
};

export default function App() {
  const methods = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(methods.formState.isDirty); // make sure formState is read before render to enable the Proxy

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <NestedInputContainer />
        <input type="submit" />
      </form>
    </FormProvider>
  );
}
```

Check the [documentation for more strategies](https://react-hook-form.com/advanced-usage).

## Conclusion

Today we learned a very powerful library that will help us handle forms much easier! I personally like the **smart form component** strategy where we create a Form wrapper that we pass the register as name to it, because personally passing an object props spread into the input is not visually pleasing in the code.

See you on the next post.

Sincerely,

**End. Adrian Beria**
