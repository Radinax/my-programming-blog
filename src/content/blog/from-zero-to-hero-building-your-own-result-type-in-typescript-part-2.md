---
title: "From Zero to Hero: Building Your Own Result Type in TypeScript – A Rust-Inspired Adventure - Part 2"
description: "Dive deeper into the world of Rust-inspired error handling in TypeScript. Building on the foundations laid in our previous post, we'll explore additional utility functions that take your error management to the next level. Join us on this coding journey as we continue to refine your TypeScript skills and make error handling a more elegant, robust, and enjoyable part of your development process."
category: ["typescript"]
pubDate: "2024-01-25"
published: false
---

Let's forge ahead, expanding our arsenal of utility functions for more effective work with Result types. We're on a mission to implement a subset of Rust's Result enum, enhancing our error-handling capabilities.

## Introducing 'Match': A Versatile Utility

In the Rust programming language, `match` is a formidable construct, akin to a `switch` statement but with a dose of steroids. Unfortunately, JavaScript doesn't yet offer native support for pattern matching [though there's an ongoing proposal](https://github.com/tc39/proposal-pattern-matching). Not to worry; we've got you covered. We'll craft our own `match` function tailored exclusively for Result types.

```ts
const match = <T, E, U>(
  result: Result<T, E>,
  onOk: (value: T) => U,
  onErr: (error: E) => U
): U => (result.ok ? onOk(result.value) : onErr(result.error));
```

`Match` is a cornerstone utility that will pave the way for several other functions we're about to introduce. It operates on a simple principle: given a `Result` and two functions, it executes and returns the `onOk` callback if the `Result` is an `Ok`, and likewise, it executes and returns the `onErr` callback if the `Result` is an `Err`. It's a straightforward yet powerful construct, enabling precise handling of success and error cases. Let's put it to use.

```ts
const result = whatever();

const number = match(
  result,
  (v) => v * 2,
  (err) => 0
);
```

In this example, when `result` contains an `Ok` value, we return the value multiplied by two. If it happens to be an `Err`, we gracefully return zero. With `match`, we've unlocked a world of flexibility and accuracy in handling `Result` types, setting the stage for even more powerful utility functions in our TypeScript journey.

## 'Map': Transforming 'Ok' with Precision

The `map` function is designed to work seamlessly with `Result` types. It takes a `Result` and a transformation function and applies the function if and only if the `Result` is `Ok.` The result of this operation is then wrapped in another `Result` and returned. If the `Result` is an `Err`, it remains unaltered.

```ts
const map = <T, E, U>(result: Result<T, E>, f: (value: T) => U): Result<U, E> =>
  match(
    result,
    (value) => Ok(f(value)),
    (error) => Err(error)
  );
```

## Example Usage:

```ts
const result1 = Ok(2);
const result2 = map(result, (value) => * 2); // Ok<4>;

const result3 = Err('Oh no');
const result4 = map(result3); // Err<'Oh no'>
```

The beauty of the `map` function lies in its ability to allow you to chain multiple operations, ensuring they are executed only if the initial `Result` is of type `Ok`. Any `Err` values are gracefully skipped in the process, enhancing the robustness and clarity of your error management. With `Map`, you gain the power to transform your `Ok` values while keeping `Err` values intact, thus making error handling in TypeScript a more intuitive and efficient process.

## 'mapOr': A Versatile Mapping Utility

The `mapOr` function takes a `Result` and two values or functions. If the `Result` is `Ok`, it applies the provided function to the `Ok` value and returns the result. If the `Result` is `Err`, it returns the default value without invoking any functions.

```ts
const mapOr = <T, E, U>(
  result: Result<T, E>,
  defaultValue: U,
  f: (value: T) => U
): U => match(result, f, () => defaultValue);
```

### Usage Example:

```ts
const result1 = Ok(2);
const result2 = mapOr(result1, 0, (value) => value * 2); // result2: 4

const result3 = Err("Oh no");
const result4 = mapOr(result3, 42, (value) => value * 2); // result4: 42
```

## 'mapOrElse': Precise Mapping with Flexibility

The `mapOrElse` function extends your mapping capabilities even further. It takes a `Result` and two functions. If the `Result` is `Ok`, it applies the `Ok` function to the `Ok` value. If it's `Err`, the `Err` function takes the stage and processes the error value.

```ts
const mapOrElse = <T, E, U>(
  result: Result<T, E>,
  onErr: (error: E) => U,
  onOk: (value: T) => U
): U => match(result, onOk, onErr);
```

### Usage Example:

```ts
const result1 = Ok(2);
const result2 = mapOrElse(
  result1,
  (error) => `Error: ${error}`,
  (value) => `Value: ${value}`
); // result2: 'Value: 2'

const result3 = Err("Oh no");
const result4 = mapOrElse(
  result3,
  (error) => `Error: ${error}`,
  (value) => `Value: ${value}`
); // result4: 'Error: Oh no'
```

## 'mapErr': Precise Error Transformation

The `mapErr` function is tailored for error transformation in `Result` types. It allows you to apply a function to the error value if the `Result` is `Err` producing a modified `Result` while leaving `Ok` values untouched.

```ts
const mapErr = <T, E, F>(
  result: Result<T, E>,
  f: (error: E) => F
): Result<T, F> =>
  match(
    result,
    (value) => Ok(value),
    (error) => Err(f(error))
  );
```

### Usage Example:

```ts
const result1 = Ok(2);
const result2 = mapErr(result1, (error) => `Error: ${error}`); // result2: Ok<2>

const result3 = Err("Oh no");
const result4 = mapErr(result3, (error) => `Error: ${error}`); // result4: Err<'Error: Oh no'>
```

## Wrapping Up

As we wrap up this second installment of our exploration into Rust-inspired error handling in TypeScript, we've uncovered a collection of invaluable utility functions that have already started to revolutionize the way we manage errors. `Match`, `Map`, `mapOr` and `mapOrElse` have proven to be powerful additions to our toolkit, enhancing our precision and flexibility in handling `Result` types.

But our journey doesn't end here. In our next blog post, we're about to embark on a thrilling adventure where we'll unveil an array of additional utility functions, each designed to address specific aspects of error management. From `mapErr` for error transformation to other ingenious tools, we'll continue to refine our error-handling practices in TypeScript.

Join us in the next installment as we expand our coding horizons, ensuring that error management in your TypeScript projects becomes even more efficient and enjoyable. Stay tuned for the third chapter in our journey!

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
