---
title: "Optimize long lists using list virtualization"
description: "Let's learn how to optimize our performance for long lists. The idea is to render only the visible rows, let's check how to do this in detail."
category: ["react", "frontend", "concept"]
pubDate: "2023-11-25"
published: true
---

> **List virtualization**, or "windowing", is the concept of only rendering what is visible to the user. The number of elements that are rendered at first is a very small subset of the entire list and the "window" of visible content _moves_ when the user continues to scroll. This improves both the rendering and scrolling performance of the list

## How does list virtualization work?

`Virtualizing` a list of items involves maintaining a window and moving that window around your list, it works by:

- Having a small container DOM element (example `<ul>`) with relative positioning (window)
- Having a big DOM element for scrolling
- Absolutely positioning children inside the container, setting their styles for top, left, width and height.

Instead of rendering 1000s of elements at once, virtualization focuses on rendering just items visible to the user.

## React Window

In React we can use a library called `react-window` which we can install using:

`npm install --save react-window`.

And the related libraries to `react-window` that improves its functionality are:

- `react-virtualized-auto-sizer`: HOC that grows to fit all of the available space and passes the width and height values to its child.
- `react-window-infinite-loader`: Helps break large data sets down into chunks that can be just-in-time loaded as they are scrolled into view. It can also be used to create infinite loading lists (e.g. Facebook or Twitter).
- `react-vtree`: Lightweight and flexible solution to render large tree structures (e.g., file system).

It brings different components:

### <FixedSizeList>

React component responsible for rendering the individual item specified by an `index` prop. This component also receives a `style` prop (used for positioning).

If `useIsScrolling` is enabled for the list, the component also receives an additional `isScrolling` `boolean` prop.

Function components are useful for rendering simple items:

```javascript
<FixedSizeList {...props}>
  {({ index, style }) => <div style={style}>Item {index}</div>}
</FixedSizeList>
```

Let's see an example of a traditional rendering of a long list:

```javascript
import React from "react";
import ReactDOM from "react-dom";

const itemsArray = [
  { name: "Drake" },
  { name: "Halsey" },
  { name: "Camillo Cabello" },
  { name: "Travis Scott" },
  { name: "Bazzi" },
  { name: "Flume" },
  { name: "Nicki Minaj" },
  { name: "Kodak Black" },
  { name: "Tyga" },
  { name: "Buno Mars" },
  { name: "Lil Wayne" }, ...
]; // our data

const Row = ({ index, style }) => (
  <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
    {itemsArray[index].name}
  </div>
);

const Example = () => (
  <div
    style=
    class="List"
  >
    {itemsArray.map((item, index) => Row({ index }))}
  </div>
);

ReactDOM.render(<Example />, document.getElementById("root"));
```

Now if we use `react-window`:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { FixedSizeList as List } from "react-window";

const itemsArray = [...]; // our data

const Row = ({ index, style }) => (
  <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
    {itemsArray[index].name}
  </div>
);

const Example = () => (
  <List
    className="List"
    height={150}
    itemCount={itemsArray.length}
    itemSize={35}
    width={300}
  >
    {Row}
  </List>
);

ReactDOM.render(<Example />, document.getElementById("root"));
```

### <FixedSizeGrid>

Grid renders **tabular data** with virtualization along the vertical and horizontal axes (`FizedSizeGrid`, `VariableSizeGid`). It only renders the Grid cells needed to fill itself based on current horizontal/vertical scroll positions.

If we wanted to render the same list as earlier:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { FixedSizeGrid as Grid } from 'react-window';

const itemsArray = [
  [{},{},{},...],
  [{},{},{},...],
  [{},{},{},...],
  [{},{},{},...],
];

const Cell = ({ columnIndex, rowIndex, style }) => {
  let className
  if (columnIndex % 2) {
  	if (rowIndex % 2 === 0) {
      className = 'GridItemOdd'
    } else {
      className = 'GridItemEven'
    }
  } else {
    if (rowIndex % 2) {
      className = 'GridItemOdd'
    } else {
      className = 'GridItemEven'
    }
  }
  return (
      <div className={className} style={style}>
      	{itemsArray[rowIndex][columnIndex].name}
      </div>
  )
};

const Example = () => (
  <Grid
    className="Grid"
    columnCount={5}
    columnWidth={100}
    height={150}
    rowCount={5}
    rowHeight={35}
    width={300}
  >
    {Cell}
  </Grid>
);

ReactDOM.render(<Example />, document.getElementById('root'));
```

### Infinite Loader

For an infinite loader on a grid:

```javascript
import React, { Component } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
...
  render() {
    return (
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        loadMoreItems={loadMoreItems}
        itemCount={count + 1}
      >
        {({ onItemsRendered, ref }) => (
          <Grid
            onItemsRendered={this.onItemsRendered(onItemsRendered)}
            columnCount={COLUMN_SIZE}
            columnWidth={180}
            height={800}
            rowCount={Math.max(this.state.count / COLUMN_SIZE)}
            rowHeight={220}
            width={1024}
            ref={ref}
          >
            {this.renderCell}
          </Grid>
        )}
      </InfiniteLoader>
    );
  }
}
```

For an infinite loader on a list, we can create a wrapper called `ExampleWrapper`:

```javascript
import React from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

export default function ExampleWrapper({
  // Are there more items to load?
  // (This information comes from the most recent API request.)
  hasNextPage,

  // Are we currently loading a page of items?
  // (This may be an in-flight flag in your Redux store for example.)
  isNextPageLoading,

  // Array of items loaded so far.
  items,

  // Callback function responsible for loading the next page of items.
  loadNextPage,
}) {
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index) => !hasNextPage || index < items.length;

  // Render an item or a loading indicator.
  const Item = ({ index, style }) => {
    let content;
    if (!isItemLoaded(index)) {
      content = "Loading...";
    } else {
      content = items[index].name;
    }

    return <div style={style}>{content}</div>;
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          className="List"
          height={150}
          itemCount={itemCount}
          itemSize={30}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width={300}
        >
          {Item}
        </List>
      )}
    </InfiniteLoader>
  );
}
```

To apply it:

```javascript
import React, { useState, useCallback } from "react";
import { name } from "faker";
import ExampleWrapper from "./ExampleWrapper";

const App = () => {
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [items, setItems] = useState([]);

  const loadNextPage = useCallback(
    (...args) => {
      setIsNextPageloading(true);
      setTimeOut(() => {
        setHasNextPage(items.length < 100);
        setIsNextPageLoading(false);
        const newItems = [...items].concat(
          new Array(10).fill(true).map(() => ({ name: name.findName() }))
        );
        setItems(newItems);
      }, 2500);
    },
    [isNextPageLoading]
  );

  return (
    <>
      <ExampleWrapper
        hasNextPage={hasNextPage}
        isNextPageLoading={isNextPageLoading}
        items={items}
        loadNextPage={loadNextPage}
      />
    </>
  );
};
```

## Conclusion

Today we learned about how to properly optimize long lists of data properly using `react-window`, continuing from the previous post about [Optimize the performance of your applications](https://react-graphql-nextjs-blog.vercel.app/post/optimize-applications), this is a great way of reducing the initial loading time and especially avoid rendering data the user is not going to see yet.

See you on the next post.

Sincerely,

**End. Adrian Beria**
