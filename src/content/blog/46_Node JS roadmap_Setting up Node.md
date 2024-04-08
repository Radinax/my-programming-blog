---
title: "[Roadmap_Node] 2_Setting Up Node"
description: "Let us setup Node in your computer"
category: ["node"]
pubDate: "2024-04-03"
published: true
---

# Introduction

In our last post we learn what is Node JS in very simple terms, now its time to setup our computers to be able to do some simple tasks.

# Installing Node.js and NPM

There are two main approaches to installing Node.js and npm (Node Package Manager):

**1. Using a Node.js Installer:**

- This is the recommended method for most users, especially beginners. The official Node.js website provides installers for Windows, macOS, and Linux.
  - Visit the official Node.js download page: [https://nodejs.org/en/download](https://nodejs.org/en/download)
- Download the installer appropriate for your operating system.
- Run the downloaded installer and follow the on-screen instructions. The installer typically takes care of setting up both Node.js and npm.

**2. Using a Node Version Manager (NVM):**

- NVM allows you to manage multiple Node.js versions on your system. This can be useful if you're working on projects with different Node.js version requirements.
  - Refer to the NVM installation guide for your operating system: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
- Once NVM is installed, you can use it to download and install specific Node.js versions.

**Verifying Installation:**

- Once you've installed Node.js using either method, open a terminal or command prompt and type the following commands to verify the installation:

  ```bash
  node -v  # This should print the installed Node.js version
  npm -v   # This should print the installed npm version
  ```

**Additional Notes:**

- During the Node.js installation process, you might be given the option to add Node.js and npm to your system's PATH environment variable. This allows you to run `node` and `npm` commands from any directory in your terminal.
- If you encounter any issues during installation, refer to the official Node.js documentation for troubleshooting steps: [https://nodejs.org/en/download](https://nodejs.org/en/download)

I hope this comprehensive explanation helps you install Node.js and npm successfully!

# Using Node JS

Here are a few simple examples to get you started with Node.js now that you have it installed:

**1. Running a Basic JavaScript Program:**

- Create a file named `hello.js` with your favorite text editor and add the following code:

  ```javascript
  console.log("Hello, World!");
  ```

- Open your terminal or command prompt and navigate to the directory where you saved `hello.js`.
- Run the following command to execute the JavaScript code:

  ```bash
  node hello.js
  ```

This will print "Hello, World!" to your terminal.

**2. Using Built-in Modules:**

- Node.js comes with several built-in modules you can use in your programs. Let's explore the `http` module for creating a simple web server.

  ```javascript
  const http = require("http");

  const hostname = "127.0.0.1"; // Localhost IP address
  const port = 3000; // Port number

  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello, World!\n");
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
  ```

- Save this code as `server.js`.
- Run `node server.js` in your terminal.
- Open a web browser and navigate to `http://localhost:3000/`. You should see "Hello, World!" displayed.

**3. Using Packages from npm:**

- npm, the Node Package Manager, allows you to install third-party packages that provide additional functionality. Let's use a package called `chalk` to add color to our console output.

  1.  Install the `chalk` package:

  ```bash
  npm install chalk
  ```

  2.  Create a new file named `color.js` and add the following code:

  ```javascript
  const chalk = require("chalk");

  console.log(chalk.green("Hello"));
  console.log(chalk.red("World"));
  ```

  3.  Run `node color.js` to see the colored output in your terminal.

These are just a few basic examples to demonstrate the capabilities of Node.js. As you explore further, you'll discover a vast ecosystem of packages and frameworks that empower you to build complex and scalable applications.

# Package.json Configuration

In Node.js, `package.json` is a fundamental file that acts as a manifest for your project. It stores essential information about your application, including:

**1. Project Metadata:**

- `name`: The unique name of your package (required for publishing to npm).
- `version`: The version of your package (e.g., "1.0.0").
- `description`: A brief description of your package's purpose.
- `keywords`: An array of keywords to help people discover your package.
- `license`: The license under which your package is distributed.
- `author`: The author's name or organization (optional).

**2. Dependencies:**

- `dependencies`: An object listing all the external packages your project requires to function. This is where you specify the package names and their versions (e.g., `"express": "^4.18.2"`).
- `devDependencies`: Similar to `dependencies`, but these packages are only required for development tasks (e.g., testing, linting) and are not included in the final production bundle.

**3. Scripts:**

- `scripts`: An object where you can define custom commands to automate tasks in your project. These commands can be executed using `npm run <script-name>`. Common scripts include:
  - `start`: To start your application (e.g., `node server.js`).
  - `build`: To build your project for production (if applicable).
  - `test`: To run tests for your code.

**4. Other Optional Fields:**

- `main`: The entry point of your application (the file that gets executed when you run `node <your-package-name>`). Defaults to `index.js`.
- `bin`: An object to specify executable files within your package.
- `homepage`: The website URL for your project.

**Creating a `package.json` File:**

There are several ways to create a `package.json` file:

- Manually create a JSON file with the desired properties and values.
- Use the `npm init` command in your terminal. It will ask you interactive questions to populate your `package.json` file.
- Third-party tools like `yarn init` can also be used.

**Example `package.json`:**

```json
{
  "name": "my-awesome-app",
  "version": "1.0.0",
  "description": "A simple Node.js application",
  "keywords": ["node", "javascript"],
  "license": "MIT",
  "author": "John Doe",
  "main": "index.js",
  "scripts": {
    "start": "node server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^28.0.1"
  }
}
```

In summary, `package.json` is a vital configuration file in Node.js projects. It centralizes information about your application, dependencies, and scripts, making development and collaboration more efficient.

# What is Node Version Manager (NVM)

Node Version Manager (NVM) is a tool that allows you to manage multiple versions of Node.js on a single system. This can be extremely beneficial for developers for several reasons:

**1. Working on Projects with Different Node.js Requirements:**

- Different projects might have specific Node.js version dependencies. NVM lets you easily switch between versions to ensure compatibility with each project's needs.

**2. Testing Code Compatibility Across Versions:**

- You can use NVM to install multiple versions of Node.js and test your code on each one. This helps identify any potential issues related to specific Node.js versions.

**3. Trying Out New Node.js Features:**

- As Node.js releases new versions with new features and improvements, NVM allows you to quickly install and test these features before upgrading your project's main Node.js version.

**How NVM Works:**

- NVM is a command-line tool typically installed on your system's shell.
- It manages Node.js versions by downloading them from the official Node.js repository and installing them into separate directories.
- You can use NVM commands to list available versions, install specific versions, and set the active version that your project will use.

**Benefits of Using NVM:**

- **Flexibility:** Easily switch between Node.js versions without manually managing installations.
- **Organization:** Keeps your development environment organized with isolated versions for each project.
- **Efficiency:** Saves time and effort by avoiding conflicts and version-related issues.
- **Testing:** Facilitates testing across multiple Node.js versions for better compatibility.

**Installation:**

NVM installation instructions vary depending on your operating system. Here are some resources to get you started:

- Official NVM GitHub repository: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
- Installation guide for different operating systems: [https://www.freecodecamp.org/news/nvm-for-windows-how-to-download-and-install-node-version-manager-in-windows-10/](https://www.freecodecamp.org/news/nvm-for-windows-how-to-download-and-install-node-version-manager-in-windows-10/)

**Using NVM Commands:**

Once installed, you can use commands like:

- `nvm ls`: List installed Node.js versions.
- `nvm install <version>`: Install a specific Node.js version.
- `nvm use <version>`: Set the active Node.js version.
- `nvm default <version>`: Set the default Node.js version to use.

By leveraging NVM, you can effectively manage multiple Node.js versions on your machine, streamlining development workflows and ensuring compatibility across various projects.

# Conclusion

We learned how to setup NODE JS, performed some basic scripts, learned about what is Package.json and how to configure it, finally what is an NVM to control our Node version, very basic concepts so far, but a right step for now.

See you on the next post.

Sincerely,

**End. Adrian Beria**
