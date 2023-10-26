---
title: 'From Zero to Hero: Building Your Own Result Type in TypeScript – A Rust-Inspired Adventure'
description: "In this blog post, we'll explore the creation of a custom Result type in TypeScript, drawing inspiration from Rust's error-handling approach. Learn how to elegantly manage errors and successes in your code, enhancing the reliability of your TypeScript projects while following a Rust-inspired path."
category: typescript
pubDate: '2023-10-26'
published: true
---

JavaScript, with its error-handling methods like throwing and try/catch blocks, often lacks an elegant and robust way to manage errors. If these conventional approaches don't quite align with your preferences, then you're not alone. However, Rust, with its Result enum, offers a clean and definitive way to handle errors. In Rust, everything boils down to two distinct states: success or failure. This clarity in handling errors is not just satisfying; it's a safer, more disciplined way to write code.

In this journey, we'll explore implementing a similar error-handling mechanism in TypeScript. But we won't stop at just mimicking Rust; we'll take a more functional approach and provide you with a set of utilities that make working with these types a breeze.

Our first step is to model the possible states in TypeScript, setting the foundation for our error-handling adventure:

```ts
type Ok<T> = { ok: true; value: T };
type Err<E> = { ok: false; error: E };
type Result<T, E> = Ok<T> | Err<E>;
```

Here, we've introduced two states: Ok and Err, with Result representing the union of these two. This means that it can be either one or the other, compelling you, the developer, to handle both scenarios before proceeding with your code. This simple yet powerful construct enables precise error management.

Imagine you're incorporating a third-party library into your project, and its documentation provides the following function signature: `function fetchQuote(): Promise<string>`. On the surface, it appears fine, but here's the catch – this function might throw an error during execution, particularly when it involves network requests.

The typical scenario is that developers might forget to wrap the function call in a try/catch block, leading to potential application crashes when errors occur. And even if a try/catch block is used, it often lacks details about the nature of the error. Now, consider an alternative approach: `function fetchQuote(): Result<string, FetchQuoteError>`.

With this approach, you gain the power of the Result type, which not only ensures error handling but also provides specific error information, improving the robustness and reliability of your TypeScript applications.

Continuing our exploration, it's essential to recognize that obscure errors are not exclusive to asynchronous operations. Consider this synchronous example:

```ts
function whatever(): number {
  const n = Math.random();
  if (n > 0.5) {
    throw new Error('Something went really wrong here');
  }
  return n;
}
```

Imagine you're using the `whatever` function from an NPM package. You're feeling confident because TypeScript, ESLint, and your IDE give no indication of any issues – it seems like smooth sailing. However, there's a catch: this function might fail during execution, and you have no way of anticipating it.

Now, let's introduce a Result-based approach:

```ts
function whatever(): Result<number, string> {
  const n = Math.random();
  if (n > 0.5) {
    return { ok: false, error: 'Something went really wrong here' };
  }
  return { ok: true, value: n };
}
```

The difference is striking. With this transformation, you can call the function with confidence. In the success case, you'll receive a number; in the error case, a string. This function will now never fail without you being fully aware of it. Your code becomes more robust, and your applications become more reliable.

By implementing a Result type inspired by Rust, you're not just handling errors; you're transforming the way you approach error management in TypeScript, ensuring that even the most cryptic issues are brought to light. It's a powerful paradigm shift that leads to more resilient and dependable code.

Let's delve even deeper into this newfound paradigm and see how it translates into actual code:

```ts

const result = whatever();

if (result.ok) {
  // Inside this block, you have access to `result.value`.
  console.log(result.value);
} else {
  // In this block, you don't have `result.value`, but you do have `result.error`.
  console.error(result.error);
}
```

The magic here lies in TypeScript's ability to understand the shared field `ok` within our Result type, serving as a discriminator between `Ok` and `Err`. When you're inside the `if (result.ok)` branch, TypeScript knows that you should have access to `result.value`. Conversely, if `result.ok` is false, you'll have access to `result.error`. The beauty of this approach is that it enforces the handling of both cases, ensuring your code is comprehensive and resilient.

Now, you might be thinking, "But now I have to return objects with an `ok` key everywhere!" You're absolutely correct, and that's where our utilities come into play to enhance your developer experience:

```ts

const Ok = <T>(value: T): Ok<T> => ({ ok: true, value });
const Err = <E>(error: E): Err<E> => ({ ok: false, error });

const isOk = <T, E>(result: Result<T, E>): reuslt is Ok<T> => result.ok;
const isErr = <T, E>(result: Result<T, E>): result is Err<E> => !result.ok;
```

With these utilities, you can refactor your whatever function:

```ts
function whatever(): Result<number, string> {
  const n = Math.random();
  if (n > 0.5) {
    return Err('Something went really wrong here');
  }
  return Ok(n);
}

const result = whatever();

if (isOk(result)) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

This refactoring not only makes your code cleaner but also introduces explicit functions for creating `Ok` and `Err` cases, enhancing the readability of your code. Moreover, `isOk` and `isErr` are what TypeScript refers to as [type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates). In essence, a type guard informs the TypeScript compiler about the expected type, making your code not only safer but also more self-explanatory and maintainable.

As we conclude this transformative journey into the world of Rust-inspired error handling in TypeScript, you've taken the first steps towards writing more robust, reliable, and comprehensible code. By implementing the Result type and its accompanying utilities, you've paved the way for error management that's both elegant and precise.

But our adventure doesn't end here. In the next blog entry, we'll continue our exploration, creating even more utility functions to further enhance the utility and expressiveness of our error-handling mechanism. Join me as we delve deeper into this exciting world, unlocking new tools and strategies to take your TypeScript development to the next level. Together, we'll continue to make coding a more enjoyable and error-resistant experience. Stay tuned for the next chapter in our journey!
