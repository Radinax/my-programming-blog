---
title: "Programming Patterns Part 1"
description: "This will be a series called 'Programming Patterns' where we will check some very useful ways of handling the code."
category: ["react", "frontend"]
pubDate: "2023-11-21"
published: true
---

## Provider Pattern Container

Using `context` we can create a container and custom hook to provide data to children's using a container:

```javascript
export const ThemeContext = React.createContext();

const themes = {
  light: { background: "#fff", color: "#000" },
  dark: { background: "#171717", color: "#fff" },
};

const ThemeProvider = () => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const providerValue = {
    theme: themes[theme],
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={providerValue}>
      {children}
    </ThemeContext.Provider>
  );
};
```

Inside our `App.js`:

```javascript
export default function App() {
    return (
    	<div>
        	<Themeprovider>
        		<Toggle />
        		<List />
        	</ThemeProvider>
        </div>
    )
}
```

We create a custom hook:

```javascript
function useThemeContext() {
  const theme = useContext(ThemeContext);
  if (!theme)
    throw new Error("iseThemeContext must be used withing ThemeProvider");

  return theme;
}
```

And inside the `List` children:

```javascript
export default function List() {
  const { theme } = useThemeContext();

  return <li style={theme}>...</li>;
}
```

## Container-Presentational Pattern

### Presentational Pattern

A presentational component receives its data through props. Its primary function is to simply display the data it receives the way we want them to, including styles, without modifying that data.

Presentational components are usually stateless: they do not contain their own React state, unless they need a state for UI purposes. The data they receive, is not altered by the presentational components themselves.

### Container Components

The primary function of container components is to pass data to presentational components, which they contain. Container components themselves usually don't render any other components besides the presentational components that care about their data. Since they don't render anything themselves, they usually do not contain any styling either.

## Observer Pattern

With the observer pattern, we can subscribe certain objects, the observers, to other another object, called the observable. Whenever an event occurs, the observable notifies all its observers!

An observable object usually contains 3 important parts:

- `observers`: an array of observers that will get notified whenever a specific event occurs.
- `subscribe()`: a method in order to add observers to the observers list
- `unsubscribe()`: a method in order to remove observers from the observers list
- `notify()`: a method to notify all observers whenever a specific event occurs

```javascript
// Observable.js
class Observable {
    constructor() {
        this.observers: []
    }
    subscribe(f) {
        this.observers.push(f)
    }
    unsubscribe(f) {
        this.observers = this.observers.filter(subscriber => subscriber !== f)
    }
    notify(data) {
        this.observers.forEach(observer => observer(data))
    }

}

export default new Observable()
```

Inside an `App.js` file:

```javascript
import React from 'react'
import { Button, Switch, FormControlLabel } from '@material-ui/core'
import { ToastContainer, toast } from 'react-toastify'
import observable from './Observable'

const handleClick = () => observable.notify('User clicked button!')
const handleToggle = () => observable.notify('User toggled switch!')
const logger = data => console.log(`${Date.now()} ${data}`)
const toastify = data => toast(data, {
    positiion: toast.POSITION.BOTTOM_RIGHT,
    closeButton: false,
    autoClose: 2000
})

observable.subscribe(logger)
observable.subscribe(toastify)

const App = () => {
    return (
    	<div>
        	<Button vartiant"contained" onClick={handleClick}>
        		Click me!
        	</Button>
			<FormControlLabel>
            	control={<Switch name="" onChange={handleToggle} />}
                label="Toggle me!"
            </FormControlLabel>
			<ToastContainer />
        </div>
    )
}
```

Although we can use the observer pattern in many ways, it can be very useful when working with asynchronous, event-based data. Maybe you want certain components to get notified whenever certain data has finished downloading, or whenever users sent new messages to a message board and all other members should get notified.

## Custom Hook

Let's use a `useHover` hook:

```javascript
import { useState, useRef, useEffect } from "react";

const useHover = () => {
  const [hovering, setHover] = useState(false);
  const ref = useRef(null);

  const handleMouseOver = () => setHover(true);
  const handleMouseOut = () => setHover(false);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener("mouseover", handleMouseOver);
      node.addEventListener("mouseoout", handleMouseOut);
      return () => {
        node.removeEventListener("mouseover", handleMouseOver);
        node.removeEventListener("mouseoout", handleMouseOut);
      };
    }
  }, [ref.current]);

  return [ref, hovering];
};
```

Applying it:

```javascript
import React from "react";
import useHover from "./useHover";

const Images = () => {
  const [hoverRef, hovering] = useHover();

  return (
    <div ref={hoverRef} {...props}>
      {hovering && <div>Hovering!</div>}
      <div>A simple div</div>
    </div>
  );
};
```

## Compound Pattern

The compound component pattern allows you to create components that all work together to perform a task.

Let's check an example with `context`:

```javascript
const FlyOutContext = React.createContext();

const FlyOut = ({ children }) => {
  const [toggle, setToggle] = React.useState(false);
  return (
    <FlyOutContext.Provider value={{ toggle, setToggle }}>
      {children}
    </FlyOutContext.Provider>
  );
};

const Toggle = () => {
  const { toggle, setToggle } = React.useContext(FlyOutContext);
  return (
    <div onClick={() => setToggle(!toggle)}>
      Toggle is {open ? "on" : "off"}
    </div>
  );
};

const List = ({ children }) => {
  const { toggle } = React.useContext(FlyOutContext);
  return open && <ul>{children}</ul>;
};

const Item = ({ children }) => <li>{children}</li>;

FlyOut.Toggle = Toggle;
FlyOut.List = List;
FlyOut.Item = Item;
```

By assigning `FlyOut.Toggle` a value of `Toggle` which is the component we created, we can use this inside another component.

```javascript
import React from 'react'
import { FlyOut } from './FlyOut'

const FlyoutMenu = () => (
	<FlyOut>
    	<FlyOut.Toggle />
    	<FlyOut.List>
    		<FlyOut.Item>Edit</FlyOut.Item>
    		<FlyOut.Item>Delete</FlyOut.Item>
    	</FlyOut.List>
    </Flyout>
)
```

The compound pattern is great when you're building a component library. You'll often see this pattern when using UI libraries like Semantic UI.

## Conclusion

We get to learn some very useful Programming Patterns! The ones showed today are very useful and let us save time and organize our code in a better way.

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
