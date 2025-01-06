---
title: "Learning Python"
description: "This article we will go through about Python, learning how to create a class"
category: ["python"]
pubDate: "2024-12-29"
published: true
---

## Table of contents

# Introduction

For our data roadmap our first step is to learn Python, it shares several similarities with Javascript and other languages.

# Class

A class in Python serves as a blueprint for creating objects. It defines the attributes (data) and methods (functions) that the objects created from the class will have. Essentially, a class allows you to group related data and functions together, making your code more organized and reusable.

## Key Components of Classes

1. **Attributes**: These are variables defined within a class that hold data specific to an object. Attributes can be:

   - **Instance Attributes**: Unique to each instance of the class.
   - **Class Attributes**: Shared across all instances of the class.

2. **Methods**: Functions defined within a class that describe the behaviors of the objects. Methods typically operate on the attributes of the class[3][4].

3. **Constructor (`__init__` method)**: A special method used to initialize the attributes of an object when it is created. This method is automatically called when an object is instantiated from a class.

## Defining a Class

To define a class in Python, use the `class` keyword followed by the class name and a colon. The body of the class contains its attributes and methods:

```python
class ClassName:
    def __init__(self, attribute1, attribute2):
        self.attribute1 = attribute1
        self.attribute2 = attribute2

    def method_name(self):
        # method body
```

## Example: Creating a Simple Class

Here’s an example of defining a simple `Dog` class:

```python
class Dog:
    species = "Canine"  # Class attribute

    def __init__(self, name, age):
        self.name = name  # Instance attribute
        self.age = age    # Instance attribute

    def bark(self):  # Method
        return "Woof!"
```

In this example:

- `species` is a class attribute shared by all instances.
- `name` and `age` are instance attributes unique to each `Dog` object.
- The `bark` method defines behavior for `Dog` objects.

## Creating Objects from Classes

Once a class is defined, you can create objects (instances) of that class:

```python
my_dog = Dog("Buddy", 3)
print(my_dog.name)  # Output: Buddy
print(my_dog.bark())  # Output: Woof!
```

## Advantages of Using Classes

- **Encapsulation**: Classes bundle data and methods together, helping to keep code organized.
- **Reusability**: You can create multiple instances of a class without rewriting code.
- **Inheritance**: Classes can inherit attributes and methods from other classes, promoting code reuse and reducing redundancy

## Static and Class Methods in Python

In Python, both static methods and class methods are used to define functions that belong to a class rather than to an instance of that class. However, they serve different purposes and have distinct characteristics.

## Static Methods

**Definition**: A static method is a method that belongs to a class rather than its instances. It does not require an instance of the class to be called and does not have access to the instance (`self`) or class (`cls`) variables.

**Characteristics**:

- **No Access to Instance or Class State**: Static methods cannot modify or access the state of the class or its instances. They operate independently of any object.
- **Utility Functions**: They are often used for utility functions that perform a task in isolation, making them useful for operations that do not require data from an instance.

**Syntax**:
Static methods are defined using the `@staticmethod` decorator:

```python
class MyClass:
    @staticmethod
    def my_static_method(arg1, arg2):
        return arg1 + arg2
```

**Example**:

```python
class MathUtils:
    @staticmethod
    def add(x, y):
        return x + y

print(MathUtils.add(5, 3))  # Output: 8
```

## Class Methods

**Definition**: A class method is a method that receives the class itself as the first argument (`cls`). It can access and modify class state but cannot access instance-specific data.

**Characteristics**:

- **Access to Class State**: Class methods can modify class variables and call other class methods.
- **Alternative Constructors**: They are often used as alternative constructors for a class.

**Syntax**:
Class methods are defined using the `@classmethod` decorator:

```python
class MyClass:
    count = 0

    @classmethod
    def increment_count(cls):
        cls.count += 1
```

**Example**:

```python
class Counter:
    count = 0

    @classmethod
    def increment(cls):
        cls.count += 1

Counter.increment()
print(Counter.count)  # Output: 1
```

## Comparison of Static and Class Methods

| Feature               | Static Method            | Class Method                                |
| --------------------- | ------------------------ | ------------------------------------------- |
| Access to Instance    | No (no `self` parameter) | No (no access to instance variables)        |
| Access to Class State | No (no `cls` parameter)  | Yes (can modify class variables)            |
| Use Case              | Utility functions        | Alternative constructors or factory methods |
| Decorator             | `@staticmethod`          | `@classmethod`                              |

# Encapsulation

Encapsulation is a fundamental concept in object-oriented programming (OOP) that involves bundling data (attributes) and methods (functions) that operate on that data into a single unit, typically a class. This approach helps protect the integrity of the data by restricting direct access and modification from outside the class.

## Key Features of Encapsulation

1. **Data Hiding**: Encapsulation allows for the hiding of an object's internal state. This means that the attributes of a class can be made private or protected, preventing external code from directly accessing or modifying them. Instead, interactions with these attributes are performed through methods.

2. **Controlled Access**: By providing public methods (getters and setters), encapsulation enables controlled access to private data. This ensures that any changes to the data can be validated or processed appropriately.

3. **Modularity**: Encapsulation promotes modular programming by grouping related functionalities together within a class. This organization makes it easier to manage and maintain code.

## Types of Attributes in Encapsulation

In Python, encapsulation is implemented through access modifiers, which define the visibility of class members:

- **Public Members**: These are accessible from outside the class. By default, all members in Python are public unless specified otherwise.

- **Protected Members**: Indicated by a single underscore prefix (e.g., `_variable`), these members are intended to be accessed within the class and its subclasses but should not be accessed directly from outside.

- **Private Members**: Denoted by a double underscore prefix (e.g., `__variable`), these members are intended to be inaccessible from outside the class. Python uses name mangling to make private attributes harder to access from outside.

## Example of Encapsulation

Here’s an example that illustrates encapsulation using a `BankAccount` class:

```python
class BankAccount:
    def __init__(self):
        self.__balance = 0  # Private attribute

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
        else:
            print("Insufficient balance or invalid amount")

    def get_balance(self):
        return self.__balance  # Accessing private attribute through a method

# Usage
account = BankAccount()
account.deposit(1000)
account.withdraw(500)
print(account.get_balance())  # Output: 500
```

In this example:

- The `__balance` attribute is private, ensuring it cannot be accessed directly from outside the `BankAccount` class.
- The `deposit`, `withdraw`, and `get_balance` methods provide controlled access to modify and retrieve the balance.

# Inheritance

Inheritance is a core principle of object-oriented programming (OOP) in Python that allows a class (known as a child or derived class) to inherit attributes and methods from another class (known as a parent or base class). This mechanism promotes code reusability, modularity, and a hierarchical organization of classes.

## Examples

Let's take a look at its general syntax:

```python
class ParentClass:
    # Parent class code here
    pass

class ChildClass(ParentClass):
    # Child class code here
    pass
```

Now let's look at it in practice:

```python
class Animal:
    def speak(self):
        return "Animal speaks"

class Dog(Animal):  # Dog inherits from Animal
    def speak(self):  # Method overriding
        return "Dog barks"

# Creating an instance of Dog
my_dog = Dog()
print(my_dog.speak())  # Output: Dog barks
```

Here `Dog` inherits from the parent `Animal` class, now let's take a look at this one:

```python
class People:
    def __init__(self, name: str, age: int):
        self.name = name
        self.__age = age

    def hi(self):
        print("Hola "+ self.name)

    def get_age(self):
        return self.__age

    def __some(self):
        print("Something")

    @staticmethod
    def helloworld():
        print("Hola mundo")

    @classmethod
    def helloworld2(cls):
        print("Hola Mundo 2")
```

That would be the parent class, and the child would be:

```python
class Barman(People):
    pass
    def welcome(self):
        print("Bienvenido!")

adrian = Barman("Adrian", 30)
adrian.hi()
adrian.helloworld()
adrian.welcome()
```

Where we get as logs:

```plaintext
Hola Adrian
Hola mundo
Bienvenido!
```

## Inheritance with different constructor

In Python, while a class can only have one `__init__` constructor method, you can achieve the effect of multiple constructors through various techniques. This is particularly useful in inheritance scenarios where you want to initialize a child class differently based on the context or parameters passed.

Taking the same example above:

```python
class Student(People):
    def __init__(self, name, age, profession):
        super().__init__(name,age)
        self.profession = profession

adrian = Student("Adrian", 30, "Engineer")
adrian.hi()
adrian.helloworld()
print(adrian.profession)
```

We get as results:

```plaintext
Hola Adrian
Hola mundo
Engineer
```

Now the word `super()` is used to call methods from the parent class within a child class.

## Overwriting methods

Even though we can inherit methods from the parent, we can overwrite its behaviour:

```python
class Student(People):
    def __init__(self, name, age, profession):
        super().__init__(name,age)
        self.profession = profession

adrian = Student("Adrian", 30, "Engineer")
adrian.hi()
```

This is the same code as above, the `.hi()` method comes from the parent, so if we want to overwrite it:

```python
class Student(People):
    def __init__(self, name, age, profession):
        super().__init__(name,age)
        self.profession = profession
    def hi(self):
        print("Hi from children Student object, my name is " + self.name)

adrian = Student("Adrian", 30, "Engineer")
adrian.hi()
```

We get:

```plaintext
Hi from children Student object, my name is Adrian
```

Notice how even though we can overwrite it, we can still access the construct.

# Polymorphism

Allows objects of different types to be treated as objects of a common superclass. In Python, polymorphism enables flexibility and interactivity by allowing methods to be called on objects of various types, leading to different behaviors based on the object's actual type, let's check this in depth.

## Examples of Polymorphism

### 1. Function Polymorphism

Python functions can accept different types of arguments and behave accordingly. For example:

```python
def add(x, y, z=0):
    return x + y + z

print(add(2, 3))       # Output: 5
print(add(2, 3, 4))    # Output: 9
```

In this case, the `add` function can take either two or three parameters, demonstrating polymorphic behavior.

### 2. Class Polymorphism

Polymorphism also applies to classes and their methods. Consider the following example:

```python
class Bird:
    def fly(self):
        print("Some birds can fly")

class Sparrow(Bird):
    def fly(self):
        print("Sparrow flies")

class Ostrich(Bird):
    def fly(self):
        print("Ostriches cannot fly")

# Instantiate objects
sparrow = Sparrow()
ostrich = Ostrich()

# Polymorphic call
for bird in [sparrow, ostrich]:
    bird.fly()
```

Here, both `Sparrow` and `Ostrich` inherit from `Bird` and implement their own version of the `fly` method. The loop demonstrates polymorphism as it calls the appropriate method based on the actual object type.

### 3. Operator Polymorphism

Operators in Python also exhibit polymorphic behavior. For instance, the `+` operator can perform different operations depending on the operand types:

```python
num1 = 1
num2 = 2
print(num1 + num2)  # Output: 3 (addition)

str1 = "Python"
str2 = "Programming"
print(str1 + " " + str2)  # Output: Python Programming (concatenation)
```

### 4. Inheritance Polymorphism

Let's take the code we had before:

```python
class People:
    classname = "people"
    def __init__(self, name: str, age: int):
        self.name = name
        self.__age = age

    def hi(self):
        print("Hola "+ self.name)

    def get_age(self):
        return self.__age

    def some(self):
        print("Something")

    @staticmethod
    def helloworld():
        print("Hola undo")

    @classmethod
    def helloworld2(cls):
        print("Hola Mundo 2")

class Student(People):
    def __init__(self, name, age, profession):
        super().__init__(name,age)
        self.profession = profession

    def hi(self):
        print("Hi from children Student object")
```

If we create a function to target both `hi` methods, one being the original `People` and the other the one that was overwriten `Student`:

```python
def show(people):
    people.hi()

jhon = People("Jhon", 30)
adrian = Student("Adrian", 30, "Engineer")

show(jhon)
show(adrian)
```

We get:

```plaintext
Hola Jhon
Hi from children Student object
```

This means that Polymorphism is the capacity an object possess to behave differently using the same name.

## Benefits of Polymorphism

- **Code Reusability**: Polymorphism allows for writing more generic and reusable code.
- **Flexibility**: Systems become more flexible and can handle growth and change easily.
- **Maintainability**: Changes in one part of a system have minimal impact on other parts due to the abstraction provided by polymorphism.

# Abstract classes

Abstract classes serve as blueprints for other classes. They cannot be instantiated directly and are designed to define methods that must be implemented by subclasses. In Python, abstract classes are implemented using the `abc` (Abstract Base Classes) module, which provides the necessary infrastructure for defining these classes.

## Defining an Abstract Class

To define an abstract class in Python, you need to:

- Import `ABC` and `abstractmethod` from the `abc` module.
- Create a class that inherits from `ABC`.
- Use the `@abstractmethod` decorator to define any abstract methods.

## Examples

### Complete abstract method

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def make_sound(self):
        pass  # Abstract method with no implementation

    def sleep(self):
        print("The animal is sleeping.")  # Concrete method

class Dog(Animal):
    def make_sound(self):  # Implementing the abstract method
        return "Bark"

class Cat(Animal):
    def make_sound(self):  # Implementing the abstract method
        return "Meow"

# Creating instances of Dog and Cat
dog = Dog()
cat = Cat()

print(dog.make_sound())  # Output: Bark
print(cat.make_sound())  # Output: Meow
dog.sleep()              # Output: The animal is sleeping.
```

When we log this we get:

```plaintext
Bark
Meow
The animal is sleeping.
```

### Example with errors

Let's try another one:

```python
from abc import ABC, abstractmethod

class Drink(ABC):
    @abstractmethod
    def get_quantity(self):
        pass

beer = Drink()
```

If we run this we get an error `TypeError: Can't instantiate abstract class Drink with abstract methods get_quantity`, to properly use this `class` we need to instantiate it:

```python
from abc import ABC, abstractmethod

class Drink(ABC):
    @abstractmethod
    def get_quantity(self):
        pass

class Beer(Drink):
    def __init__(self, quantity):
        self.__quantity = quantity

beer = Beer(15)
```

We get another error, `TypeError: Can't instantiate abstract class Beer with abstract methods get_quantity`, so what's going on, the `get_quantity` from the parent class `Drink` needs us to **make a contract** with that method in order to use it:

```python
from abc import ABC, abstractmethod

class Drink(ABC):
    @abstractmethod
    def get_quantity(self):
        pass

class Beer(Drink):
    def __init__(self, quantity):
        self.__quantity = quantity

    def get_quantity(self):
        return self.__quantity

beer = Beer(15)
print(beer.get__quantity()) # OUTPUT: 15
```

Now it works!

### Abstract classes with concrete methods

Lets use the same example but adding a method that is not abstract, to the `Drink` class:

```python
from abc import ABC, abstractmethod

class Drink(ABC):
    @abstractmethod
    def get_quantity(self):
        pass

    def description(self):
        print("I'm a drink!")

class Beer(Drink):
    def __init__(self, quantity):
        self.__quantity = quantity

    def get_quantity(self):
        return self.__quantity

beer = Beer(15)
beer.description() # OUTPUT: I'm a drink!
```

Notice how we define a non-abstract method and we could access it from the children.

# Multiple inheritance

Its a feature that allows a class (the child class) to inherit attributes and methods from more than one parent class. This capability enables the creation of complex class hierarchies and promotes code reuse, making it easier to combine functionalities from different base classes into a single derived class.

## Syntax

```python
class Parent1:
    pass

class Parent2:
    pass

class Child(Parent1, Parent2):
    pass
```

## Examples

### Normal showcase of multiple inheritance

Let's see an example of a child inheriting from its mom and dad:

```python
class Father:
    def skills(self):
        return "Gardening, Cooking"

class Mother:
    def skills(self):
        return "Painting, Singing"

class Child(Father, Mother):
    def skills(self):
        father_skills = Father.skills(self)
        mother_skills = Mother.skills(self)
        return f"Child skills: {father_skills}, {mother_skills}, Dancing"

# Creating an instance of Child
child = Child()
print(child.skills())  # Output: Child skills: Gardening, Cooking, Painting, Singing, Dancing
```

### The order matters

If we slighly modify the code above, notice how `SecondChild` and `ThirdChild` parameters are sent backwards and when we check the output, its different. When we inherith from multiple parents, the first one that has an equal name to the second, will get the priority, since `SecondChild` Father was first, then it inherits `Gardening, Cooking`, while the `ThirdChild` Mother was first and it inherited `Painting, Singing` instead.

```python
class Father:
    def skills(self):
        print("Gardening, Cooking")

class Mother:
    def skills(self):
        print("Painting, Singing")


class SecondChild(Father, Mother):
    pass

class ThirdChild(Mother, Father):
    pass

# Creating an instance of Second Child
child_2 = SecondChild()
child_2.skills() # OUTPUT: Gardening, Cooking

# Creating an instance of Third Child
child_3 = ThirdChild()
child_3.skills() # OUTPUT: Painting, Singing
```

# Handling unknown variable quantity using \*args and \*\*kwargs

The `*args` (you can call it whatever you want) syntax in function definitions allows you to accept any number of positional arguments. When you use `*args`, all the extra positional arguments passed to the function are collected into a tuple (inmutable lists), which can then be processed within the function.

`**kwargs` is a powerful feature in Python that allows functions to accept a variable number of keyword arguments. This capability enhances the flexibility of function definitions by enabling them to handle named arguments dynamically. The `**` syntax before a parameter name in a function definition indicates that the function can accept any number of keyword arguments. These keyword arguments are collected into a **dictionary**, where the **keys** are the argument names and the **values** are the corresponding argument values

## Examples

### \*args

```python
def add(*numbers):
    total = 0
    for num in numbers:
        total += num
    return total

# Calling the add function with different numbers of arguments
print(add(3, 5))                # Output: 8
print(add(4, 5, 6, 7))          # Output: 22
print(add(1, 2, 3, 5, 6))       # Output: 17
```

### \*\*kwargs

```python
def print_kwargs(**kwargs):
    print(kwargs)

print_kwargs(name="Alice", age=30, city="New York") # OUTPUT: {'name': 'Alice', 'age': 30, 'city': 'New York'}
```

Let's do another example

```python
def describe_pet(pet_name, **kwargs):
    description = f"Pet Name: {pet_name}\n"
    for key, value in kwargs.items():
        description += f"{key.capitalize()}: {value}\n"
    return description

# Calling the function with various keyword arguments
print(describe_pet("Buddy", species="Dog", age=5, color="Brown"))
```

Where the output is:

```plaintext
Pet Name: Buddy
Species: Dog
Age: 5
Color: Brown
```

### Combining both \*args and \*\*kwargs

You can use both `*args` (for positional arguments) and `**kwargs` (for keyword arguments) in the same function. However, when doing so, `*args` must be defined before `**kwargs`.

```python
def mixed_arguments(arg1, arg2, *args, **kwargs):
    print(f"arg1: {arg1}, arg2: {arg2}")
    print(f"Additional positional arguments: {args}")
    print(f"Keyword arguments: {kwargs}")

mixed_arguments(1, 2, 3, 4, name='Alice', age=30)
```

And the output is:

```plaintext
arg1: 1, arg2: 2
Additional positional arguments: (3, 4)
Keyword arguments: {'name': 'Alice', 'age': 30}
```

# Summary

Classes in Python provide a powerful way to model real-world entities by encapsulating data and behavior into reusable components. Understanding how to define classes, create objects, and utilize methods is essential for effective programming in Python. This is helpful for code organization but also simplifies complex programming tasks by promoting modularity and reusability which is key in programming.

Static and class methods provide flexibility in how you structure your classes in Python. Use static methods for functionality that does not depend on instance or class data, while class methods are suitable for operations that need to interact with the class itself.

Encapsulation is a crucial aspect of object-oriented programming in Python, promoting better data management and integrity through controlled access to class attributes and methods.

Inheritance enhances code organization and reusability, allowing classes to inherit attributes and methods from other classes, it facilitates the establishment of a logical relationship between different classes, making it easier to manage complex systems.

Polymorphism promotes efficiency and simplicity by allowing different classes to define methods with the same name but with different implementations, developers can write more flexible, maintainable, and scalable code.

The `**kwargs` feature in Python provides significant flexibility for defining functions that need to handle varying numbers of keyword arguments. By allowing functions to accept named parameters dynamically, developers can create more versatile and maintainable code. Understanding how to effectively use `**kwargs`, along with its counterpart `*args`, is essential for mastering function definitions in Python.

# Conclusion

We learned about Python on this first post about it! It does share a lot of similarities with other languages and its dynamic ways with `*args` and `*kwargs` is very interesting, but this was more of a theoric class, in the next post we will do a project with Python to get a feel on how it works from a practical point of view.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
