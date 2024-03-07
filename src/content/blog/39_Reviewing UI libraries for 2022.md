---
title: "Reviews of UI libraries. Part 1: Chakra UI"
description: "We have taken a look at the logic in our past posts, now I want to focus more on the UI part of the applications and making them both pretty and performant. Today we will check some very popular UI libraries like Chakra UI, Radix UI, Headless UI, Mantine, Daisy UI and Prime React."
category: ["review"]
pubDate: "2023-12-16"
published: true
---

UI libraries are a hot topic for Frontend in 2022, there are several popular ones and people have their own thoughts about which one is the best one for their needs. In this post we will go over the most popular ones.

I will not cover Bootstrap or Material Design, reason is that they don't give enough versatility to be a viable choice. They're great if you don't have a designer, but its very common that a designer or the clients gives you a wireframe that is hard to reproduce using those two libraries, making you fight the library more than it helps you.

I will consider the following rating system from 1-10:

- Versatility: How much freedom it gives the developer.
- Difficulty: How easy/hard it's to implement in a project.
- Depth: How many features it brings.
- Visuals: How pretty the components are.
- Documentation: How good is the documentation.
- Rating: The overall rating of the library.

# Chakra UI.

> Chakra UI is a simple, modular and accessible component library that gives you the building blocks you need to build your React applications.

Among the community, this is probably the most popular choice, it gives you a lot of tools to create awesome applications.

Its characteristics:

- Accessible: Chakra UI strictly follows WAI-ARIA standards for all components.
- Themeable: Customize any part of our components to match your design needs.
- Composable: Designed with composition in mind. Compose new components with ease.
- Light and Dark UI: Optimized for multiple color modes. Use light or dark, your choice.
- Developer Experience: Guaranteed to boost your productivity when building your app or website.
- Active Community: We're a team of active maintainers ready to help you whenever you need.

Sample Code:

```jsx
import * as React from "react";
import { Box, Center, Image, Flex, Badge, Text } from "@chakra-ui/react";
import { MdStar } from "react-icons/md";

export default function Example() {
  return (
    <Center h="100vh">
      <Box p="5" maxW="320px" borderWidth="1px">
        <Image borderRadius="md" src="https://bit.ly/2k1H1t6" />
        <Flex align="baseline" mt={2}>
          <Badge colorScheme="pink">Plus</Badge>
          <Text
            ml={2}
            textTransform="uppercase"
            fontSize="sm"
            fontWeight="bold"
            color="pink.800"
          >
            Verified • Cape Town
          </Text>
        </Flex>
        <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
          Modern, Chic Penthouse with Mountain, City & Sea Views
        </Text>
        <Text mt={2}>$119/night</Text>
        <Flex mt={2} align="center">
          <Box as={MdStar} color="orange.400" />
          <Text ml={1} fontSize="sm">
            <b>4.84</b> (190)
          </Text>
        </Flex>
      </Box>
    </Center>
  );
}
```

Check the **sandbox** [here](https://codesandbox.io/s/pme2ow?file=%2FApp.tsx&from-sandpack=true).

If you were to reproduce this with HTML/CSS it would be pretty much the same order, also, the props are very easy to understand, like `mt={2}` is `margin-top: 2rem`.

A few observations though:

- Looking at the `Text` component, it might be too annoying to use this component all the time when you could just create a custom class with Tailwind and create a system for this to be reused with a simple utility class.
- The readability is hurt when there are many components composing a view. This is easily solved using BEM naming convention when working with Tailwind and module CSS for example.

Going through the documentation, it provides step by step guides for CRA, Next, Gatsby, Blitz, Redwood, Remix and Vite.

Checking the Vite installation instruction:

```text
npm i @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^6
```

It has dependencies with `emotion`, `framer-motion` and `styled`, which in my opinion, is too bloated.

## Layout

### Aspect Ratio

For a square video, we assign a ratio of 1.

```jsx
// This video will have equal sides
<AspectRatio maxW="560px" ratio={1}>
  <iframe
    title="naruto"
    src="https://www.youtube.com/embed/QhBnZ6NPOY0"
    allowFullScreen
  />
</AspectRatio>
```

For a 16 / 9:

```jsx
<AspectRatio maxW="400px" ratio={16 / 9}>
  <Image src="https://bit.ly/naruto-sage" alt="naruto" objectFit="cover" />
</AspectRatio>
```

### Box

```jsx
<Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
  <Box bg="tomato" w="100%" p={4} color="white">
    This is the Box
  </Box>
  <Box display="flex" alignItems="baseline">
    <Badge borderRadius="full" px="2" colorScheme="teal">
      New
    </Badge>
    <Badge borderRadius="full" px="2" colorScheme="teal">
      Old
    </Badge>
  </Box>
</Box>
```

### Center

Put any child element inside it, give it any width or/and height, it'll ensure the child is centered.

```jsx
 <Center w='40px' h='40px' bg='tomato' color='white'>
    <PhoneIcon />
  </Center>
  <Center w='40px' h='40px' bg='tomato' color='white'>
    <Box as='span' fontWeight='bold' fontSize='lg'>
      1
    </Box>
  </Center>
```

### Container

Containers are used to constrain a content's width to the current breakpoint, while keeping it fluid.

```jsx
<Container maxW="2xl" bg="blue.600" centerContent>
  <Box padding="4" bg="blue.400" color="black" maxW="md">
    There are many benefits to a joint design and development system. Not only
    does it bring benefits to the design team, but it also brings benefits to
    engineering teams. It makes sure that our experiences have a consistent look
    and feel, not just in our design specs, but in production.
  </Box>
</Container>
```

### Flex

Flex is Box with display: flex and comes with helpful style shorthand. It renders a div element.

```jsx
<Flex>
  <Box p="4" bg="red.400">
    Box 1
  </Box>
  <Spacer />
  <Box p="4" bg="green.400">
    Box 2
  </Box>
</Flex>
```

Its props are `align`, `basis`, `direction`, `grow`, `justify`, `shrink`, `wrap`.

### Grid

Grid is Box with display: grid and it comes with helpful style shorthand. It renders a div element.

```jsx
<Grid
  h="200px"
  templateRows="repeat(2, 1fr)"
  templateColumns="repeat(5, 1fr)"
  gap={4}
>
  <GridItem rowSpan={2} colSpan={1} bg="tomato" />
  <GridItem colSpan={2} bg="papayawhip" />
  <GridItem colSpan={2} bg="papayawhip" />
  <GridItem colSpan={4} bg="tomato" />
</Grid>
```

### Simple Grid

SimpleGrid provides a friendly interface to create responsive grid layouts with ease. It renders a div element with display: grid.

```jsx
<SimpleGrid columns={[2, null, 3]} spacing="40px">
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
</SimpleGrid>
```

### Stack

Stack is a layout component that makes it easy to stack elements together and apply a space between them. It uses a modified version of the CSS lobotomized owl selector to add spacing between its children.

```jsx
<HStack spacing="24px">
  <Box w="40px" h="40px" bg="yellow.200">
    1
  </Box>
  <Box w="40px" h="40px" bg="tomato">
    2
  </Box>
  <Box w="40px" h="40px" bg="pink.100">
    3
  </Box>
</HStack>
```

### Wrap

Wrap is a layout component that adds a defined space between its children. It wraps its children automatically if there isn't enough space to fit any more in the same row.

```jsx
<Wrap>
  <WrapItem>
    <Center w="180px" h="80px" bg="red.200">
      Box 1
    </Center>
  </WrapItem>
  <WrapItem>
    <Center w="180px" h="80px" bg="green.200">
      Box 2
    </Center>
  </WrapItem>
  <WrapItem>
    <Center w="180px" h="80px" bg="tomato">
      Box 3
    </Center>
  </WrapItem>
  <WrapItem>
    <Center w="180px" h="80px" bg="blue.200">
      Box 4
    </Center>
  </WrapItem>
</Wrap>
```

## Forms

### Button

```jsx
<Stack spacing={4} direction="row" align="center">
  <Button colorScheme="teal" size="xs">
    Button
  </Button>
  <Button colorScheme="teal" size="sm">
    Button
  </Button>
  <Button colorScheme="teal" size="md">
    Button
  </Button>
  <Button colorScheme="teal" size="lg">
    Button
  </Button>
</Stack>
```

### Checkbox

```jsx
<Checkbox defaultChecked>Checkbox</Checkbox>
```

### Editable

Editable Text is used for inline renaming of some text. It appears as normal UI text but transforms into a text input field when the user clicks on or focuses it.

```jsx
// Click the text to edit
<Editable defaultValue="Take some chakra">
  <EditablePreview />
  <EditableInput />
</Editable>
```

### Form Control

https://chakra-ui.com/docs/components/form/form-control

### Icon Button

```jsx
<IconButton
  colorScheme="blue"
  aria-label="Search database"
  icon={<SearchIcon />}
/>
```

### Input

```jsx
<Stack spacing={3}>
  <Input placeholder="extra small size" size="xs" />
  <Input placeholder="small size" size="sm" />
  <Input placeholder="medium size" size="md" />
  <Input placeholder="large size" size="lg" />
</Stack>
```

### Radio

```jsx
<RadioGroup defaultValue="2">
  <Stack spacing={5} direction="row">
    <Radio colorScheme="red" value="1">
      Radio
    </Radio>
    <Radio colorScheme="green" value="2">
      Radio
    </Radio>
  </Stack>
</RadioGroup>
```

### Range Slider

```jsx
<RangeSlider aria-label={["min", "max"]} defaultValue={[10, 30]}>
  <RangeSliderTrack>
    <RangeSliderFilledTrack />
  </RangeSliderTrack>
  <RangeSliderThumb index={0} />
  <RangeSliderThumb index={1} />
</RangeSlider>
```

### Select

```jsx
<Stack spacing={3}>
  <Select placeholder="extra small size" size="xs" />
  <Select placeholder="small size" size="sm" />
  <Select placeholder="medium size" size="md" />
  <Select placeholder="large size" size="lg" />
</Stack>
```

### Slider

```jsx
<Slider aria-label="slider-ex-1" defaultValue={30}>
  <SliderTrack>
    <SliderFilledTrack />
  </SliderTrack>
  <SliderThumb />
</Slider>
```

### Switch

```jsx
<Stack align="center" direction="row">
  <Switch size="sm" />
  <Switch size="md" />
  <Switch size="lg" />
</Stack>
```

### Textarea

```jsx
<Textarea placeholder="Here is a sample placeholder" />
```

## Data Display

### Badge

```jsx
<Stack direction="row">
  <Badge variant="outline" colorScheme="green">
    Default
  </Badge>
  <Badge variant="solid" colorScheme="green">
    Success
  </Badge>
  <Badge variant="subtle" colorScheme="green">
    Removed
  </Badge>
</Stack>
```

### Code

```jsx
<Stack direction="row">
  <Code children="console.log(welcome)" />
  <Code colorScheme="red" children="var chakra = 'awesome!'" />
  <Code colorScheme="yellow" children="npm install chakra" />
</Stack>
```

### Divider

```jsx
<Divider orientation="horizontal" />
```

```jsx
<Center height="50px">
  <Divider orientation="vertical" />
</Center>
```

### Kbd

```jsx
<span>
  <Kbd>shift</Kbd> + <Kbd>H</Kbd>
</span>
```

### List

```jsx
<UnorderedList>
  <ListItem>Lorem ipsum dolor sit amet</ListItem>
  <ListItem>Consectetur adipiscing elit</ListItem>
  <ListItem>Integer molestie lorem at massa</ListItem>
  <ListItem>Facilisis in pretium nisl aliquet</ListItem>
</UnorderedList>
```

### Stat

```jsx
<StatGroup>
  <Stat>
    <StatLabel>Sent</StatLabel>
    <StatNumber>345,670</StatNumber>
    <StatHelpText>
      <StatArrow type="increase" />
      23.36%
    </StatHelpText>
  </Stat>

  <Stat>
    <StatLabel>Clicked</StatLabel>
    <StatNumber>45</StatNumber>
    <StatHelpText>
      <StatArrow type="decrease" />
      9.05%
    </StatHelpText>
  </Stat>
</StatGroup>
```

### Table

```jsx
<TableContainer>
  <Table variant="simple">
    <TableCaption>Imperial to metric conversion factors</TableCaption>
    <Thead>
      <Tr>
        <Th>To convert</Th>
        <Th>into</Th>
        <Th isNumeric>multiply by</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>inches</Td>
        <Td>millimetres (mm)</Td>
        <Td isNumeric>25.4</Td>
      </Tr>
      <Tr>
        <Td>feet</Td>
        <Td>centimetres (cm)</Td>
        <Td isNumeric>30.48</Td>
      </Tr>
      <Tr>
        <Td>yards</Td>
        <Td>metres (m)</Td>
        <Td isNumeric>0.91444</Td>
      </Tr>
    </Tbody>
    <Tfoot>
      <Tr>
        <Th>To convert</Th>
        <Th>into</Th>
        <Th isNumeric>multiply by</Th>
      </Tr>
    </Tfoot>
  </Table>
</TableContainer>
```

### Tag

```jsx
<HStack spacing={4}>
  {["sm", "md", "lg"].map((size) => (
    <Tag size={size} key={size} variant="solid" colorScheme="teal">
      Teal
    </Tag>
  ))}
</HStack>
```

## Feedback

### Alert

```jsx
<Stack spacing={3}>
  <Alert status="error">
    <AlertIcon />
    There was an error processing your request
  </Alert>

  <Alert status="success">
    <AlertIcon />
    Data uploaded to the server. Fire on!
  </Alert>

  <Alert status="warning">
    <AlertIcon />
    Seems your account is about expire, upgrade now
  </Alert>

  <Alert status="info">
    <AlertIcon />
    Chakra is going live on August 30th. Get ready!
  </Alert>
</Stack>
```

### Circular Progress

```jsx
<CircularProgress value={40} color="green.400">
  <CircularProgressLabel>40%</CircularProgressLabel>
</CircularProgress>
```

### Progress

```jsx
<Progress value={80} />
```

### Skeleton

```jsx
<Stack>
  <Skeleton height="20px" />
  <Skeleton height="20px" />
  <Skeleton height="20px" />
</Stack>
```

Or

```jsx
<Box padding="6" boxShadow="lg" bg="white">
  <SkeletonCircle size="10" />
  <SkeletonText mt="4" noOfLines={4} spacing="4" />
</Box>
```

### Spinner

```jsx
<Stack direction="row" spacing={4}>
  <Spinner size="xs" />
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
  <Spinner size="xl" />
  <Spinner
    thickness="4px"
    speed="0.65s"
    emptyColor="gray.200"
    color="blue.500"
    size="xl"
  />
</Stack>
```

### Toast

```jsx
function ToastExample() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      }
    >
      Show Toast
    </Button>
  );
}
```

## Typography

### Text

```jsx
<>
  <Text as="i">Italic</Text>
  <br />
  <Text as="u">Underline</Text>
  <br />
  <Text as="abbr">I18N</Text>
  <br />
  <Text as="cite">Citation</Text>
  <br />
  <Text as="del">Deleted</Text>
  <br />
  <Text as="em">Emphasis</Text>
  <br />
  <Text as="ins">Inserted</Text>
  <br />
  <Text as="kbd">Ctrl + C</Text>
  <br />
  <Text as="mark">Highlighted</Text>
  <br />
  <Text as="s">Strikethrough</Text>
  <br />
  <Text as="samp">Sample</Text>
  <br />
  <Text as="sub">sub</Text>
  <br />
  <Text as="sup">sup</Text>
</>
```

### Heading

```jsx
<Stack spacing={6}>
  <Heading as="h1" size="4xl" isTruncated>
    (4xl) In love with React & Next
  </Heading>
  <Heading as="h2" size="3xl" isTruncated>
    (3xl) In love with React & Next
  </Heading>
  <Heading as="h2" size="2xl">
    (2xl) In love with React & Next
  </Heading>
  <Heading as="h2" size="xl">
    (xl) In love with React & Next
  </Heading>
  <Heading as="h3" size="lg">
    (lg) In love with React & Next
  </Heading>
  <Heading as="h4" size="md">
    (md) In love with React & Next
  </Heading>
  <Heading as="h5" size="sm">
    (sm) In love with React & Next
  </Heading>
  <Heading as="h6" size="xs">
    (xs) In love with React & Next
  </Heading>
</Stack>
```

## Overlay

### Alert Dialog

```jsx
function AlertDialogExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Delete Customer
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onClose} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
```

### Drawer

```jsx
function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

### Menu

```jsx
<Menu>
  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
    Actions
  </MenuButton>
  <MenuList>
    <MenuItem>Download</MenuItem>
    <MenuItem>Create a Copy</MenuItem>
    <MenuItem>Mark as Draft</MenuItem>
    <MenuItem>Delete</MenuItem>
    <MenuItem>Attend a Workshop</MenuItem>
  </MenuList>
</Menu>
```

### Modal

```jsx
function BasicUsage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Lorem count={2} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

### Popover

```jsx
<Popover>
  <PopoverTrigger>
    <Button>Trigger</Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverArrow />
    <PopoverCloseButton />
    <PopoverHeader>Confirmation!</PopoverHeader>
    <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
  </PopoverContent>
</Popover>
```

### Tooltip

```jsx
<Tooltip label="Hey, I'm here!" aria-label="A tooltip">
  Hover me
</Tooltip>
```

## Disclosure

### Accordion

```jsx
<Accordion defaultIndex={[0]} allowMultiple>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex="1" textAlign="left">
          Section 1 title
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex="1" textAlign="left">
          Section 2 title
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
</Accordion>
```

### Tabs

```jsx
<Tabs>
  <TabList>
    <Tab>One</Tab>
    <Tab>Two</Tab>
    <Tab>Three</Tab>
  </TabList>

  <TabPanels>
    <TabPanel>
      <p>one!</p>
    </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
    <TabPanel>
      <p>three!</p>
    </TabPanel>
  </TabPanels>
</Tabs>
```

### Visually Hidden

```jsx
function Example() {
  return (
    <Box>
      <Heading>Title and description</Heading>
      <VisuallyHidden>This will be hidden</VisuallyHidden>
    </Box>
  );
}
```

## Navigation

### Breadcrumb

```jsx
<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink href="#">Home</BreadcrumbLink>
  </BreadcrumbItem>

  <BreadcrumbItem>
    <BreadcrumbLink href="#">Docs</BreadcrumbLink>
  </BreadcrumbItem>

  <BreadcrumbItem isCurrentPage>
    <BreadcrumbLink href="#">Breadcrumb</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
```

### Link

```jsx
<Link href="https://chakra-ui.com" isExternal>
  Chakra Design system <ExternalLinkIcon mx="2px" />
</Link>
```

### Link Overlay

```jsx
<LinkBox as="article" maxW="sm" p="5" borderWidth="1px" rounded="md">
  <Box as="time" dateTime="2021-01-15 15:30:00 +0000 UTC">
    13 days ago
  </Box>
  <Heading size="md" my="2">
    <LinkOverlay href="#">
      New Year, New Beginnings: Smashing Workshops & Audits
    </LinkOverlay>
  </Heading>
  <Text mb="3">
    Catch up on what’s been cookin’ at Smashing and explore some of the most
    popular community resources.
  </Text>
  <Box as="a" color="teal.400" href="#" fontWeight="bold">
    Some inner link
  </Box>
</LinkBox>
```

## Media and Icons

### Avatar

```jsx
<Wrap>
  <WrapItem>
    <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
  </WrapItem>
  <WrapItem>
    <Avatar name="Kola Tioluwani" src="https://bit.ly/tioluwani-kolawole" />
  </WrapItem>
  <WrapItem>
    <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
  </WrapItem>
  <WrapItem>
    <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
  </WrapItem>
  <WrapItem>
    <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
  </WrapItem>
  <WrapItem>
    <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
  </WrapItem>
  <WrapItem>
    <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
  </WrapItem>
</Wrap>
```

### Icon

```jsx
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'

// The default icon size is 1em (16px)
<PhoneIcon />

// Use the `boxSize` prop to change the icon size
<AddIcon w={6} h={6} />

// Use the `color` prop to change the icon color
<WarningIcon w={8} h={8} color="red.500" />
```

### Image

```jsx
<Stack direction="row">
  <Image
    boxSize="100px"
    objectFit="cover"
    src="https://bit.ly/dan-abramov"
    alt="Dan Abramov"
  />
  <Image
    boxSize="150px"
    objectFit="cover"
    src="https://bit.ly/dan-abramov"
    alt="Dan Abramov"
  />
  <Image boxSize="200px" src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
</Stack>
```

## Other

### Close Button

```jsx
<CloseButton />
```

### Transitions

```jsx
function FadeEx() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Button onClick={onToggle}>Click Me</Button>
      <Fade in={isOpen}>
        <Box
          p="40px"
          color="white"
          mt="4"
          bg="teal.500"
          rounded="md"
          shadow="md"
        >
          Fade
        </Box>
      </Fade>
    </>
  );
}
```

# Rating

- **Versatility**: 6 / 10.
- **Difficulty**: 7 / 10.
- **Depth**: 7 / 10.
- **Visuals**: 5 / 10.
- **Documentation**: 9 / 10.
- **Rating: 6.8**.

# Conclusion

Chakra UI is very developer friendly, but overall I dislike the looks of the components and customizing them can be a bit of a pain if you wish to do something different than what the component is intended to do.

My focus is on a day to day work, so in this case, you be working with designers who are very set in their work and on a design which is agreed on the client, and even then, said client might want a specific feature this library won't help us. I have seen this happen many time.

From a developer POV, this library is awesome, its simplifies a lot of annoying setups or thinking about the styling, but from a work POV, this library is a no for me.

As a developer you will need freedom and versatility.

See you on the next post.

Sincerely,

**End. Adrian Beria**
