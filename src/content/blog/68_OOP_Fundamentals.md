---
title: "[Roadmap_OOP] 1_JavaScript Fundamentals"
description: "Let us talk Object Oriented Programming in Javascript and define our roadmap to learn"
category: ["node", "oop"]
pubDate: "2024-04-12T09:00:00-04:00"
published: true
---

## Table of content

# Introduction

Here's a quick rundown of the foundational OOP concepts in JavaScript:

**1. Objects:**

- **What:** Blueprints for creating data structures. They hold properties (data) and methods (functions that operate on the data).
- **Example:** A `Person` object might have properties like `name` and `age` and a method called `greet()`.

**2. Classes:**

- **What:** Templates that define the structure of objects. They act like blueprints specifying the properties and methods objects of that class will have.
- **Example:** A `Person` class might define the `constructor` to set up `name` and `age` properties, and a `greet()` method for introductions.

**3. Inheritance:**

- **What:** A way to create new classes (subclasses) that inherit properties and methods from existing classes (superclasses). Promotes code reusability.
- **Example:** A `Student` class might inherit from a `Person` class, adding specific properties like `enrolledCourses`.

**4. Encapsulation:**

- **What:** The practice of bundling data (properties) and methods together within an object, potentially restricting direct access to some properties. Promotes data protection and controlled modification.
  - JavaScript doesn't have strict enforcement mechanisms like private or public keywords, but you can achieve a similar effect using conventions (like starting property names with underscores).

**5. Polymorphism:**

- **What:** The ability of objects of different classes to respond to the same method call in different ways. Enables flexible and dynamic behavior.
  - JavaScript can achieve polymorphism through function overriding in subclasses, where they redefine inherited methods with specialized behavior.

These are the core concepts of OOP in JavaScript. While JavaScript has its own way of implementing them compared to stricter OOP languages, understanding these principles will help you write more organized, reusable, and maintainable code.

# Objects

In JavaScript, objects are fundamental for structuring data and organizing code. They act as blueprints for creating more complex entities and are essential for object-oriented programming (OOP).

Here's a breakdown of key concepts about objects in JavaScript:

**What are Objects?**

- Objects are collections of properties.
- Each property has a key (name) and a value, which can be of any data type, including primitive types or even other objects.

**Creating Objects:**

- There are two main ways to create objects in JavaScript:

  1. **Object literal notation:** This is the most common way. You use curly braces `{}` to define key-value pairs.

  ```javascript
  let person = {
    name: "Alice",
    age: 30,
    greet: function () {
      console.log("Hello, my name is " + this.name);
    },
  };
  ```

  2. **`new Object()` constructor:** This method offers more flexibility but is less common in modern JavaScript.

  ```javascript
  let anotherPerson = new Object();
  anotherPerson.name = "Bob";
  anotherPerson.age = 25;
  ```

**Accessing Properties:**

- You can access object properties using dot notation (`.`) or bracket notation (`[]`).

  ```javascript
  console.log(person.name); // Output: "Alice"
  console.log(anotherPerson["age"]); // Output: 25
  ```

**Methods:**

- Objects can have methods, which are functions defined as properties. Methods are used to perform actions on the object's data.
- In the `person` object example, the `greet` property is a function that can be called to print a greeting message.

**Mutability:**

- Objects in JavaScript are mutable, meaning you can change their properties after they are created.

**Importance of Objects:**

- Objects are the foundation for building complex data structures in JavaScript.
- They allow you to model real-world entities and their relationships.
- By grouping data and behavior together, objects promote code organization and reusability.

# Classes

Classes in JavaScript provide a structured way to create objects. They act like blueprints that define the properties and methods that objects of a certain kind will share.

**Creating Classes:**

JavaScript uses the `class` keyword to define classes. Here's the basic syntax:

```javascript
class ClassName {
  // Constructor function (optional)
  constructor(argument1, argument2, ...) {
    // Initialize properties
    this.property1 = argument1;
    this.property2 = argument2;
    // ...
  }

  // Methods (functions defined inside the class)
  methodName(argument1, argument2, ...) {
    // Method implementation
  }
}
```

**Explanation:**

- `ClassName`: This is the name you give to your class. Choose a descriptive name that reflects the type of objects it creates.
- **Constructor Function (`constructor`):** This is a special method that is called automatically when you create a new object from the class. It's typically used to initialize the object's properties. The `this` keyword inside the constructor refers to the new object being created.
- **Methods:** These are functions defined inside the class that operate on the object's data. They can access and manipulate the object's properties.

**Example: Creating a Person Class**

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log("Hello, my name is " + this.name);
  }
}

// Creating objects (instances) of the Person class
let person1 = new Person("Alice", 30);
let person2 = new Person("Bob", 25);

person1.greet(); // Output: "Hello, my name is Alice"
person2.greet(); // Output: "Hello, my name is Bob"
```

**Key Points:**

- Classes provide a more organized way to create objects with similar properties and behaviors.
- The constructor helps ensure that objects created from the class are properly initialized.
- Methods allow you to define reusable functionalities specific to the objects of that class.

**Inheritance:**

JavaScript supports inheritance, which allows you to create new classes (subclasses) that inherit properties and methods from existing classes (superclasses). This promotes code reusability and helps organize complex object hierarchies.

# Inheritance

Inheritance is a fundamental concept in object-oriented programming (OOP) that allows you to create hierarchical relationships between classes. It's about code reusability and building upon existing functionality.

**Here's how inheritance works:**

- A **superclass** (also called parent class) defines a general set of properties and methods.
- A **subclass** (also called child class) inherits all the properties and methods from its superclass and can add its own specific properties and methods.

**Benefits of Inheritance:**

- **Code Reusability:** You don't need to rewrite common code for similar objects. The subclass inherits the functionality from the superclass.
- **Extensibility:** Subclasses can add new functionalities without modifying the superclass code.
- **Polymorphism:** Subclasses can override inherited methods to provide specialized behavior.

**JavaScript and Classes:**

JavaScript uses classes to create objects with blueprints. While it doesn't directly implement inheritance like Java or C++, it achieves a similar effect using prototypes. Here's how it works:

1. **Classes define the blueprint:** A class defines the properties and methods that objects of that class will have.
2. **`extends` keyword for inheritance:** The `extends` keyword is used in the subclass declaration to specify the superclass it inherits from.
3. **Prototype chain:** In JavaScript, objects are linked together through a prototype chain. When you create a new object from a class, it inherits the properties and methods from the class's prototype. The superclass prototype is then linked in the chain, allowing the subclass to access inherited properties and methods.

**Example: Inheritance with Shapes**

```javascript
class Shape {
  constructor(color) {
    this.color = color;
  }

  getArea() {
    // Implement area calculation for specific shapes (abstract in base class)
    throw new Error("getArea() is not implemented in Shape class!");
  }
}

class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color); // Call superclass constructor to inherit color
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }

  getArea() {
    return Math.PI * Math.pow(this.radius, 2);
  }
}

let rectangle = new Rectangle("red", 5, 4);
let circle = new Circle("blue", 3);

console.log(rectangle.getArea()); // Output: 20
console.log(circle.getArea()); // Output: 28.27...
```

In this example, `Shape` is the superclass defining the `color` property and a generic `getArea()` method. `Rectangle` and `Circle` inherit from `Shape`, adding their specific properties and overriding the `getArea()` method to calculate their respective areas.

Remember, while JavaScript uses prototypes for inheritance, the `class` syntax with `extends` makes it look more similar to traditional OOP languages.

# Encapsulation

Encapsulation in JavaScript's OOP context refers to the practice of bundling data (properties) and the methods that operate on that data within a single object. The goal is to potentially restrict direct access to some properties, promoting data protection and controlled modification.

**Key Points:**

- Unlike stricter OOP languages (Java, C++), JavaScript doesn't have built-in mechanisms like private or public keywords to enforce encapsulation.
- However, you can achieve a similar effect using conventions. A common practice is to start property names with underscores (`_`) to indicate they are meant for internal use and shouldn't be directly accessed from outside the object.

**Example: Bank Account with Encapsulation**

```javascript
class BankAccount {
  constructor(accountNumber, balance) {
    this._accountNumber = accountNumber; // Private property with underscore prefix
    this.balance = balance; // Public property (can be accessed directly)
  }

  deposit(amount) {
    if (amount > 0) {
      this.balance += amount;
    } else {
      console.error("Deposit amount must be positive");
    }
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
    } else {
      console.error("Insufficient funds or invalid withdrawal amount");
    }
  }

  // Getter method to provide controlled access to private account number
  get accountNumber() {
    return this._accountNumber.slice(3); // Maybe only reveal last 3 digits for security
  }
}

let account = new BankAccount(1234567890, 100);

// Direct access to private property (not recommended)
console.log(account._accountNumber); // Output: 1234567890 (full number exposed)

// Public method for deposit
account.deposit(50);
console.log(account.balance); // Output: 150

// Public method for withdrawal
account.withdraw(20);
console.log(account.balance); // Output: 130

// Accessing private property through getter method (recommended)
console.log(account.accountNumber); // Output: 7890 (only last 4 digits revealed)
```

**Explanation:**

- The `_accountNumber` property is prefixed with an underscore to indicate it's meant for internal use.
- While you can still access it directly from outside the class (not recommended), the getter method (`getAccountNumber`) provides a controlled way to retrieve a masked version of the account number (here, only showing the last 4 digits).
- Public methods like `deposit` and `withdraw` handle balance modifications while performing validations.

**Remember:**

- Encapsulation in JavaScript relies on conventions and doesn't have strict enforcement.
- It's still important to follow these conventions to promote better code organization and data protection.

# Polymorphism

Polymorphism in JavaScript's OOP context refers to the ability of objects from different classes to respond to the same method call in distinct ways. It allows for flexible and dynamic behavior in your code.

**Key Points:**

- JavaScript achieves polymorphism through a combination of:
  - **Method Overriding:** Subclasses can redefine methods inherited from a superclass to provide specialized behavior.
  - **Duck Typing:** JavaScript relies more on objects having the necessary properties and methods to fulfill a task, rather than strict type checking.

**Example: Animal Sounds with Polymorphism**

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  makeSound() {
    console.log("Generic animal sound");
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // Call superclass constructor
  }

  makeSound() {
    console.log(this.name + " barks!");
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
  }

  makeSound() {
    console.log(this.name + " meows!");
  }
}

let animals = [new Dog("Snoopy"), new Cat("Garfield"), new Animal("Unknown")];

function playSound(animal) {
  if (typeof animal.makeSound === "function") {
    // Duck Typing check
    animal.makeSound();
  } else {
    console.log("Animal doesn't have a makeSound method");
  }
}

for (let animal of animals) {
  playSound(animal);
}
```

**Explanation:**

1. The `Animal` class defines a generic `makeSound` method.
2. `Dog` and `Cat` inherit from `Animal` and override the `makeSound` method with their specific sounds.
3. The `playSound` function takes any animal object.
4. It uses duck typing to check if the object has a `makeSound` method (regardless of the class).
5. If the method exists, it's called, resulting in the appropriate sound based on the object's actual class (Dog or Cat).

**Benefits of Polymorphism:**

- Promotes code reusability: The base `makeSound` method can handle generic functionalities, while subclasses provide specialized behavior.
- Enables flexible design: You can add new classes with different `makeSound` implementations without modifying the `playSound` function.

**Remember:**

- Polymorphism in JavaScript is more dynamic than stricter OOP languages due to duck typing.
- It emphasizes having the necessary functionalities over strict type definitions.

# Conclusion

We have learned about the fundamental concepts in OOP for javascript, many of these concepts will be seen more in practice, but its important to be aware of them on a concept level to apply them in a more efficient manner.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
