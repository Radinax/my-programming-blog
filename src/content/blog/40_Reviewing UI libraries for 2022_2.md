---
title: "Reviews of UI libraries. Part 2: Radix UI and Headless UI"
description: "We have taken a look at the logic in our past posts, now I want to focus more on the UI part of the applications and making them both pretty and performant. Today we will check some very popular UI libraries like Chakra UI, Radix UI, Headless UI, Mantine, Daisy UI and Prime React."
category: ["review"]
pubDate: "2023-12-17"
published: true
---

UI libraries are a hot topic for Frontend in 2022, there are several popular ones and people have their own thoughts about which one is the best one for their needs. In this post we will go over the most popular ones.

I will consider the following rating system from 1-10:

- Versatility: How much freedom it gives the developer.
- Difficulty: How easy/hard it's to implement in a project.
- Depth: How many features it brings.
- Visuals: How pretty the components are.
- Documentation: How good is the documentation.
- Rating: The overall rating of the library.

# Radix UI.

> An open-source UI component library for building high-quality, accessible design systems and web apps.

Radix Primitives is a low-level UI component library with a focus on accessibility, customization and developer experience. You can use these components either as the base layer of your design system, or adopt them incrementally.

Sample code:

```jsx
import { styled } from "@stitches/react";
import * as Accordion from "@radix-ui/react-accordion";

const StyledAccordion = styled(Accordion.Root, {});
const StyledItem = styled(Accordion.Item, {});
const StyledHeader = styled(Accordion.Header, {});
const StyledTrigger = styled(Accordion.Trigger, {});
const StyledPanel = styled(Accordion.Content, {});

export default () => {
  return (
    <StyledAccordion type="single">
      <StyledItem value="item-1">
        <StyledHeader>
          <StyledTrigger>Trigger text</StyledTrigger>
        </StyledHeader>
        <StyledPanel>Panel content</StyledPanel>
      </StyledItem>
    </StyledAccordion>
  );
};
```

At first glance I'm seeing things I don't like:

- The `react-accordion` component has a lot of dependencies including `@babel/runtime`, which can be a problem because if you deploy your project on AWS you might run into some problems during the deployment.

The components have several dependencies with each other instead of self-contained.

Let's quickly go through some of the components:

## Accordion:

```jsx
import * as Accordion from "@radix-ui/react-accordion";

() => (
  <Accordion.Root>
    <Accordion.Item>
      <Accordion.Header>
        <Accordion.Trigger />
      </Accordion.Header>
      <Accordion.Content />
    </Accordion.Item>
  </Accordion.Root>
);
```

Too many components to implement something as simple as an Accordion. The style of the component is not good enough either to compete with other options.

## Alert Dialog:

```jsx
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export default () => (
  <AlertDialog.Root>
    <AlertDialog.Trigger />
    <AlertDialog.Portal>
      <AlertDialog.Overlay />
      <AlertDialog.Content>
        <AlertDialog.Title />
        <AlertDialog.Description />
        <AlertDialog.Cancel />
        <AlertDialog.Action />
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);
```

## Select:

```jsx
import * as Select from "@radix-ui/react-select";

export default () => (
  <Select.Root>
    <Select.Trigger>
      <Select.Value />
      <Select.Icon />
    </Select.Trigger>

    <Select.Content>
      <Select.ScrollUpButton />
      <Select.Viewport>
        <Select.Item>
          <Select.ItemText />
          <Select.ItemIndicator />
        </Select.Item>

        <Select.Group>
          <Select.Label />
          <Select.Item>
            <Select.ItemText />
            <Select.ItemIndicator />
          </Select.Item>
        </Select.Group>

        <Select.Separator />
      </Select.Viewport>
      <Select.ScrollDownButton />
    </Select.Content>
  </Select.Root>
);
```

Another bad implemention in terms of UX, with the inner menu going upwards. Too many components to implement it.

## Rating:

# Rating

- **Versatility**: 4 / 10.
- **Difficulty**: 8 / 10.
- **Depth**: 6 / 10.
- **Visuals**: 4 / 10.
- **Documentation**: 8 / 10.
- **Rating: 6**.

I don't really recommend Radix UI, lacks versatility, the styling option is outdated (a styled component approach was a 2019 era thing), you will end up with a sea of components in your JSX. The documentation is great though.

# Headless UI

> Completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.

This is a very simple to use library, self contained (a massive plus), uses Tailwind, the components are pretty but very customizable and the UX is clean.

Let's go through the components:

## Menu (Dropdown):

```jsx
import { Menu, Transition } from "@headlessui/react";

function MyDropdown() {
  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button>More</Menu.Button>

          {/* Use the Transition component. */}
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            {/* Mark this component as `static` */}
            <Menu.Items static>
              <Menu.Item>{/* ... */}</Menu.Item>
              {/* ... */}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
```

Going through this, the versatility of this library is outstanding, the documentation meantions it works very well with `framer-motion` and `react-spring` which can produce some powerful and lightweighted components.

## Listbox (select)

```jsx
import { useState, Fragment } from "react";
import { Listbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";

const people = [
  { id: 1, name: "Durward Reynolds", unavailable: false },
  { id: 2, name: "Kenton Towne", unavailable: false },
  { id: 3, name: "Therese Wunsch", unavailable: false },
  { id: 4, name: "Benedict Kessler", unavailable: true },
  { id: 5, name: "Katelyn Rohan", unavailable: false },
];

function MyListbox() {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);

  return (
    <Listbox value={selectedPerson} onChange={setSelectedPerson}>
      <Listbox.Button>{selectedPerson.name}</Listbox.Button>
      <Listbox.Options>
        {people.map((person) => (
          <Listbox.Option
            key={person.id}
            value={person}
            disabled={person.unavailable}
          >
            {({ active, selected }) => (
              <li
                className={`${
                  active ? "bg-blue-500 text-white" : "bg-white text-black"
                }`}
              >
                {selected && <CheckIcon />}
                {person.name}
              </li>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
}
```

Now this is really good! In the real world, you will never use the HTML native select, so this means you can easily customize this component to be used as a select component.

## Combobox (Autocomplete)

Another very powerful component and one that's not available in other UI libraries.

## Switch (Toggle)

Simple to use toggle, you can easily make one but its nice to have it out of the box. You can easily customize the animations as well.

## Disclosure

A bit rough, but with some animations it would be a little better.

## Dialog (Modal)

Another useful component in your everyday life as a developer.

## Popover

For when you need a more complex menu out of a dropdown. Pretty useful overall.

## Radio Group

A weird component to add, since you can easily do this with JSX. But its a welcome addition.

## Tabs

Another great component to have available.

## Transition

I prefer to use other options for animations but overall its pretty easy to use for people who aren't too familiar with animations.

## Rating

- **Versatility**: 10 / 10.
- **Difficulty**: 10 / 10.
- **Depth**: 7 / 10.
- **Visuals**: 7 / 10.
- **Documentation**: 10 / 10.
- **Rating: 8.8**.

# All ratings:

- Chakra UI: 6.8.
- Radix UI: 6.
- Headless UI: 8.8.

# Conclusion

As it shows I didn't like `Radix UI` at all, too many problems with dependencies of other libraries and when doing more complex work, it can produce a sea of JSX which hurts the developer experience.

`Headless UI` is the opposite, absolutely self contained, uses tailwind for customization, very easy to style and provides out of the box useful components like the powerful Combobox or the Listbox components. This is in my opinion and experience, the best UI library to use in 2022.

See you on the next post.

Sincerely,

**End. Adrian Beria**
