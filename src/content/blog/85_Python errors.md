---
title: "Learning Python: Error handling"
description: "This article we will go through learning errors in Python. The pattern will be similar to other languages, but Python has ~30 types of errors, so we will take a dive at the most commonly used"
category: ["python"]
pubDate: "2025-01-11"
published: true
---

## Table of contents

# Introduction

Python, like any other programming language, is prone to errors. These errors can be categorized into several types, each indicating a different kind of problem in the code. In this article, we will delve into some of the most common Python errors, including **Syntax Errors**, **Indentation Errors**, **Type Errors**, **Name Errors**, **Zero Division Errors**, **Index Errors**, and **Attribute Errors**. We will also discuss how to handle these errors effectively.

Here is a list of all error types in case you need them:

https://www.tutorialsteacher.com/python/error-types-in-python

# Common Python Errors

## 1. **Syntax Errors**

- **Definition**: Syntax errors occur when the Python interpreter is unable to parse the code due to violations of Python language rules, such as incorrect indentation, keyword usage, or operator use.
- **Example**:
  ```python
  x = 10
  if x == 10
      print("x is 10")
  ```
  This will raise a `SyntaxError` because the `if` statement is missing a colon at the end.
- **Real-Life Example**: Imagine writing a script to automate tasks. A syntax error in the script could halt the entire automation process.

## 2. **Indentation Errors**

- **Definition**: Indentation errors occur when there is incorrect indentation in the code. Python uses indentation to define block-level structure.
- **Example**:
  ```python
  def greet(name):
  print("Hello, " + name)
  ```
  This will raise an `IndentationError` because the `print` statement is not indented correctly.
- **Real-Life Example**: In a large project, inconsistent indentation can lead to confusion and errors.

## 3. **Type Errors**

- **Definition**: Type errors occur when an operation or function is applied to an object of an inappropriate type.
- **Example**:
  ```python
  x = "10"
  y = 5
  z = x + y
  ```
  This will raise a `TypeError` because you cannot concatenate a string and an integer directly.
- **Real-Life Example**: In a web application, trying to perform arithmetic operations on user input without converting it to the appropriate type can lead to type errors.

## 4. **Name Errors**

- **Definition**: Name errors occur when the interpreter encounters a variable or function name that it cannot find in the current scope.
- **Example**:

  ```python
  def calculate_sum(a, b):
      total = a + b
      return total

  x = 5
  y = 10
  z = calculate_sum(x, w)
  ```

  This will raise a `NameError` because `w` is not defined.

- **Real-Life Example**: In a complex system, misspelling a variable name can lead to name errors.

## 5. **Zero Division Errors**

- **Definition**: Zero division errors occur when you divide a value by zero.
- **Example**:
  ```python
  x = 10 / 0
  ```
  This will raise a `ZeroDivisionError`.
- **Real-Life Example**: In a financial application, dividing by zero could occur if a denominator is not checked before division.

## 6. **Index Errors**

- **Definition**: Index errors occur when you try to access an index of a sequence (like a list or string) that is out of range.
- **Example**:
  ```python
  my_list = [1, 2, 3]
  print(my_list[3])
  ```
  This will raise an `IndexError` because the list only has indices 0, 1, and 2.
- **Real-Life Example**: In data processing, accessing an index that does not exist can halt the processing pipeline.

## 7. **Attribute Errors**

- **Definition**: Attribute errors occur when you try to access an attribute or method of an object that does not exist.
- **Example**:
  ```python
  my_string = "Hello"
  my_string.reverse()
  ```
  This will raise an `AttributeError` because strings do not have a `reverse()` method (though lists do).
- **Real-Life Example**: In a web scraper, trying to access a non-existent attribute of an HTML element can lead to attribute errors.

# Handling Errors in Python

Handling errors in Python is crucial for creating robust applications. The primary method of handling errors is using `try-except` blocks.

## **Try-Except Blocks**

```python
try:
    # Code that might raise an error
    x = 10 / 0
except ZeroDivisionError:
    # Handle the error
    print("Cannot divide by zero!")
```

## **Multiple Exceptions**

You can handle multiple exceptions in a single `except` block:

```python
try:
    # Code that might raise an error
    x = 10 / 0
except (ZeroDivisionError, TypeError):
    # Handle the errors
    print("An error occurred!")
```

## **Finally Block**

The `finally` block is executed regardless of whether an exception occurred:

```python
try:
    # Code that might raise an error
    x = 10 / 0
except ZeroDivisionError:
    # Handle the error
    print("Cannot divide by zero!")
finally:
    # Code to run regardless of errors
    print("Cleanup actions here.")
```

# Patterns to Handle Errors

Here are some patterns to handle errors effectively, along with examples:

## 1. **Catch and Re-Raise Exception**

- **Pattern**: Catch a specific exception, perform some actions, and then re-raise the exception to preserve the original traceback.
- **Example**:
  ```python
  def divide(x, y):
      try:
          result = x / y
      except ZeroDivisionError as e:
          print("Cannot divide by zero!")
          raise  # Re-raise the exception
  ```
- **Use Case**: Useful for logging or performing cleanup actions before allowing the exception to propagate.

## 2. **Raise New Exception from Original**

- **Pattern**: Catch an exception, raise a new one with a custom message, and include the original exception for traceback.
- **Example**:
  ```python
  def divide(x, y):
      try:
          result = x / y
      except ZeroDivisionError as e:
          raise ValueError("Cannot divide by zero!") from e
  ```
- **Use Case**: Helps in providing a more user-friendly error message while preserving the original error details.

## 3. **Catch and Handle**

- **Pattern**: Catch an exception and handle it without re-raising.
- **Example**:
  ```python
  def divide(x, y):
      try:
          result = x / y
      except ZeroDivisionError:
          print("Cannot divide by zero!")
          return None  # Handle the error without re-raising
  ```
- **Use Case**: Suitable when you want to gracefully recover from an error without propagating it further.

## 4. **Multiple Exceptions Handling**

- **Pattern**: Handle multiple types of exceptions differently.
- **Example**:
  ```python
  def process_data(data):
      try:
          # Process data
          result = data / 2
      except ZeroDivisionError:
          print("Cannot divide by zero!")
      except TypeError:
          print("Invalid data type!")
      except Exception as e:
          print(f"An unexpected error occurred: {e}")
  ```
- **Use Case**: Allows for flexible error handling based on the type of error encountered.

## 5. **Finally Block for Cleanup**

- **Pattern**: Use the `finally` block to perform cleanup actions regardless of whether an exception occurred.
- **Example**:
  ```python
  def read_file(filename):
      file = None
      try:
          file = open(filename, 'r')
          content = file.read()
      except FileNotFoundError:
          print(f"File {filename} not found.")
      finally:
          if file is not None:
              file.close()
  ```
- **Use Case**: Ensures resources like files are properly closed after use.

## 6. **Logging Errors**

- **Pattern**: Log errors for later analysis.
- **Example**:

  ```python
  import logging

  def divide(x, y):
      try:
          result = x / y
      except ZeroDivisionError as e:
          logging.error(f"Error dividing {x} by {y}: {e}")
          print("Cannot divide by zero!")
  ```

- **Use Case**: Helps in debugging and monitoring application health.

# Conclusion

Understanding and handling errors in Python is essential for developing reliable and robust applications. By recognizing the types of errors that can occur and using `try-except` blocks effectively, you can ensure that your programs run smoothly even when unexpected conditions arise. Whether it's a syntax error, type error, or any other kind of error, being prepared to handle them will make your code more resilient and maintainable, this applies to all programming languages though.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
