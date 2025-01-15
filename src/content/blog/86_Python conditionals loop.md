---
title: "Learning Python: Conditional statements and loops"
description: "This article we will go through learning the conditional (if/while) statements and loops in Python"
category: ["python"]
pubDate: "2025-01-14"
published: true
---

## Table of contents

# Introduction

Conditional statements and loops are fundamental components in programming that allow code to execute differently based on specific conditions or to repeat tasks. In Python, these elements are crucial for creating dynamic and responsive applications. This article will delve into the world of conditional statements and loops, providing real-life examples to illustrate their usage.

# Conditional Statements

Conditional statements in Python include `if`, `elif`, and `else` statements. These statements enable your program to make decisions based on conditions.

## **If Statement**

The `if` statement is the simplest form of a conditional statement. It executes a block of code if the given condition is true.

```python
age = 20
if age >= 18:
    print("Eligible to vote.")
```

## **If-Else Statement**

The `if-else` statement allows you to specify a block of code that will execute if the condition associated with the `if` statement evaluates to `False`.

```python
age = 10
if age >= 18:
    print("Eligible to vote.")
else:
    print("Not eligible to vote.")
```

## **If-Elif-Else Statement**

This statement allows you to handle multiple conditions. It checks each condition in order and executes the corresponding block of code if a condition is true.

```python
choice = 'b'
if choice == 'a':
    print("You chose 'a'.")
elif choice == 'b':
    print("You chose 'b'.")
elif choice == 'c':
    print("You chose 'c'.")
else:
    print("Invalid choice.")
```

## **Ternary Operator (Short-Hand If-Else)**

The ternary operator is a concise way to write a single-line `if-else` statement.

```python
age = 20
status = "Eligible to vote" if age >= 18 else "Not eligible to vote"
print(status)
```

# Loops

Loops in Python allow you to repeat a block of code until a specific condition is satisfied. There are two primary types of loops: `for` loops and `while` loops.

## **For Loop**

A `for` loop iterates over a sequence (like a list, tuple, or string) and executes the loop body for each item in the sequence.

```python
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(f"I love eating {fruit}.")
```

## **While Loop**

A `while` loop continues to execute a block of code as long as a given condition is true.

```python
x = 0
while x < 5:
    print(x)
    x += 1
```

## Range

The `range()` function generates a sequence of numbers that can be used in a for loop. This is particularly useful when you need to iterate over a sequence of numbers

```python
# Example: Printing numbers from 0 to 4
for i in range(5):
    print(i)

# Example: Printing numbers from 1 to 5
for i in range(1, 6):
    print(i)

# Example: Printing numbers from 0 to 8 with a step of 2
for i in range(0, 9, 2):
    print(i)
```

# Real-Life Examples

## **Example 1: Banking System**

Imagine a banking system that checks if a user has sufficient funds to perform a transaction.

```python
def check_balance(amount, balance):
    if amount <= balance:
        print("Transaction successful.")
        return balance - amount
    else:
        print("Insufficient funds.")
        return balance

balance = 1000
new_balance = check_balance(500, balance)
print(f"New balance: {new_balance}")
```

## **Example 2: Student Grades**

A program that determines a student's grade based on their score.

```python
def determine_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

score = 85
grade = determine_grade(score)
print(f"Grade: {grade}")
```

## **Example 3: Shopping Cart**

A shopping cart system that applies discounts based on the total cost.

```python
def apply_discount(total_cost):
    if total_cost > 100:
        discount = total_cost * 0.1
        return total_cost - discount
    else:
        return total_cost

total_cost = 120
final_cost = apply_discount(total_cost)
print(f"Final cost after discount: {final_cost}")
```

# Conclusion

Conditional statements and loops are essential tools in programming in general, allowing you to create dynamic and interactive applications. Whether you're developing a simple calculator or a complex banking system, understanding how to use conditionals and loops will significantly enhance your programming skills.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
