---
title: "Learning Python: Functions"
description: "This article we will go through learning functions in Python. Here we will focus on the important parts and what is unique for functions here"
category: ["python"]
pubDate: "2025-01-08"
published: true
---

## Table of contents

# Functions

A function is a block of organized, reusable code that is used to perform a single, related action. Functions provide better modularity for your application and a high degree of code reusing.

As you already know, Python gives you many built-in functions like `print()`, etc. but you can also create your own functions. These functions are called user-defined functions.

# Defining a Function

Defining functions in Python is a crucial part of organizing and reusing code. Here's a comprehensive overview of how to define and use functions in Python:

## Basic Syntax

To define a function in Python, you use the `def` keyword followed by the function name and parameters in parentheses. The function body is indented under the function definition. Here's a basic example:

```python
def my_function():
    print("Hello, World!")

 Call the function
my_function()
```

## Components of a Function Definition

1. **`def` Keyword**: This keyword indicates that a function is being defined.
2. **Function Name**: A valid Python identifier that names the function.
3. **Parameters**: Optional arguments that are passed to the function, listed within parentheses.
4. **Colon (`:`)**: Marks the end of the function header.
5. **Function Body**: A block of Python statements that are executed when the function is called.

## Parameters and Arguments

- **Parameters** are placeholders for values that will be passed to the function.
- **Arguments** are the actual values passed to the function when it is called.

Example with parameters:

```python
def greet(name):
    print(f"Hello, {name}!")

# Call the function with an argument
greet("Alice")
```

## Return Statement

The `return` statement is used to exit the function and send a value back to the caller. If no `return` statement is provided, the function returns `None` by default.

```python
def multiply(a, b):
    return a * b

result = multiply(5, 6)
print(result)  # Output: 30
```

## Special Types of Parameters

- **Arbitrary Positional Arguments (`*args`)**: Allows a function to accept any number of positional arguments.
- **Arbitrary Keyword Arguments (`**kwargs`)\*\*: Allows a function to accept any number of keyword arguments.

Example with arbitrary positional arguments:

```python
def sum_numbers(first, *rest):
    return first + sum(rest)

print(sum_numbers(1, 2, 3, 4))  # Output: 10
```

Example with arbitrary keyword arguments:

```python
def print_kwargs(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_kwargs(name="John", age=30)
```

# Function Annotations (types)

These annotations are arbitrary Python expressions that are evaluated at compile time but do not affect the runtime behavior of the code. Instead, they provide additional information that can be used by third-party libraries, IDEs, and tools for static type checking, documentation, and other purposes.

```python
def greet(name: str) -> None:
    print(f"Hello, {name}!")
```

In this example:

- `name: str` annotates the `name` parameter as a string.
- `-> None` indicates that the function does not return any value.

## Accessing Annotations

Annotations are stored in the `__annotations__` attribute of the function, which returns a dictionary containing the annotations for each parameter and the return type.

```python
print(greet.__annotations__)
# Output: {'name': <class 'str'>, 'return': <class 'NoneType'>}
```

## Uses of Function Annotations

1. **Static Type Checking**: Tools like `mypy` use annotations to check the types of parameters and return values statically, helping catch type-related errors before runtime.
2. **Documentation**: Annotations can serve as a form of documentation, providing information about the expected types and behavior of functions.
3. **IDE Support**: Many IDEs use annotations to provide better code completion, inspection, and debugging capabilities.
4. **Third-Party Libraries**: Libraries can interpret annotations to provide additional functionality or validation.

## Examples

### Example 1: Basic Annotations

```python
def add(a: int, b: int) -> int:
    return a + b

print(add.__annotations__)
# Output: {'a': <class 'int'>, 'b': <class 'int'>, 'return': <class 'int'>}
```

### Example 2: Arbitrary Expressions

Annotations can be any valid Python expression, not just types.

```python
def total(x: 'marks in Physics', y: 'marks in Chemistry') -> int:
    return x + y

print(total.__annotations__)
# Output: {'x': 'marks in Physics', 'y': 'marks in Chemistry', 'return': <class 'int'>}
```

### Example 3: Annotations for Default Arguments

```python
def my_function(a: "physics", b: "Maths" = 20) -> int:
    return a + b

print(my_function.__annotations__)
# Output: {'a': 'physics', 'b': 'Maths', 'return': <class 'int'>}
```

# Anonymous Functions

Anonymous functions in Python, also known as **lambda functions**, are small, nameless functions defined using the `lambda` keyword. They are useful for short, one-time use operations and are often used as arguments to higher-order functions.

## Syntax

The syntax for a lambda function is as follows:

```python
lambda arguments : expression
```

- **`lambda` Keyword**: Used to define the anonymous function.
- **`arguments`**: Can be any number of arguments, similar to regular functions.
- **`expression`**: The operation that is performed on the arguments. Lambda functions are limited to a single expression.

## Examples

### Example 1: Simple Lambda Function

```python
# Define a lambda function that adds 10 to a number
add_ten = lambda x: x + 10
print(add_ten(5))  # Output: 15
```

### Example 2: Lambda with Multiple Arguments

```python
# Define a lambda function that multiplies two numbers
multiply = lambda a, b: a * b
print(multiply(5, 6))  # Output: 30
```

### Example 3: Using Lambda with Built-in Functions

Lambda functions are commonly used with built-in functions like `filter()`, `map()`, and `reduce()`.

```python
# Use lambda with filter() to get numbers greater than 29
numbers = [23, 45, 57, 39, 1, 3, 95, 3, 8, 85]
result = filter(lambda x: x > 29, numbers)
print(list(result))  # Output: [45, 57, 39, 95, 85]

# Use lambda with map() to cube each number
numbers = [1, 2, 3, 4, 5]
cubes = map(lambda x: x ** 3, numbers)
print(list(cubes))  # Output: [1, 8, 27, 64, 125]
```

## Advantages

- **Concise**: Lambda functions are compact and can be defined inline.
- **Efficient**: They are useful for short operations and can save time by reducing code verbosity.
- **Flexible**: Can be used as arguments to higher-order functions, making them versatile in various contexts.

## Use Cases

- **Data Processing**: Often used with `filter()`, `map()`, and `reduce()` for data manipulation.
- **Event Handling**: Can be used as event handlers in GUI applications or web frameworks.
- **Quick Operations**: Ideal for simple, one-time use operations where defining a full function would be unnecessary.

# Pass by Reference vs Value

All parameters (arguments) in the Python language are passed by reference. It means if you change what a parameter refers to within a function, the change also reflects back in the calling function.

Python's approach to passing arguments to functions is often misunderstood as either "pass by reference" or "pass by value." However, Python uses a mechanism known as "pass by object reference" or "pass by assignment," which combines elements of both but behaves uniquely.

## Pass by Value

In a strict "pass by value" system, a copy of the original value is passed to the function. Any changes made to the parameter inside the function do not affect the original data outside the function. Python behaves similarly for immutable objects like integers, floats, and strings.

**Example: Immutable Objects (Integers)**

```python
def call_by_value(x):
    x = x * 2
    print("Inside function: ", x)

num = 6
print("Before function call: ", num)
call_by_value(num)
print("After function call: ", num)
```

Output:

```
Before function call:  6
Inside function:  12
After function call:  6
```

## Pass by Reference

In a "pass by reference" system, a reference to the original data is passed to the function. Changes made to the parameter inside the function affect the original data outside the function. Python behaves similarly for mutable objects like lists and dictionaries.

**Example: Mutable Objects (Lists)**

```python
def call_by_reference(lst):
    lst.append("D")
    print("Inside function: ", lst)

my_list = ["E"]
print("Before function call: ", my_list)
call_by_reference(my_list)
print("After function call: ", my_list)
```

Output:

```
Before function call:  ['E']
Inside function:  ['E', 'D']
After function call:  ['E', 'D']
```

## Pass by Object Reference (Python's Approach)

Python's "pass by object reference" means that when you pass a variable to a function, you are passing a reference to the object (or value) the variable points to. However, this reference itself is passed by value. This means that if you reassign the parameter inside the function, it will not affect the original variable outside the function. But if you modify the object in place (e.g., append to a list), the changes will be reflected outside the function.

**Example: Reassigning vs Modifying**

```python
def modify_list(lst):
    # Modifying the list in place affects the original
    lst.append("D")
    print("Inside function (after append): ", lst)

    # Reassigning the list does not affect the original
    lst = ["New List"]
    print("Inside function (after reassign): ", lst)

my_list = ["E"]
print("Before function call: ", my_list)
modify_list(my_list)
print("After function call: ", my_list)
```

Output:

```
Before function call:  ['E']
Inside function (after append):  ['E', 'D']
Inside function (after reassign):  ['New List']
After function call:  ['E', 'D']
```

# Conclusion

Understanding functions in Python is crucial for writing efficient, modular, and maintainable code just like in Javascript (the focus of this blog). From defining basic functions to leveraging advanced features like function annotations and lambda functions (this is new to us), Python offers a versatile toolkit for developers. The distinction between "pass by reference" and "pass by value" is nuanced in Python, as it uses a "pass by object reference" model that combines elements of both. By mastering these concepts, developers can create robust applications that take advantage of Python's simplicity and flexibility. Whether you're working with data processing, event handling, or complex algorithms, Python's function capabilities provide a solid foundation for building scalable and reliable software solutions. As you continue to explore Python's capabilities, remember that functions are the building blocks of your code, and using them effectively will elevate your programming skills and enhance your projects' overall quality.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
