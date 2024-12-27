---
title: "Design Patterns in programming"
description: "In this article we will learn together about design patterns"
category: ["concept"]
pubDate: "2024-12-26"
published: true
---

## Table of content

# Introduction

Design patterns in programming are established solutions to common problems encountered in software design. They provide a template for building software applications and can significantly enhance code reusability, scalability, and maintainability. Design patterns are typically categorized into three main types: Creational, Structural, and Behavioral.

# Type of Design Patterns

## Creational Patterns

Creational patterns focus on the process of object creation, helping to control object instantiation in a flexible and efficient manner.

### Singleton Pattern

Ensures a class has only one instance and provides a global point of access to it.

This pattern is particularly useful in applications where global settings or configurations need to be managed consistently across different parts of the application, such as API endpoints, feature flags, or user preferences.

```javascript
const ConfigurationManager = (function () {
  let instance; // Private variable to hold the single instance

  function createInstance() {
    const config = {
      apiUrl: "https://api.example.com",
      apiKey: "12345-ABCDE",
      timeout: 5000,
      getConfig: function () {
        return {
          apiUrl: this.apiUrl,
          apiKey: this.apiKey,
          timeout: this.timeout,
        };
      },
      setConfig: function (newConfig) {
        this.apiUrl = newConfig.apiUrl || this.apiUrl;
        this.apiKey = newConfig.apiKey || this.apiKey;
        this.timeout = newConfig.timeout || this.timeout;
      },
    };
    return config;
  }

  return {
    getInstance: function () {
      if (!instance) {
        // Check if an instance already exists
        instance = createInstance(); // Create one if it doesn't
      }
      return instance; // Return the single instance
    },
  };
})();

// Usage
const config1 = ConfigurationManager.getInstance();
console.log(config1.getConfig()); // Outputs the initial configuration

// Update configuration
config1.setConfig({ apiUrl: "https://api.newexample.com", timeout: 10000 });

const config2 = ConfigurationManager.getInstance();
console.log(config2.getConfig()); // Outputs updated configuration

console.log("Same instance? " + (config1 === config2)); // Outputs: Same instance? true
```

### Factory Method Pattern

Defines an interface for creating an object but allows subclasses to alter the type of created objects.

Here's a practical example of the Factory Method design pattern in JavaScript, demonstrating how to create different types of vehicles (Car, Bike, Truck) based on user input.

```javascript
// Vehicle classes
class Car {
  constructor() {
    this.type = "Car";
    this.wheels = 4;
  }
  drive() {
    console.log("Driving a car with " + this.wheels + " wheels.");
  }
}

class Bike {
  constructor() {
    this.type = "Bike";
    this.wheels = 2;
  }
  drive() {
    console.log("Riding a bike with " + this.wheels + " wheels.");
  }
}

class Truck {
  constructor() {
    this.type = "Truck";
    this.wheels = 6;
  }
  drive() {
    console.log("Driving a truck with " + this.wheels + " wheels.");
  }
}

// Vehicle Factory
class VehicleFactory {
  static createVehicle(type) {
    switch (type) {
      case "car":
        return new Car();
      case "bike":
        return new Bike();
      case "truck":
        return new Truck();
      default:
        throw new Error("Vehicle type not recognized.");
    }
  }
}

// Usage
try {
  const vehicles = [];

  vehicles.push(VehicleFactory.createVehicle("car"));
  vehicles.push(VehicleFactory.createVehicle("bike"));
  vehicles.push(VehicleFactory.createVehicle("truck"));

  vehicles.forEach((vehicle) => vehicle.drive());
} catch (error) {
  console.error(error.message);
}
```

### Abstract Factory Pattern

Produces families of related or dependent objects without specifying their concrete classes.

This pattern is particularly useful in applications that require a consistent interface across different platforms or environments. For instance, when developing cross-platform applications, using an Abstract Factory allows developers to create UI components that match the look and feel of each operating system while keeping the client code clean and adaptable to changes in product implementations or additional platforms.

We will first create `Button` and `TextBox` as abstract classes that define the interface for products, then we extend these to create `WindowsButton`, `WindowsTextBox`, etc, which are implementations. Then using `UIComponentFactory` we define the methods for creating abstract products like `createButton` and `createTextBox`.

```javascript
// Abstract Product Interfaces
class Button {
  render() {
    throw new Error("This method should be overridden!");
  }
}

class TextBox {
  render() {
    throw new Error("This method should be overridden!");
  }
}

// Concrete Products for Windows
class WindowsButton extends Button {
  render() {
    console.log("Rendering a button in Windows style.");
  }
}

class WindowsTextBox extends TextBox {
  render() {
    console.log("Rendering a text box in Windows style.");
  }
}

// Concrete Products for macOS
class MacOSButton extends Button {
  render() {
    console.log("Rendering a button in macOS style.");
  }
}

class MacOSTextBox extends TextBox {
  render() {
    console.log("Rendering a text box in macOS style.");
  }
}

// Abstract Factory Interface
class UIComponentFactory {
  createButton() {
    throw new Error("This method should be overridden!");
  }

  createTextBox() {
    throw new Error("This method should be overridden!");
  }
}

// Concrete Factory for Windows
class WindowsFactory extends UIComponentFactory {
  createButton() {
    return new WindowsButton();
  }

  createTextBox() {
    return new WindowsTextBox();
  }
}

// Concrete Factory for macOS
class MacOSFactory extends UIComponentFactory {
  createButton() {
    return new MacOSButton();
  }

  createTextBox() {
    return new MacOSTextBox();
  }
}

// Client Code
function clientCode(factory) {
  const button = factory.createButton();
  const textBox = factory.createTextBox();

  button.render(); // Renders the button based on the factory
  textBox.render(); // Renders the text box based on the factory
}

// Usage
console.log("Client: Testing client code with Windows factory:");
clientCode(new WindowsFactory());

console.log("\nClient: Testing client code with macOS factory:");
clientCode(new MacOSFactory());
```

### Builder Pattern

Separates the construction of a complex object from its representation, allowing the same construction process to create different representations.

This is the most common pattern there is, where we will create a `User` object with various optional attributes like age, weight, address, and gender.

```javascript
// User class representing the final product
class User {
  constructor(name) {
    this.name = name;
    this.age = null;
    this.weight = null;
    this.address = null;
    this.gender = null;
  }

  printUser() {
    return `User: ${this.name}, Age: ${this.age}, Weight: ${this.weight}, Address: ${this.address}, Gender: ${this.gender}`;
  }
}

// Builder class for constructing User objects
class UserBuilder {
  constructor(name) {
    this.user = new User(name);
  }

  setAge(age) {
    this.user.age = age;
    return this; // Return the builder for method chaining
  }

  setWeight(weight) {
    this.user.weight = weight;
    return this; // Return the builder for method chaining
  }

  setAddress(address) {
    this.user.address = address;
    return this; // Return the builder for method chaining
  }

  setGender(gender) {
    this.user.gender = gender;
    return this; // Return the builder for method chaining
  }

  build() {
    if (!this.user.name) {
      throw new Error("Name is required");
    }
    return this.user; // Return the constructed User object
  }
}

// Usage
const userBuilder = new UserBuilder("John Doe")
  .setAge(30)
  .setWeight(180)
  .setAddress("123 Main St")
  .setGender("Male");

const user = userBuilder.build();
console.log(user.printUser()); // Outputs: User: John Doe, Age: 30, Weight: 180, Address: 123 Main St, Gender: Male
```

### Prototype Pattern

Creates new objects by copying an existing object, reducing the dependency on class types.

Lets take a shape example, where we create and clone them using a prototype object.

```javascript
// Base Shape Prototype
class Shape {
  constructor(type, color) {
    this.type = type || "Generic Shape";
    this.color = color || "White";
  }

  getDetails() {
    return `Type: ${this.type}, Color: ${this.color}`;
  }

  // Clone method to create a new object with the same prototype
  clone() {
    return Object.create(this);
  }
}

// Concrete Shape Prototypes
const circlePrototype = new Shape("Circle", "Red");
const rectanglePrototype = new Shape("Rectangle", "Blue");

// Cloning and customizing the Circle
const circleClone1 = circlePrototype.clone();
circleClone1.radius = 5; // Adding a property specific to the circle
console.log(circleClone1.getDetails()); // Outputs: Type: Circle, Color: Red
console.log(`Circle Radius: ${circleClone1.radius}`); // Outputs: Circle Radius: 5

// Cloning and customizing the Rectangle
const rectangleClone1 = rectanglePrototype.clone();
rectangleClone1.width = 10;
rectangleClone1.height = 5; // Adding properties specific to the rectangle
console.log(rectangleClone1.getDetails()); // Outputs: Type: Rectangle, Color: Blue
console.log(
  `Rectangle Dimensions: ${rectangleClone1.width} x ${rectangleClone1.height}`
); // Outputs: Rectangle Dimensions: 10 x 5

// Cloning another Circle
const circleClone2 = circlePrototype.clone();
circleClone2.radius = 7; // Adding a different radius for another instance
console.log(circleClone2.getDetails()); // Outputs: Type: Circle, Color: Red
console.log(`Circle Radius: ${circleClone2.radius}`); // Outputs: Circle Radius: 7
```

## Structural Patterns

Structural patterns deal with object composition, ensuring that if one part of a system changes, the entire system doesn't need to change

### Adapter Pattern

Allows incompatible interfaces to work together by converting the interface of a class into another interface clients expect.

Here’s a practical example of the Adapter design pattern in JavaScript, demonstrating how to adapt a legacy payment processing system to work with a new payment gateway that has a different interface.

```javascript
// Legacy Payment Processor
class LegacyPaymentProcessor {
  processPayment(amount) {
    console.log(`Processing payment of $${amount} through the legacy system.`);
  }
}

// New Payment Gateway with a different interface
class NewPaymentGateway {
  initiatePayment(paymentDetails) {
    console.log(
      `Initiating payment of $${paymentDetails.amount} using new payment gateway.`
    );
  }
}

// Adapter class to bridge the legacy processor and the new gateway
class PaymentAdapter {
  constructor(newPaymentGateway) {
    this.newPaymentGateway = newPaymentGateway;
  }

  // Adapting the processPayment method to match the new interface
  processPayment(amount) {
    const paymentDetails = { amount: amount };
    this.newPaymentGateway.initiatePayment(paymentDetails);
  }
}

// Client code
function clientCode(paymentProcessor) {
  paymentProcessor.processPayment(100); // Process a payment of $100
}

// Using the legacy processor directly
console.log("Using Legacy Payment Processor:");
const legacyProcessor = new LegacyPaymentProcessor();
clientCode(legacyProcessor);

// Using the new payment gateway through the adapter
console.log("\nUsing New Payment Gateway through Adapter:");
const newGateway = new NewPaymentGateway();
const adapter = new PaymentAdapter(newGateway);
clientCode(adapter);
```

### Decorator Pattern

Adds new functionality to an existing object without altering its structure.

We see this pattern frequently in libraries like `typeorm`. For this example we will show do a simple coffee order system by adding various customizations (like adding milk, sugar, and flavor) without modifying the original coffee object.

```javascript
// Base Coffee class
class Coffee {
  cost() {
    return 5; // Base cost of coffee
  }

  getDescription() {
    return "Coffee";
  }
}

// Decorator for Milk
class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee; // The coffee object to decorate
  }

  cost() {
    return this.coffee.cost() + 1; // Add cost of milk
  }

  getDescription() {
    return this.coffee.getDescription() + ", Milk"; // Add milk to description
  }
}

// Decorator for Sugar
class SugarDecorator {
  constructor(coffee) {
    this.coffee = coffee; // The coffee object to decorate
  }

  cost() {
    return this.coffee.cost() + 0.5; // Add cost of sugar
  }

  getDescription() {
    return this.coffee.getDescription() + ", Sugar"; // Add sugar to description
  }
}

// Decorator for Flavor
class FlavorDecorator {
  constructor(coffee, flavor) {
    this.coffee = coffee; // The coffee object to decorate
    this.flavor = flavor; // Flavor to add
  }

  cost() {
    return this.coffee.cost() + 0.75; // Add cost of flavor
  }

  getDescription() {
    return this.coffee.getDescription() + `, ${this.flavor} Flavor`; // Add flavor to description
  }
}

// Client code
function clientCode() {
  let myCoffee = new Coffee(); // Create a basic coffee

  console.log(`Cost: $${myCoffee.cost()}`); // Outputs: Cost: $5
  console.log(`Description: ${myCoffee.getDescription()}`); // Outputs: Description: Coffee

  // Adding milk to the coffee
  myCoffee = new MilkDecorator(myCoffee);

  console.log(`Cost: $${myCoffee.cost()}`); // Outputs: Cost: $6
  console.log(`Description: ${myCoffee.getDescription()}`); // Outputs: Description: Coffee, Milk

  // Adding sugar to the coffee
  myCoffee = new SugarDecorator(myCoffee);

  console.log(`Cost: $${myCoffee.cost()}`); // Outputs: Cost: $6.5
  console.log(`Description: ${myCoffee.getDescription()}`); // Outputs: Description: Coffee, Milk, Sugar

  // Adding vanilla flavor to the coffee
  myCoffee = new FlavorDecorator(myCoffee, "Vanilla");

  console.log(`Cost: $${myCoffee.cost()}`); // Outputs: Cost: $7.25
  console.log(`Description: ${myCoffee.getDescription()}`); // Outputs: Description: Coffee, Milk, Sugar, Vanilla Flavor
}

// Run the client code
clientCode();
```

### Facade Pattern

Provides a simplified interface to a complex subsystem, making it easier to use.

For this example we will simplify interactions with a complex home theater system that involves multiple components (like a DVD player, projector, and sound system).

```javascript
// Subsystem Classes
class DVDPlayer {
  play(movie) {
    console.log(`Playing movie: ${movie}`);
  }

  stop() {
    console.log("Stopping the DVD player.");
  }
}

class Projector {
  on() {
    console.log("Turning on the projector.");
  }

  off() {
    console.log("Turning off the projector.");
  }
}

class SoundSystem {
  setVolume(level) {
    console.log(`Setting volume to ${level}.`);
  }

  mute() {
    console.log("Muting sound system.");
  }
}

// Facade Class
class HomeTheaterFacade {
  constructor(dvdPlayer, projector, soundSystem) {
    this.dvdPlayer = dvdPlayer;
    this.projector = projector;
    this.soundSystem = soundSystem;
  }

  watchMovie(movie) {
    console.log("Get ready to watch a movie...");
    this.projector.on();
    this.soundSystem.setVolume(5);
    this.dvdPlayer.play(movie);
  }

  endMovie() {
    console.log("Shutting down the home theater...");
    this.dvdPlayer.stop();
    this.soundSystem.mute();
    this.projector.off();
  }
}

// Client Code
const dvdPlayer = new DVDPlayer();
const projector = new Projector();
const soundSystem = new SoundSystem();

const homeTheater = new HomeTheaterFacade(dvdPlayer, projector, soundSystem);

// Using the facade to watch a movie
homeTheater.watchMovie("Inception");

// Ending the movie
homeTheater.endMovie();
```

### Composite Pattern

Composes objects into tree structures to represent part-whole hierarchies, allowing clients to treat individual objects and compositions uniformly.

The Composite pattern is particularly useful for representing tree-like structures such as file systems, organization charts, or UI components in applications. By allowing clients to treat individual objects (files) and compositions of objects (directories) uniformly, it simplifies code management and enhances flexibility when working with complex structures. This approach is widely used in applications that require dynamic composition of objects while maintaining a clear hierarchical relationship.

For this example we will show how to create a file system structure where directories can contain files and other directories, allowing for a hierarchical organization.

The `FileSystemComponent` class defines the interface for both `File` and `Directory`. It includes methods `getName` and `getSize` that must be implemented by concrete classes.

The `File` class represents individual files. It implements the `getName` and `getSize` methods, returning the name and size of the file.

The `Directory` class can contain both files and other directories. It has methods to add or remove components and calculates the total size of all contained components using the `getSize` method.

```javascript
// Component Interface
class FileSystemComponent {
  getName() {
    throw new Error("This method should be overridden!");
  }

  getSize() {
    throw new Error("This method should be overridden!");
  }
}

// Leaf Class: File
class File extends FileSystemComponent {
  constructor(name, size) {
    super();
    this.name = name;
    this.size = size; // Size in KB
  }

  getName() {
    return this.name;
  }

  getSize() {
    return this.size;
  }
}

// Composite Class: Directory
class Directory extends FileSystemComponent {
  constructor(name) {
    super();
    this.name = name;
    this.children = []; // Array to hold files and directories
  }

  add(component) {
    this.children.push(component);
  }

  remove(component) {
    const index = this.children.indexOf(component);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  getName() {
    return this.name;
  }

  getSize() {
    // Calculate total size of all children
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }
}

// Client Code
function clientCode() {
  // Create files
  const file1 = new File("file1.txt", 15);
  const file2 = new File("file2.txt", 25);

  // Create a directory and add files to it
  const directory1 = new Directory("Documents");
  directory1.add(file1);
  directory1.add(file2);

  // Create another directory and add the first directory to it
  const directory2 = new Directory("User");
  directory2.add(directory1);

  // Create more files in the root directory
  const file3 = new File("file3.txt", 10);

  // Create root directory and add everything to it
  const rootDirectory = new Directory("Root");
  rootDirectory.add(directory2);
  rootDirectory.add(file3);

  // Display structure and sizes
  console.log(
    `Total size of ${rootDirectory.getName()}: ${rootDirectory.getSize()} KB`
  );
}

clientCode();
```

### Proxy Pattern

Acts as an intermediary for another object to control access, adding an additional layer of abstraction.

Here we will be demonstrating how to create a proxy for a user object that intercepts property access and modification to add additional functionality, such as logging and validation.

```javascript
// Original user object
const user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
};

// Proxy handler
const handler = {
  get(target, prop) {
    // Intercept property access
    console.log(`Accessing property: ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    // Intercept property modification with validation
    if (prop === "age" && (typeof value !== "number" || value < 18)) {
      console.error("Invalid age. Age must be a number and at least 18.");
      return false; // Prevent setting invalid age
    }
    console.log(`Changing ${prop} from ${target[prop]} to ${value}`);
    target[prop] = value; // Set the new value
    return true;
  },
};

// Create a proxy for the user object
const userProxy = new Proxy(user, handler);

// Client code
console.log(userProxy.name); // Accessing property: name
// Outputs: Alice

userProxy.age = 30; // Changing age from 25 to 30
// Outputs: Changing age from 25 to 30

console.log(userProxy.age); // Accessing property: age
// Outputs: 30

userProxy.age = 16; // Invalid age. Age must be a number and at least 18.
// Outputs an error message and does not change the age

console.log(userProxy.age); // Accessing property: age
// Outputs: 30 (age remains unchanged)
```

## Behavioral Pattern

Behavioral patterns are concerned with algorithms and the assignment of responsibilities between objects. They define how objects interact and communicate with one another.

### Observer Pattern

Allows an object (the subject) to notify other objects (observers) about changes in its state.

The Observer pattern is widely used in event-driven programming, particularly in scenarios where one object (the subject) needs to notify multiple other objects (observers) about changes in its state. This pattern is commonly found in user interface frameworks, where UI components need to respond to events or data changes without being tightly coupled to the data source. It promotes loose coupling and enhances maintainability by allowing observers to be added or removed dynamically.

For this case we will be demonstrating how to create a simple notification system where multiple observers can subscribe to updates from a subject (in this case, a news publisher).

```javascript
// Subject (News Publisher)
class NewsPublisher {
  constructor() {
    this.subscribers = []; // List of subscribers
  }

  // Method to subscribe an observer
  subscribe(observer) {
    this.subscribers.push(observer);
  }

  // Method to unsubscribe an observer
  unsubscribe(observer) {
    this.subscribers = this.subscribers.filter((sub) => sub !== observer);
  }

  // Method to notify all subscribers
  notify(article) {
    this.subscribers.forEach((subscriber) => subscriber.update(article));
  }

  // Method to publish a new article
  publishArticle(title, content) {
    const article = { title, content };
    console.log(`Publishing article: ${title}`);
    this.notify(article); // Notify all subscribers of the new article
  }
}

// Observer Interface
class Observer {
  update(article) {
    throw new Error("This method should be overridden!");
  }
}

// Concrete Observer for Email Notifications
class EmailSubscriber extends Observer {
  update(article) {
    console.log(`Email Subscriber: New article published - ${article.title}`);
    console.log(`Content: ${article.content}`);
  }
}

// Concrete Observer for SMS Notifications
class SMSSubscriber extends Observer {
  update(article) {
    console.log(`SMS Subscriber: New article published - ${article.title}`);
    console.log(`Content: ${article.content}`);
  }
}

// Client Code
const newsPublisher = new NewsPublisher();

const emailSubscriber = new EmailSubscriber();
const smsSubscriber = new SMSSubscriber();

// Subscribing to the news publisher
newsPublisher.subscribe(emailSubscriber);
newsPublisher.subscribe(smsSubscriber);

// Publishing articles
newsPublisher.publishArticle(
  "Observer Pattern in JavaScript",
  "Understanding the observer design pattern with practical examples."
);
newsPublisher.publishArticle(
  "JavaScript Design Patterns",
  "Exploring various design patterns in JavaScript."
);

// Unsubscribing from the news publisher
newsPublisher.unsubscribe(emailSubscriber);

// Publishing another article after unsubscribing
newsPublisher.publishArticle(
  "New Features in ES2024",
  "Discover the latest features introduced in ECMAScript 2024."
);
```

Here is a more in depth explanation of the code in case it was too complex:

1. **Subject (News Publisher)**:

   - The `NewsPublisher` class maintains a list of subscribers (observers) and provides methods to subscribe, unsubscribe, and notify them. The `publishArticle` method creates a new article and notifies all subscribers.

2. **Observer Interface**:

   - The `Observer` class defines an interface with an `update` method that must be implemented by concrete observer classes.

3. **Concrete Observers**:

   - `EmailSubscriber` and `SMSSubscriber` are concrete implementations of the `Observer`. Each class implements the `update` method to handle notifications about new articles.

4. **Client Code**:
   - In the client code, an instance of `NewsPublisher` is created along with two subscribers (`EmailSubscriber` and `SMSSubscriber`). Both subscribers are registered with the publisher.
   - When articles are published using `publishArticle`, all subscribed observers receive notifications.
   - After unsubscribing the email subscriber, only the SMS subscriber receives notifications for subsequent articles.

### Strategy Pattern

Defines a family of algorithms, encapsulates each one, and makes them interchangeable.

In this example, we will create a shopping cart that can use different payment methods.

```javascript
// Strategy Interface
class PaymentStrategy {
  pay(amount) {
    throw new Error("This method should be overridden!");
  }
}

// Concrete Strategy for Credit Card Payment
class CreditCardPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid $${amount} using Credit Card.`);
  }
}

// Concrete Strategy for PayPal Payment
class PayPalPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid $${amount} using PayPal.`);
  }
}

// Context Class
class ShoppingCart {
  constructor() {
    this.items = [];
    this.paymentStrategy = null; // Initially no payment strategy
  }

  addItem(item) {
    this.items.push(item);
  }

  setPaymentStrategy(strategy) {
    this.paymentStrategy = strategy;
  }

  checkout() {
    const totalAmount = this.items.reduce((sum, item) => sum + item.price, 0);
    if (this.paymentStrategy) {
      this.paymentStrategy.pay(totalAmount);
    } else {
      console.log("No payment method selected.");
    }
  }
}

// Client Code
const cart = new ShoppingCart();

// Adding items to the cart
cart.addItem({ name: "Book", price: 15 });
cart.addItem({ name: "Pen", price: 5 });

// Using Credit Card Payment
cart.setPaymentStrategy(new CreditCardPayment());
cart.checkout(); // Outputs: Paid $20 using Credit Card.

// Using PayPal Payment
cart.setPaymentStrategy(new PayPalPayment());
cart.checkout(); // Outputs: Paid $20 using PayPal.
```

### Command Pattern

Encapsulates a request as an object, thereby allowing for parameterization of clients with queues, requests, and operations.

Here we will implement a simple calculator that supports basic arithmetic operations (addition, subtraction, multiplication, and division) while also allowing for undo functionality.

```javascript
// Command class
class Command {
  constructor(execute, undo, value) {
    this.execute = execute;
    this.undo = undo;
    this.value = value;
  }
}

// Calculator class
class Calculator {
  constructor() {
    this.currentValue = 0;
    this.commands = [];
  }

  executeCommand(command) {
    this.currentValue = command.execute(this.currentValue, command.value);
    this.commands.push(command);
  }

  undoCommand() {
    const command = this.commands.pop();
    if (command) {
      this.currentValue = command.undo(this.currentValue, command.value);
    }
  }

  getCurrentValue() {
    return this.currentValue;
  }
}

// Command implementations for different operations
const add = (current, value) => current + value;
const subtract = (current, value) => current - value;
const multiply = (current, value) => current * value;
const divide = (current, value) => current / value;

// Concrete Command classes
class AddCommand extends Command {
  constructor(value) {
    super(add, subtract, value);
  }
}

class SubtractCommand extends Command {
  constructor(value) {
    super(subtract, add, value);
  }
}

class MultiplyCommand extends Command {
  constructor(value) {
    super(multiply, divide, value);
  }
}

class DivideCommand extends Command {
  constructor(value) {
    super(divide, multiply, value);
  }
}

// Client code
const calculator = new Calculator();

// Issue commands
calculator.executeCommand(new AddCommand(100));
calculator.executeCommand(new SubtractCommand(24));
calculator.executeCommand(new MultiplyCommand(6));
calculator.executeCommand(new DivideCommand(2));

// Current value after operations
console.log("Current Value:", calculator.getCurrentValue()); // Outputs: Current Value: 456

// Undo last two commands
calculator.undoCommand(); // Undo Divide
calculator.undoCommand(); // Undo Multiply

console.log("Current Value after undoing:", calculator.getCurrentValue()); // Outputs: Current Value after undoing: 84
```

### Chain of Responsability Pattern

Passes requests along a chain of handlers, allowing multiple handlers to process the request.

The Chain of Responsibility pattern is useful in scenarios where multiple objects can handle a request but you want to decouple the sender from the receiver. This pattern is commonly used in event handling systems, logging frameworks, and processing workflows, allowing for flexible and maintainable code structures. In this example, it effectively routes customer queries through various support levels based on their complexity, ensuring that each query is handled by the appropriate agent without tightly coupling the clients to specific handlers.

In this example, we will create a system where customer queries are handled by different levels of support agents. Each agent can either handle the query or pass it to the next level if they cannot.

```javascript
// Handler Interface
class SupportHandler {
  setNext(handler) {
    this.nextHandler = handler;
    return handler; // Enables chaining
  }

  handleRequest(query) {
    if (this.nextHandler) {
      return this.nextHandler.handleRequest(query);
    }
    return null; // No handler found
  }
}

// Concrete Handlers
class Level1Support extends SupportHandler {
  handleRequest(query) {
    if (query.difficulty === "easy") {
      console.log("Level 1 Support: Handling easy query.");
    } else {
      console.log("Level 1 Support: Passing to Level 2.");
      super.handleRequest(query);
    }
  }
}

class Level2Support extends SupportHandler {
  handleRequest(query) {
    if (query.difficulty === "medium") {
      console.log("Level 2 Support: Handling medium query.");
    } else {
      console.log("Level 2 Support: Passing to Level 3.");
      super.handleRequest(query);
    }
  }
}

class Level3Support extends SupportHandler {
  handleRequest(query) {
    if (query.difficulty === "hard") {
      console.log("Level 3 Support: Handling hard query.");
    } else {
      console.log("Level 3 Support: Unable to handle the query.");
    }
  }
}

// Client Code
const level1 = new Level1Support();
const level2 = new Level2Support();
const level3 = new Level3Support();

// Setting up the chain of responsibility
level1.setNext(level2).setNext(level3);

// Different queries
const easyQuery = { difficulty: "easy" };
const mediumQuery = { difficulty: "medium" };
const hardQuery = { difficulty: "hard" };
const unknownQuery = { difficulty: "unknown" };

// Processing queries
console.log("Processing Easy Query:");
level1.handleRequest(easyQuery); // Outputs: Level 1 Support: Handling easy query.

console.log("\nProcessing Medium Query:");
level1.handleRequest(mediumQuery); // Outputs: Level 1 Support: Passing to Level 2.
//          Level 2 Support: Handling medium query.

console.log("\nProcessing Hard Query:");
level1.handleRequest(hardQuery); // Outputs: Level 1 Support: Passing to Level 2.
//          Level 2 Support: Passing to Level 3.
//          Level 3 Support: Handling hard query.

console.log("\nProcessing Unknown Query:");
level1.handleRequest(unknownQuery); // Outputs: Level 1 Support: Passing to Level 2.
//          Level 2 Support: Passing to Level 3.
//          Level 3 Support: Unable to handle the query.
```

# Summary

Here’s a summary of the design patterns we just saw, including their pros and cons, and when to use each:

| Design Pattern              | Type       | Pros                                                                            | Cons                                                    | When to Use                                                                                 |
| --------------------------- | ---------- | ------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Singleton**               | Creational | - Ensures a single instance<br>- Global access point                            | - Can be difficult to test<br>- Introduces global state | When you need a single instance of a class, like configuration settings or logging.         |
| **Factory Method**          | Creational | - Decouples object creation<br>- Promotes code reuse                            | - Can lead to complex code structure                    | When the exact type of object to create isn’t known until runtime.                          |
| **Abstract Factory**        | Creational | - Creates families of related objects<br>- Provides a high level of abstraction | - More complex than factory method                      | When you need to create multiple related objects without specifying their concrete classes. |
| **Builder**                 | Creational | - Separates construction from representation<br>- Flexible object creation      | - Can be overkill for simple objects                    | When constructing complex objects step-by-step is necessary.                                |
| **Prototype**               | Creational | - Allows for object cloning<br>- Reduces overhead of creating new instances     | - Can be complex if the object graph is complicated     | When creating many similar objects with shared state.                                       |
| **Adapter**                 | Structural | - Allows incompatible interfaces to work together                               | - Can introduce additional complexity                   | When you need to integrate new functionality into existing code without modifying it.       |
| **Bridge**                  | Structural | - Separates abstraction from implementation<br>- Enhances flexibility           | - Can complicate the design                             | When you want to decouple an interface from its implementation.                             |
| **Composite**               | Structural | - Treats individual objects and compositions uniformly                          | - Can lead to overly complex structures                 | When you need to represent part-whole hierarchies, such as in graphical user interfaces.    |
| **Decorator**               | Structural | - Adds responsibilities dynamically<br>- Promotes code reusability              | - Can lead to excessive wrapping                        | When you want to add functionality to individual objects without affecting others.          |
| **Facade**                  | Structural | - Simplifies complex systems<br>- Provides a unified interface                  | - Can hide important details                            | When you want to provide a simplified interface to a complex subsystem.                     |
| **Proxy**                   | Structural | - Controls access to an object<br>- Can add additional functionality            | - Adds another layer of abstraction                     | When you need a placeholder for another object, such as for lazy loading or access control. |
| **Flyweight**               | Structural | - Reduces memory usage<br>- Efficiently manages large numbers of objects        | - Complex implementation                                | When you need to create many similar objects but want to minimize memory usage.             |
| **Observer**                | Behavioral | - Promotes loose coupling<br>- Supports dynamic relationships                   | - Can lead to memory leaks if not managed properly      | When an object needs to notify multiple other objects about changes in its state.           |
| **Strategy**                | Behavioral | - Encapsulates interchangeable algorithms<br>- Promotes flexibility             | - Increases the number of classes                       | When you want to define a family of algorithms and make them interchangeable at runtime.    |
| **Command**                 | Behavioral | - Encapsulates requests as objects<br>- Supports undoable operations            | - Can lead to command explosion                         | When you need to parameterize actions, queue requests, or support undo functionality.       |
| **Chain of Responsibility** | Behavioral | - Achieves loose coupling<br>- Allows for dynamic request handling              | - May lead to confusion if the chain is too long        | - When multiple handlers can process a request, and you want flexibility in handling it.    |

This table summarizes key design patterns, highlighting their advantages and disadvantages, along with scenarios where they are most effectively applied.

# Conclusion

Design patterns are essential tools in software development that provide proven solutions to common design problems. By understanding and utilizing these patterns, developers can create more robust, maintainable, and scalable applications. Each design pattern serves a specific purpose and is suited for particular scenarios, from managing object creation with creational patterns to facilitating communication between objects with behavioral patterns.

As you explore these patterns, consider the specific needs of your projects. Familiarity with design patterns not only enhances your coding skills but also improves your ability to collaborate with other developers by providing a shared vocabulary and framework for discussing design decisions. Whether you're building a small application or a large system, integrating appropriate design patterns can lead to cleaner code and more efficient development processes. Embrace these patterns as part of your toolkit, and you'll find that they can significantly streamline your software design efforts.

I can understand its a lot of patterns, its why I provided a summary at the end you can consult anytime you want, also at the start of the article you can click the table of content link to direct you with an example.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
