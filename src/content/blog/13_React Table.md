---
title: "React Table"
description: "React Table is one of the best libraries out there to handle tables, its updated quite frequently and the developers behind it are very eager to listen to the community, lets check it out!"
category: ["react", "frontend"]
pubDate: "2023-11-13"
published: true
---

> React Table is a collection of hooks for **building powerful tables and datagrid experiences**. These hooks are lightweight, composable, and ultra-extensible, but **do not render any markup or styles for you**. This effectively means that React Table is a "headless" UI library

Using tables is a common way of introducing data into the UI, there are several tools available for the job, from UI only options inside CSS Frameworks like Material UI, Bootstrap, Bulma, etc, to actual libraries like [react-table](https://react-table.js.org/), which gives us many options to use and interact with the props in our components. In this post we will see a more in depth look.

## When to use

When we need to handle table data with tools like filtering, sorting, editing, pagination, all in one package.

## Installing dependencies

For an already created project:

```text
yarn add react-table
```

## How to use

Lets check the following code for a more visual representation and then explain what’s going on:

```javascript
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

const Table = ({ columns, data }) => {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { selectedRowIds },
    } = useTable(
    	{columns, data},
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => {
                id: 'selection',
                Header: ({ getToggleAllRowsSelectedProps }) => (
                	<IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                ),
                Cell: ({ row }) => (
        			<IndeterminateCheckbox { ...row.getToggleRowSelectedProps() } />
				),
          		...columns,
            })
        }
    )

    const tableHead = (
    	<thead>
        	{headerGroups.map(headerGroup => (
             	<tr {...headerGroup.getHeaderGroupProps()}>
             		{headerGroup.headers.map(column => (
                     	<th {...column.getHeaderProps()}>
                        	{column.render('Header')}
                        </th>
                     ))}
             	</tr>
             ))}
        </thead>
    )

    const tableBody = (
    	<tbody {...getTableBodyProps()}>
        	{rows.slice(0, 10).map(row => {
                prepareRow(row)
                return (
                	<tr {...row.getRowProps()}>
                    	{row.cells.map(cell => (
                        	<td {...cell.getCellProps()}>
                            	{cell.render('cell')}
                            </td>
                        ))}
                    </tr>
                )
            })}
        </thead>
    )

    return (
    	<table {...getTableProps()}>
        	{tableHead}
			{tableBody}
        </table>
    )
}
```

This is our main component Table, now lets go from bottom to up. We have a HTML tag table as a container for the headers and body of the table because that’s what tables are consist of.

If we check the header called in this case `tableHead`, we’re mapping some… `headerGroups`? This array comes from `react-table`, more precisely `import { useTable, useRowSelect } from ‘react-table’`, where `useTable` takes three parameters in this example, an object with the `column` and `data` available which is sent by props, we will see how it looks like, the second (optional) property `useTables` takes is the `useRowSelect` hook that comes from the same `react-table` which is used for adding a **checkbox** to the tables, and talking about checkbox, the third (optional) property is a function that adds the checkbox to our table.

Easy right? `useTable` has the following props:

- `getTableProps`: We assign it to our `table` HTML tag which will act as a wrapper.
- `getTableBodyProps`: We assign it to our `tbody` HTML tag which will act as a wrapper.
- `headerGroups`: We assign it to our `thead` HTML tag which will act as a wrapper.
- `rows`: An array of materialized row objects from the original data array and columns passed into the table options
- `prepareRow`: This function is responsible for lazily preparing a row for rendering. Any row that you intend to render in your table needs to be passed to this function before every render.
- `state: { selectedRowIds }`

Those are the ones we used, for the rest of props check this [link](https://react-table.tanstack.com/docs/api/overview) and for applied examples check [here](https://react-table.tanstack.com/docs/examples/basic).

If we check the code we put initially, in `tableBody` we’re preparing the body with the properties to react to our needs, this is a mechanical process we do with our component every time we want to use `react-table`.

Using this component:

```javascript
const tableData = [
  {
    firstName: "Adrian",
    age: 31,
  },
  {
    firstName: "Jesus",
    age: 19,
  },
];

// accessor reads the data key with the same name
// accessor reads 'firstName' gets assigned the value 'Adrian'
const tableColumn = [
  {
    Header: "First Name",
    accessor: "firstName",
  },
  {
    Header: "Age",
    accessor: "age",
  },
];

const UserTable = ({ tableData, tableColumn }) => {
  const data = useMemo(() => tableData, [tableData]);
  const column = useMemo(() => tableColumn, [tableColumn]);

  return <Table columns={column} data={data} />;
};
```

The component we made before is called Table and it takes two props in this case, data and column, which are arrays of objects where **column** communicates with **data** through the accessor, then we need to memoize the data applying `useMemo` which will prevent useless renderings and will only do it when the internal data changes.

If we need it to be responsive, like we should, then the docs has a great example in how to do it.

```css
padding: 1rem;
table {
  border-spacing: 0;
  border: 1px solid black;

  tr {
    :last-child {
      td {
        border-bottom: 0;
      }
    }
  }

  th,
  td {
    margin: 0;
    padding: 0.5rem;
    border-bottom: 1px solid black;
    border-right: 1px solid black;

    :last-child {
      border-right: 0;
    }
  }
}
```

## Conclusion

We have learned how to use react-table! This was a long waited library I wanted to get my hands on as soon as possible because it gives us a lot of tools to create great tables with low work from our behalf reducing time in finishing the app you’re working on.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
