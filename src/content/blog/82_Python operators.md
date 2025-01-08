---
title: "Learning Python: Operators"
description: "This article we will go through learning the operators in Python. Some will be obvious but others will be quite unique for Python"
category: ["python"]
pubDate: "2025-01-06"
published: true
---

## Table of contents

# Operators

Operators are the constructs, which can manipulate the value of operands. Consider the expression 4 + 5 = 9. Here, 4 and 5 are called operands and + is called the operator.

## Types of Operator

Python language supports the following types of operators-

- Arithmetic Operators
- Comparison (Relational) Operators
- Assignment Operators
- Logical Operators
- Bitwise Operators
- Membership Operators
- Identity Operators

## Python Arithmetic Operators

Assume variable a holds the value 10 and variable b holds the value 21, then-

Operators and their description:-

- **+ Addition**

  Adds values on either side of the operator.

  example:-

```python
  a + b = 31
```

- **- Subtraction**

  Subtracts right hand operand from left hand operand.

  example:-

```python
  a - b = -11
```

- **\* Multiplication**

  Multiplies values on either side of the operator

  example:-

```python
  a \* b = 210
```

- **/ Division**

  Divides left hand operand by right hand operand

  example:-

```python
  b / a = 2.1
```

- **% Modulus**

  Divides left hand operand by right hand operand and returns remainder

  example:-

```python
  b%a=1
```

- **\*\* Exponent**

  Performs exponential (power) calculation on operators

  example:-

```python
  a\*\*b =10 to the power 20
```

- **//**

  Floor Division - The division of operands where the result is the quotient in which the digits after the decimal point are removed.

  example:-

```python
  9//2 = 4 and 9.0//2.0 = 4.0
```

## Python Comparison Operators

These operators compare the values on either side of them and decide the relation among them. They are also called Relational operators.

Assume variable `a` holds the value `10` and variable `b` holds the value `20`, then-

- **==**

  If the values of two operands are equal, then the condition becomes true.

  example:-

```python
  (a == b) is not true.
```

- **!=**

  If values of two operands are not equal, then condition becomes true.

  example:-

```python
  (a!= b) is true.
```

- **&gt;**

  If the value of left operand is greater than the value of right operand, then condition becomes true.

  example:-

```python
  (a > b) is not true.
```

- **&lt;**

  If the value of left operand is less than the value of right operand, then condition becomes true.

  example:-

```python
  (a < b) is true.
```

- **&gt;=**

  If the value of left operand is greater than or equal to the value of right operand, then condition becomes true.

  example:-

```python
  (a >= b) is not true.
```

- **&lt;=**

  If the value of left operand is less than or equal to the value of right operand, then condition becomes true.

  example:-

```python
  (a <= b) is true.
```

#### Python Assignment Operators

Assume variable `a` holds `10` and variable `b` holds `20`, then-

- **=**

  Assigns values from right side operands to left side operand

  example:-

```python
  c = a + b assigns value of a + b into c
```

- **+= Add AND**

  It adds right operand to the left operand and assign the result to left operand

  example:-

```python
  c += a is equivalent to c = c + a
```

- **-= Subtract AND**

  It subtracts right operand from the left operand and assign the result to left operand

  example:-

```python
  c -= a is equivalent to c = c - a
```

- **\*= Multiply AND**

  It multiplies right operand with the left operand and assign the result to left operand

  example:-

```python
  c \*= a is equivalent to c = c \* a
```

- **/= Divide AND**

  It divides left operand with the right operand and assign the result to left operand

  example:-

```python
  c /= a is equivalent to c = c / ac /= a is equivalent to c = c / a
```

- **%= Modulus AND**

  It takes modulus using two operands and assign the result to left operand

  example:-

```python
  c %= a is equivalent to c = c % a
```

- **\*\*= Exponent AND**

  Performs exponential (power) calculation on operators and assign value to the left operand

  example:-

```python
  c \*\*= a is equivalent to c = c \*\* a
```

- **//= Floor Division**

  It performs floor division on operators and assign value to the left operand

  example:-

```python
  c //= a is equivalent to c = c // a
```

## Python Bitwise Operators

Bitwise operator works on bits and performs bit-by-bit operation. Assume if `a = 60`; and `b = 13`; Now in binary format they will be as follows-

```python
a = 0011 1100

b = 0000 1101
```

\-----------------

```python
a&b = 0000 1100

a|b = 0011 1101

a^b = 0011 0001

~a = 1100 0011
```

Python's built-in function `bin()` can be used to obtain binary representation of an integer number.

The following Bitwise operators are supported by Python language-

- **& Binary AND**

  Operator copies a bit to the result, if it exists in both operands

  example:-

```python
  (a & b) (means 0000 1100)
```

- **| Binary OR**

  It copies a bit, if it exists in either operand.

  example:-

```python
  (a | b) = 61 (means 0011 1101)
```

- **^ Binary XOR**

  It copies the bit, if it is set in one operand but not both.

  example:-

```python
  (a ^ b) = 49 (means 0011 0001)
```

- **~ Binary Ones Complement**

  It is unary and has the effect of 'flipping' bits.

  example:-

```python
  (~a ) = -61 (means 1100 0011 in 2's complement form due to a signed binary number.
```

- **<< Binary Left Shift**

  The left operand’s value is moved left by the number of bits specified by the right operand.

  example:-

```python
  a << = 240 (means 1111 0000)
```

- **>> Binary Right Shift**

  The left operand’s value is moved right by the number of bits specified by the right operand.

  example:-

```python
  a >> = 15 (means 0000 1111)
```

## Python Logical Operators

The following logical operators are supported by Python language. Assume variable a holds True and variable b holds False then-

- **and Logical AND**

  If both the operands are true then condition becomes true.

  example:-

```python
  (a and b) is False.
```

- **or Logical OR**

  If any of the two operands are non-zero then condition becomes true.

  example:-

```python
  (a or b) is True.
```

- **not Logical NOT**

  Used to reverse the logical state of its operand.

  example:-

```python
  Not(a and b) is True.
```

## Python Membership Operators (IMPORTANT)

Python’s membership operators test for membership in a sequence, such as strings, lists, or tuples. There are two membership operators as explained below-

### **in**

Evaluates to true, if it finds a variable in the specified sequence and false otherwise.

- **Example 1**: Checking Membership in a List

```python
fruits = ['apple', 'banana', 'cherry']
print('apple' in fruits)  # Output: True
print('grape' in fruits)  # Output: False
```

- **Example 2**: Checking for a Substring in a String

```python
sentence = "The quick brown fox"
print("quick" in sentence)  # Output: True
print("slow" in sentence)   # Output: False
```

- **Example 3**: Checking Keys in a Dictionary

```python
user_info = {'name': 'Alice', 'age': 25}
print('name' in user_info)  # Output: True
print('email' in user_info) # Output: False
```

- **Example 4**: Checking for a Value in a Tuple

```python
numbers = (1, 2, 3, 4, 5)
print(3 in numbers)  # Output: True
print(6 in numbers)  # Output: False
```

- **Example 5**: Using `in` with Conditional Statements

```python
email = "[email protected]"
if "@" in email and email.endswith(".com"):
    print("This looks like a valid email address!")
else:
    print("Invalid email format.")
```

- **Example 6**: Function to Check for a Keyword

```python
def contains_keyword(text, keyword):
    return keyword in text

sentence = "Learning Python is fun!"
print(contains_keyword(sentence, "Python"))  # Output: True
print(contains_keyword(sentence, "python"))  # Output: False (case-sensitive)
```

### **not in**

The `not in` operator is used to check if a value does not exist within a sequence, such as a list, tuple, string, or dictionary. Here are a few examples of using the `not in` operator:

- **Example 1**: Checking Non-Membership in a List

```python
fruits = ['apple', 'banana', 'cherry']
print('grape' not in fruits)  # Output: True
print('apple' not in fruits)  # Output: False
```

- **Example 2**: Checking for a Non-Substring in a String

```python
sentence = "The quick brown fox"
print("slow" not in sentence)  # Output: True
print("quick" not in sentence) # Output: False
```

- **Example 3**: Checking Non-Keys in a Dictionary

```python
user_info = {'name': 'Alice', 'age': 25}
print('email' not in user_info) # Output: True
print('name' not in user_info)  # Output: False
```

- **Example 4**: Using `not in` with Conditional Statements

```python
email = "[email protected]"
if "@" not in email or not email.endswith(".com"):
    print("Invalid email format.")
else:
    print("This looks like a valid email address!")
```

## Python Identity Operators

Identity operators compare the memory locations of two objects. There are two Identity operators as explained below:

### **is**

The `is` operator check if two variables refer to the same object in memory. It does not check for equality of values but rather if both variables point to the same memory location. Here are some examples of using the `is` operator:

- **Example 1**: Comparing Variables with the Same Value

```python
a = 5
b = 5
print(a is b)  # Output: True (because of integer caching in Python)
c = 1000
d = 1000
print(c is d)  # Output: False (because integers larger than 256 are not cached)
```

- **Example 2**: Comparing Lists

```python
list1 = [1, 2, 3]
list2 = [1, 2, 3]
print(list1 is list2)  # Output: False (because they are different objects)
```

- **Example 3**: Comparing Strings

```python
str1 = "hello"
str2 = "hello"
print(str1 is str2)  # Output: True (because of string interning in Python)
```

- **Example 4**: Using `is` with None

```python
my_var = None
print(my_var is None)  # Output: True
```

- **Example 5**: Comparing Custom Objects

```python
class Person:
    def __init__(self, name):
        self.name = name

person1 = Person("Alice")
person2 = Person("Alice")
print(person1 is person2)  # Output: False (because they are different instances)
```

### **is not**

The `is not` operator in Python is used to check if two variables do not refer to the same object in memory. It is the opposite of the `is` operator. Here are some examples of using the `is not` operator:

- **Example 1**: Comparing Variables with the Same Value

```python
a = 5
b = 5
print(a is not b)  # Output: False (because of integer caching in Python)
c = 1000
d = 1000
print(c is not d)  # Output: True (because integers larger than 256 are not cached)
```

- **Example 2**: Comparing Lists

```python
list1 = [1, 2, 3]
list2 = [1, 2, 3]
print(list1 is not list2)  # Output: True (because they are different objects)
```

- **Example 3**: Comparing Strings

```python
str1 = "hello"
str2 = "hello".upper().lower()  # Creates a new string object
print(str1 is not str2)  # Output: True (because they are different objects)
```

- **Example 4**: Using `is not` with None

```python
my_var = "hello"
print(my_var is not None)  # Output: True
```

- **Example 5**: Comparing Custom Objects

```python
class Person:
    def __init__(self, name):
        self.name = name

person1 = Person("Alice")
person2 = Person("Alice")
print(person1 is not person2)  # Output: True (because they are different instances)
```

- **Example 6**: Conditional Statement

```python
my_var = "hello"
if my_var is not None:
    print("Variable is not None.")
else:
    print("Variable is None.")
```

## Python Operators Precedence

Python operators precedence defines the order in which operations are performed when multiple operators are present in an expression. This order is crucial for ensuring that expressions are evaluated correctly. Here's an overview of Python operator precedence:

## Precedence Order

Python operators are evaluated in the following order from highest to lowest precedence:

1. **Parentheses**: Expressions inside parentheses are evaluated first.
2. **Exponentiation** (`**`): Right-to-left associativity.
3. **Unary operators** (`+`, `-`, `~`, `not`): Right-to-left associativity.
4. **Multiplication and Division** (`*`, `/`, `//`, `%`): Left-to-right associativity.
5. **Addition and Subtraction** (`+`, `-`): Left-to-right associativity.
6. **Comparison operators** (`==`, `!=`, `>`, `<`, `>=` , `<=`): Left-to-right associativity.
7. **Logical operators** (`not`, `and`, `or`): `not` has the highest precedence among logical operators, followed by `and`, and then `or`.
8. **Assignment operators** (`=`, `+=`, `-=`, etc.): Right-to-left associativity.

## Examples

### Example 1: Arithmetic Operations

```python
# Multiplication has higher precedence than addition
print(10 + 5 * 3)  # Output: 25
# Equivalent to: print(10 + (5 * 3))
```

### Example 2: Using Parentheses

```python
# Parentheses override normal precedence
print((10 + 5) * 3)  # Output: 45
# Equivalent to: print(15 * 3)
```

### Example 3: Logical Operations

```python
# Logical operators are evaluated last
x = 5
y = 2
print(x * 5 >= 10 and y - 6 <= 20)
# First, perform arithmetic, then logical operations
```

### Example 4: Associativity

```python
# Left-to-right associativity for multiplication and division
print(10 / 2 * 3)  # Output: 15.0
# Equivalent to: print((10 / 2) * 3)
```

## Best Practices

- **Use Parentheses**: When in doubt about the order of operations, use parentheses to explicitly define the order.
- **Understand Associativity**: Know how operators with the same precedence are evaluated (e.g., left-to-right for most operators).

# Conclusion

We learned about operators in Python, they're very important to understand to properly create algorithms for the respective activities we want to do, they share a lot of similarities with Javascript overall, but what I liked the most were the `in` and `is`, they do seem very useful and we got to see some examples about how to apply them.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
