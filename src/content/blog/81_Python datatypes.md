---
title: "Learning Python: Datatypes"
description: "This article we will go through learning the datatypes of Python"
category: ["python"]
pubDate: "2025-01-05"
published: true
---

## Table of contents

# Introduction to Data types

In computer science and computer programming, a data type or simply type is a classification of data which tells the compiler or interpreter how the programmer intends to use the data. Most programming languages support various types of data, for example: real, integer or Boolean. A data type provides a set of values from which an expression (i.e. variable, function...) may take its values. This data type defines the operations that can be done on the data, the meaning of the data, and the way values of that type can be stored. A type of value from which an expression may take its value

# Variables

Variables are nothing but reserved memory locations to store values. It means that when you create a variable, you reserve some space in the memory.

Based on the data type of a variable, the interpreter allocates memory and decides what can be stored in the reserved memory. Therefore, by assigning different data types to the variables, you can store integers, decimals or characters in these variables.

## Assigning Values to Variables

Python variables do not need explicit declaration to reserve memory space. The declaration happens automatically when you assign a value to a variable. The equal sign (=) is used to assign values to variables.

The operand to the left of the = operator is the name of the variable and the operand to the right of the = operator is the value stored in the variable.

For example-

```python
counter = 100

miles = 1000.0

name = "John"

print (counter)

print (miles)

print (name)
```

Here, 100, 1000.0 and "John" are the values assigned to counter, miles, and name variables, respectively. This produces the following result -

```
100

1000.0

John
```

## Multiple Assignment

Python allows you to assign a single value to several variables simultaneously.

For example-

```python
a=b=c=1
```

Here, an integer object is created with the value 1, and all the three variables are assigned to the same memory location. You can also assign multiple objects to multiple variables.

For example-

```python

a, b, c = 1, 2, "john"
```

Here, two integer objects with values 1 and 2 are assigned to the variables a and b respectively, and one string object with the value "john" is assigned to the variable c.

# Standard Data Types

The data stored in memory can be of many types. For example, a person's age is stored as a numeric value and his or her address is stored as alphanumeric characters. Python has various standard data types that are used to define the operations possible on them and the storage method for each of them.

Python has five standard data types-

- Numbers
- String
- List
- Tuple
- Dictionary

# Python Numbers

Number data types store numeric values. Number objects are created when you assign a value to them. For example-

```python
var1 = 1

var2 = 10
```

You can also delete the reference to a number object by using the del statement. The syntax of the del statement is −

```python
del var1\[,var2\[,var3\[....,varN]]]]
```

You can delete a single object or multiple objects by using the del statement.

For example-

```python
del var

del var_a, var_b
```

Python supports three different numerical types -

- int (signed integers)
- float (floating point real values)
- complex (complex numbers)

All integers in Python 3 are represented as long integers. Hence, there is no separate number type as long.

## Python Strings

Strings in Python are identified as a contiguous set of characters represented in the quotation marks. Python allows either pair of single or double quotes. Subsets of strings can be taken using the slice operator (\[ ] and \[:] ) with indexes starting at 0 in the beginning of the string and working their way from -1 to the end.

The plus (+) sign is the string concatenation operator and the asterisk (\*) is the repetition operator. For example-

```python
str = 'Hello World!'

print (str)

print (str\[0])

print (str\[2:5])

print (str\[2:])

print (str \* 2)

print (str + "TEST")
```

This will produce the following result-

```
Hello World!

H

llo

llo World!

Hello World!Hello World!

Hello World!TEST
```

## Python Lists

Lists are the most versatile of Python's compound data types. A list contains items separated by commas and enclosed within square brackets (\[]). To some extent, lists are similar to arrays in C. One of the differences between them is that all the items belonging to a list can be of different data type.

The values stored in a list can be accessed using the slice operator (\[ ] and \[:]) with indexes starting at 0 in the beginning of the list and working their way to end -1. The plus (+) sign is the list concatenation operator, and the asterisk (\*) is the repetition operator. For example-

```python
list = \[ 'abcd', 786 , 2.23, 'john', 70.2 ]

tinylist = \[123, 'john']

print (list)

print (list\[0])

print (list\[1:3])

print (list\[2:])

print (tinylist \* 2)

print (list + tinylist)
```

This produces the following result-

```
\['abcd', 786, 2.23, 'john', 70.200000000000003]

abcd

\[786, 2.23]

\[2.23, 'john', 70.200000000000003]

\[123, 'john', 123, 'john']

\['abcd', 786, 2.23, 'john', 70.200000000000003, 123, 'john']
```

## Python Tuples

A tuple is another sequence data type that is similar to the list. A tuple consists of a number of values separated by commas. Unlike lists, however, tuples are enclosed within parenthesis.

The main difference between lists and tuples is- Lists are enclosed in brackets ( \[ ] ) and their elements and size can be changed, while tuples are enclosed in parentheses ( ( ) ) and cannot be updated. Tuples can be thought of as read-only lists. For example-

```python
tuple = ( 'abcd', 786 , 2.23, 'john', 70.2 )

tinytuple = (123, 'john')

print (tuple)

print (tuple\[0])

print (tuple\[1:3])

print (tuple\[2:])

print (tinytuple \* 2)

print (tuple + tinytuple)
```

This produces the following result-

```
('abcd', 786, 2.23, 'john', 70.200000000000003)

abcd

(786, 2.23)

(2.23, 'john', 70.200000000000003)

(123, 'john', 123, 'john')

('abcd', 786, 2.23, 'john', 70.200000000000003, 123, 'john')
```

The following code is invalid with tuple, because we attempted to update a tuple, which is not allowed. Similar case is possible with lists -

```python
tuple = ( 'abcd', 786 , 2.23, 'john', 70.2 )

list = \[ 'abcd', 786 , 2.23, 'john', 70.2 ]

tuple\[2] = 1000

list\[2] = 1000
```

## Python Dictionary

Python's dictionaries are kind of hash-table type. They work like associative arrays or hashes found in Perl and consist of key-value pairs. A dictionary key can be almost any Python type, but are usually numbers or strings. Values, on the other hand, can be any arbitrary Python object.

Dictionaries are enclosed by curly braces ({ }) and values can be assigned and accessed using square braces (\[]). For example-

```python
dict = {}

dict\['one'] = "This is one"

dict\[2] = "This is two"

tinydict = {'name': 'john','code':6734, 'dept': 'sales'}

print (dict\['one'])

print (dict\[2])

print (tinydict)

print (tinydict.keys())

print (tinydict.values())
```

This produces the following result-

```
This is one

This is two

{'dept': 'sales', 'code': 6734, 'name': 'john'}

\['dept', 'code', 'name']

\['sales', 6734, 'john']
```

Dictionaries have no concept of order among the elements. It is incorrect to say that the elements are "out of order"; they are simply unordered.

## Data Type Conversion

Sometimes, you may need to perform conversions between the built-in types. To convert between types, you simply use the type-name as a function.

There are several built-in functions to perform conversion from one data type to another. These functions return a new object representing the converted value.

- **int(x \[,base]):** Converts x to an integer. The base specifies the base if x is a string.
- **float(x):** Converts x to a floating-point number.
- **complex(real \[,imag]) :** Creates a complex number.
- **str(x) :** Converts object x to a string representation.
- **repr(x) :** Converts object x to an expression string.
- **eval(str)** Evaluates a string and returns an object.
- **tuple(s) :** Converts s to a tuple.
- **list(s) :** Converts s to a list.
- **set(s) :** Converts s to a set.
- **dict(d) :** Creates a dictionary. d must be a sequence of (key,value) tuples.
- **frozenset(s) :** Converts s to a frozen set.
- **chr(x) :** Converts an integer to a character.
- **unichr(x) :** Converts an integer to a Unicode character.
- **ord(x) :** Converts a single character to its integer value.
- **hex(x) :** Converts an integer to a hexadecimal string.
- **oct(x) :** Converts an integer to an octal string.

# Conclusion

Here we went through the basics of the data types available in Python with some simple examples, while it would be nice to jump into projects, they proved a bit more complicated than I expected, so going through the basics slowly is the best strategy for now.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
