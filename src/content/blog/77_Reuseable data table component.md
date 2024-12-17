---
title: "How to implement reuseable components in React"
description: "In this article we will learn how to develop reuseable components in React using generics"
category: ["javascript", "react", "typescript"]
pubDate: "2024-12-15"
published: true
---

## Table of content

# Introduction

Today we're building a data-table component, its one of the features I have developed over the years that is constantly being asked in jobs, so taking the chance to explain how to make one being reuseable. For complex features like sorting, pagination, filtering, you can use react-table from Tanstack, but sometimes you just want something simpler and dont need to install a whole library just for it, so let's see how to make one.

# Initial component and problems

Let's say you get a JIRA ticket with the following:

**TICKET**

**Summary**: Develop a Table Component

**Description**:
We need to develop a reusable table component that accepts an array of data. The component should be able to display the following fields:

- **ID**: Unique identifier for each entry.
- **Name**: The name of the individual or entity.
- **Email**: Contact email address.
- **Role**: The role associated with the individual or entity.

**Acceptance Criteria**:

1. The table should be able to accept an input in the form of an array containing objects with the specified fields (id, name, email, role).
2. The component must render the data in a structured table format.
3. Each column should be sortable by clicking on the column headers.
4. Implement basic styling to ensure readability and usability.
5. Include unit tests to verify functionality.

In the head of a junior developer, they will likely start by doing something like this:

```javascript
type DataTableProps = {
  data: {
    id: number,
    name: string,
    email: string,
    role: string,
  }[],
};

const DataTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Role</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6">{item.id}</td>
              <td className="py-3 px-6">{item.name}</td>
              <td className="py-3 px-6">{item.email}</td>
              <td className="py-3 px-6">{item.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
```

And done! One ticket sent for a pull request! But then you get some severe feedback telling you do it all over and make it a reuseable component, but why?

Imagine you want to render different type of data, what do you do? Copy and paste this only changing the data you need? So what happens if instead of a string, we want to render a button?

This is where things get more complicated over time, a junior often times just read the ticket and follow the instructions, but with time and experience, you learn to see ahead and that this ticket, should've been reworded to create a data-table component before this ticket, and this type of discussion happens between the Leads and the rest of the team.

# Creating the correct component

Now that we identified the problems we're facing, its time we work this again, lets see if we can refactor the component into something more reuseable:

```javascript
interface DataTableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
}

const DataTable = <T>({
  headers,
  data,
  renderRow,
}: TableProps<T>): JSX.Element => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            {headers.map((header, index) => (
              <th key={index} className="py-3 px-6 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              {renderRow(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
```

Looks better right? Its a step in the right direction, but not enough. Lets analyze the props:

```typescript
interface DataTableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
}
```

`headers` are the table headers we render, but are we really going to be in a situation where the keys of `T` are not going to be the headers? Lets make it a bit more visual, lets say you have the following data:

```javascript
const data = [
  {
    id: 1,
    name: "Jhon",
    age: 34,
    role: "driver",
  },
  {
    id: 2,
    name: "Mary",
    age: 24,
    role: "lead",
  },
];
```

If we render this in a table, under each header `id, name, age, role` would be the values of each respective item, so why would we accept a `string[]` as the props of the headers? We can re-write this to be like:

```typescript
type Column<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T]) => ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
};
```

Now that we defined out props, let's see how we can turn this into a component:

```javascript
const DataTable = <T>({ data, columns }: DataTableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            {columns.map((column) => (
              <th key={String(column.key)} className="py-3 px-6 text-left">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              {columns.map((column) => (
                <td key={String(column.key)} className="py-3 px-6">
                  {column.render
                    ? column.render(item[column.key])
                    : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
```

And to use this, we can see it in an example:

```javascript
import React from "react";
import DataTable from "./DataTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const App = () => {
  const data: User[] = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "User",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "Editor",
    },
    {
      id: 4,
      name: "Bob Brown",
      email: "bob.brown@example.com",
      role: "Viewer",
    },
  ];

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">User Table</h1>
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default App;
```

Now it doesn't matter what type of data you throw, you will always get the expected response.

Finally lets add some testing:

```javascript
import React from "react";
import { render, screen } from "@testing-library/react";
import DataTable from "./DataTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const mockData: User[] = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "User" },
];

const columns = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
];

describe("DataTable Component", () => {
  test("renders without crashing", () => {
    render(<DataTable data={mockData} columns={columns} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
  });

  test("displays correct number of rows", () => {
    render(<DataTable data={mockData} columns={columns} />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(mockData.length + 1); // +1 for header row
  });

  test("displays correct data in each cell", () => {
    render(<DataTable data={mockData} columns={columns} />);

    // Check first row data
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();

    // Check second row data
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane.smith@example.com")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  test("renders with custom cell rendering", () => {
    const customColumns = [
      { key: "id", header: "ID" },
      { key: "name", header: "Name" },
      {
        key: "email",
        header: "Email",
        render: (value) => <a href={`mailto:${value}`}>{value}</a>,
      },
      { key: "role", header: "Role" },
    ];

    render(<DataTable data={mockData} columns={customColumns} />);

    // Check if email is rendered as a link
    const emailLink = screen.getByText("john.doe@example.com");
    expect(emailLink).toHaveAttribute("href", "mailto:john.doe@example.com");
  });
});
```

And now we're done! We finally have our generic reuseable data-table component! There are more things you can do to it, but at this stage you can probably use React Table from Tanstack or you can do it yourself.

# Conclusion

We have learned how to take a ticket and develop a step by step process into developing a reuseable component for a specific ticket. There is a problem you might have noticed, the original ticket didn't say to make a generic component, so this was an oversight by the management which is usually voiced by the current developer lead, I can assure you, these type of problems happen frequently and even though it adds more work load, they save a ton of future problems that might occur.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
