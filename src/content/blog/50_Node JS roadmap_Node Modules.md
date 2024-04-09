---
title: "[Roadmap_Node] 6_Node Modules"
description: "Let us talk about Node Modules, what they are, why are they present in every project and how you can use it for your advantage"
category: ["node"]
pubDate: "2024-04-07"
published: true
---

# Introduction

Node.js modules are essentially reusable blocks of JavaScript code that provide functionality for your Node.js applications. In simpler terms, you can think of them like Lego bricks for your code. Here are some key points about node modules:

- **Reusable code:** The main purpose of node modules is to allow you to reuse code without having to rewrite it from scratch. This saves time and effort, and helps to ensure consistency in your codebase.
- **Functionality:** Node modules can provide a wide range of functionality, from working with files and databases to handling HTTP requests and building user interfaces.
- **Built-in vs. external:** There are two main types of node modules: built-in modules that come with Node.js itself, and external modules that you can install from a public repository called the npm Package Manager.

Overall, node modules are a fundamental concept in Node.js development, and they play a crucial role in building efficient and maintainable applications.

# Installing packages

In order to install npm packages, you'll need to have Node.js installed first, as npm (Node Package Manager) comes bundled with it. There are two main ways to approach this:

1. **Node Version Manager:** This is the recommended way, especially if you're working on multiple projects that might require different Node.js versions. Popular options include nvm (Node Version Manager) for MacOS or Linux. You can find instructions for installing Node.js and npm using a version manager on the official npm website [download node and npm].

2. **Node.js Installer:** If you only need one version of Node.js, you can download an installer directly from the Node.js website [download node and npm]. This will include npm as well.

Once you have Node.js and npm set up, installing packages is straightforward. Here's how:

- **Open your terminal:** This is where you'll type commands to interact with npm.
- **Navigate to your project directory:** Use the `cd` command to move to the folder where your Node.js project is located.
- **Install a package:** Use the `npm install` command followed by the name of the package you want to install. For example, to install the popular Express.js web framework, you would type:

```bash
npm install express
```

- **Installing dependencies:** By default, `npm install` will also install any dependencies listed in the project's `package.json` file. This file manages your project's dependencies and ensures you have all the necessary packages for your code to run.

That's the basic process for installing npm packages. There are additional options and flags available for `npm install` that you can explore in the npm documentation [npm install command].

# Creating and managing package json

## Creating a package.json file

The `package.json` file is the heart of your Node.js project. It stores essential information about your project, including dependencies, scripts, and metadata. There are two main ways to create a `package.json` file:

1. **Interactive creation:**

   - Use the `npm init` command in your terminal while in your project directory.
   - This will start an interactive questionnaire where you can provide details like project name, version, description, etc.
   - Answer the prompts or leave them blank to use defaults.

2. **Default creation:**
   - Run `npm init -y` or `npm init --yes` to create a basic `package.json` with default values based on your directory contents.

## Managing `package.json`

Here's how to manage the various aspects of your `package.json`:

- **Editing:** You can edit the `package.json` file directly with a text editor. Be sure to follow JSON formatting for proper syntax.

- **Dependencies:**

  - **`dependencies`:** This section lists all the external packages your project needs to run.
  - **`devDependencies`:** This section includes packages only required for development tasks like testing or building, not for the final application.
  - Use `npm install <package_name>` to install a package and add it to `dependencies`. You can specify `--save-dev` to put it in `devDependencies`.
  - Update existing packages with `npm update <package_name>`.

- **Scripts:**

  - The `scripts` section allows you to define custom commands for automating tasks.
  - For example, you can add a `"start"` script to launch your application or a `"test"` script to run tests.
  - You can run these scripts using `npm run <script_name>`.

- **Other properties:**
  - `package.json` includes other properties like license, author information, keywords, etc. You can edit these as needed.

## Best Practices for `package.json`

- **Clear and concise descriptions:** Provide a clear description of your project in the `description` field.
- **Versioning:** Follow a proper versioning scheme (e.g., semantic versioning) to indicate changes in your project.
- **Dependency management:** Keep your dependencies updated to benefit from bug fixes and security patches. Consider using tools like `npm audit` to identify vulnerabilities.
- **Semantic scripts:** Use descriptive names for your scripts in the `scripts` section for better readability.

By following these tips, you can effectively manage your `package.json` file and ensure a smooth development workflow for your Node.js projects.

# Semantic Versioning

In Node.js, semantic versioning (SemVer) is a widely adopted system for assigning version numbers to packages. It goes beyond just a numbering scheme; it establishes a communication standard about the nature of changes in a package's version. This allows developers who depend on your package to understand the potential impact of upgrading to a new version.

SemVer uses a three-part version format: `Major.Minor.Patch` (e.g., 2.1.4). Here's what each part signifies:

- **Major:** Significant changes that likely break backward compatibility with previous versions. This indicates a major update to the package's functionality or API.
- **Minor:** Backward-compatible additions or improvements to the package. New features might be introduced, but existing functionality should not be broken.
- **Patch:** Bug fixes and other minor changes that don't introduce new features or break compatibility.

Here's how changes in a Node.js package typically affect the version number according to SemVer:

- **Fix a bug:** Increment the Patch version (e.g., from 1.2.3 to 1.2.4).
- **Add a new backward-compatible feature:** Increment the Minor version (e.g., from 1.2.3 to 1.3.0).
- **Make a major change that breaks compatibility:** Increment the Major version (e.g., from 1.2.3 to 2.0.0).

**Benefits of using Semantic Versioning:**

- **Clear communication:** SemVer helps developers using your package understand the extent of changes in a new version, allowing them to make informed decisions about upgrading.
- **Dependency management:** Package managers like npm can leverage SemVer to determine compatible package versions when installing dependencies.
- **Reduced risk:** By following SemVer, you can minimize the risk of breaking changes for users of your package.

Overall, semantic versioning is a cornerstone of effective package management in Node.js. It promotes clear communication, simplifies dependency management, and fosters a healthier Node.js ecosystem.

# NPM Scripts

npm scripts are a powerful feature within the npm package manager that allows you to automate repetitive tasks within your Node.js projects. They are essentially custom commands defined in your project's `package.json` file that you can execute from the terminal.

Here are some key points about npm scripts:

- **Efficiency:** npm scripts help you save time and effort by automating tasks you frequently perform during development.
- **Consistency:** By defining scripts, you ensure consistency in how these tasks are executed across your project and development team.
- **Customizable:** You can define scripts for a wide range of tasks, like starting a development server, running tests, building your project for production, or linting your code.
- **Predefined scripts:** npm also supports built-in lifecycle scripts that are automatically triggered during specific stages of your project's lifecycle, such as `preinstall` or `postpublish`.

**How npm scripts work:**

1. **Define scripts in `package.json`:** Add a `scripts` section to your `package.json` file. Within this section, define key-value pairs where the key is the name of your script and the value is the shell command you want to execute.

2. **Run scripts:** Use the `npm run` command followed by the name of the script you want to execute. For example, to run a script named `start`, you would type:

```bash
npm run start
```

**Benefits of using npm scripts:**

- **Improved workflow:** Automating tasks saves time and streamlines your development process.
- **Reduced errors:** By defining scripts, you eliminate the chance of introducing errors through manual command typing.
- **Collaboration:** Sharing scripts within your project ensures everyone uses the same commands and tools.
- **Testability:** You can easily integrate scripts into your testing workflow to automate testing processes.

Here's an example `package.json` file demonstrating some commonly used npm scripts:

```json
{
  "name": "my-node-project",
  "version": "1.0.0",
  "description": "A basic Node.js project",
  "scripts": {
    "start": "node index.js", // Starts the application (replace with your entry point)
    "test": "mocha test/**/*.js", // Runs tests using Mocha framework (replace with your test runner)
    "lint": "eslint .", // Lints code using ESLint
    "build": "webpack", // Builds project for production using Webpack (replace with your build tool)
    "prepublish": "npm run build", // Runs build script before publishing (optional)
    "postinstall": "npm run lint" // Runs linter script after installing dependencies (optional)
  },
  "devDependencies": {
    "eslint": "^8.24.0", // Example linter
    "mocha": "^9.2.2", // Example test runner
    "webpack": "^5.72.0" // Example build tool
  }
}
```

**Explanation of scripts:**

- `"start"`: This script starts your Node.js application. Replace `index.js` with your actual application entry point.
- `"test"`: This script runs your tests using the Mocha testing framework. The command assumes your tests are located in a folder named `test`. Adapt the path if your tests are located elsewhere.
- `"lint"`: This script runs ESLint, a popular linter tool, to check your code for stylistic errors and potential problems.
- `"build"`: This script builds your project for production using Webpack (a module bundler). You might need to adjust this depending on your build tool.
- `"prepublish"` (optional): This script runs before publishing your package to npm. In this case, it runs the build script to ensure your project is ready for distribution.
- `"postinstall"` (optional): This script runs after installing dependencies. Here, it runs the linter to check for any issues introduced by new dependencies.

Remember to replace the example commands and tools with the ones you use in your project. This is just a basic demonstration of commonly used npm scripts. You can customize them further to fit your specific needs.

Overall, npm scripts are a valuable tool for Node.js developers. By leveraging them effectively, you can boost your development efficiency, maintain consistency, and improve collaboration within your projects.

# Creating and publishing a package in NPM

Here's a breakdown of the steps involved in creating and publishing a package in npm:

**Prerequisites:**

1. **Node.js and npm:** Ensure you have Node.js and npm installed on your system. You can download and install them from the official Node.js website [download node and npm].

2. **Project Setup:**
   - Create a new directory for your project.
   - Initialize a Git repository within your project directory (optional but recommended for version control).

**Creating your package:**

1. **Initialize `package.json`:**

   - Navigate to your project directory in the terminal.
   - Run the command `npm init` to initialize a `package.json` file. This file stores essential information about your package.
   - Follow the interactive prompts to provide details like project name, version, description, author, etc. You can leave some prompts blank to use defaults.

2. **Write your code:**

   - Create the JavaScript files containing the functionality you want to share as your npm package.
   - Ensure your code is well-structured, documented, and adheres to best practices.

3. **Add dependencies (optional):**

   - If your package relies on other npm packages, use `npm install <package_name>` to install them and add them as dependencies in your `package.json` file under the `dependencies` section.

4. **Create a README (optional):**
   - Consider creating a README file that explains how to use your package, installation instructions, and any other relevant information for potential users.

**Publishing your package:**

1. **Account on npmJS:**

   - Create an account on the npmJS website ([https://docs.npmjs.com/cli/v10/using-npm/registry/](https://docs.npmjs.com/cli/v10/using-npm/registry/)) if you haven't already.

2. **Set access:**

   - By default, npm packages are private. To publish a public package, you'll need to set the access level to public. You can do this using the `--access public` flag with the `npm publish` command.

3. **Publish:**
   - Make sure you're in your project's root directory in the terminal.
   - Run the command `npm publish --access public`. This will initiate the publishing process.
   - You'll be prompted to enter your npmJS username and password to authenticate the publication.

**Additional Tips:**

- **Semantic Versioning:** Consider following semantic versioning (SemVer) for your package versioning to clearly communicate the nature of changes in updates ([https://docs.npmjs.com/about-semantic-versioning/](https://docs.npmjs.com/about-semantic-versioning/)).

- **Testing:** It's highly recommended to write unit tests for your package to ensure its functionality.

- **Version control:** Using Git for version control allows you to track changes to your codebase and collaborate effectively.

By following these steps and best practices, you can successfully create and publish your own reusable package on npm, making it available for other developers to use in their projects.

# Conclusion

Node Modules is often overlooked over time, but its always important to understand its concepts. In this post we checked:

- Installing Packages
- Creating and Managing package.json
- Semantic Versioning
- NPM Scripts
- Creating and publishing a package in NPM

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
