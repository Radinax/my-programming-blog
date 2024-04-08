---
title: "ECommerce Store - Part 1 UI"
description: "This project is done by using React (CSR), Material UI for the styling, Commerce JS for the API that enables the functionality, TypeScript because its a must for every project and Stripe for the payments! This is part 1 where we build everything from scratch."
category: ["typescript", "react", "frontend"]
pubDate: "2023-12-10"
published: true
---

Let's start by creating a folder with the name of your project, then follow these steps:

- `npx create-react-app ecommerce-app-react-typescript --template typescript`
- `npm install @material-ui/core @material-ui/icons @chec/commerce.js @stripe/react-stripe-js @stripe/stripe-js react-router-dom react-hook-form`
- Delete the `src/` contents inside and then we can create a new `index.tsx` file:

```typescript
// Index.ts
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```

Now we need to install the types for `ecommerce` by `npm i --save-dev @types/chec__commerce.js`.

Now we can start creating our components!

## Folder Structure

```text
src/
┣ assets/
┃ ┗ commerce.png
┣ components/
┃ ┣ Cart/
┃ ┃ ┣ CartItem/
┃ ┃ ┃ ┣ CartItem.tsx
┃ ┃ ┃ ┗ styles.tsx
┃ ┃ ┣ Cart.tsx
┃ ┃ ┗ styles.tsx
┃ ┣ CheckoutForm/
┃ ┃ ┣ Checkout/
┃ ┃ ┃ ┣ Checkout.tsx
┃ ┃ ┃ ┗ styles.tsx
┃ ┃ ┣ AddressForm.tsx
┃ ┃ ┣ ConfirmationForm.tsx
┃ ┃ ┣ FormInput.tsx
┃ ┃ ┗ PaymentForm.tsx
┃ ┣ Navbar/
┃ ┃ ┣ Navbar.tsx
┃ ┃ ┗ styles.tsx
┃ ┣ Products/
┃ ┃ ┣ Product/
┃ ┃ ┃ ┣ Product.tsx
┃ ┃ ┃ ┗ styles.tsx
┃ ┃ ┣ Products.tsx
┃ ┃ ┗ styles.js
┃ ┗ index.tsx
┣ lib/
┃ ┗ commerce.tsx
┣ types/
┃ ┣ carts.tsx
┃ ┣ common.tsx
┃ ┣ index.tsx
┃ ┗ products.tsx
┣ App.tsx
┣ globals.d.ts
┣ index.tsx
┗ react-app-env.d.ts
```

## Products

Create a `src/components` folder, inside add a `Products` folder and inside a `Products.tsx` file:

```typescript
import React from "react";
import { Grid } from "@material-ui/core";
import { IProducts } from "../../types";
import Product from "./Product/Product";

import useStyles from "./styles";

const products: IProducts[] = [
  { id: 1, name: "Shoes", description: "Running shoes", price: "$5" },
  { id: 2, name: "Macbook", description: "Apple macbook", price: "$5" },
];

const Products: React.FC = () => {
  const classes = useStyles();
  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Grid container justify="center" spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Product product={product} />
          </Grid>
        ))}
      </Grid>
    </main>
  );
};

export default Products;
```

Where `Grid` is a container wrapper.

Where `types` is our Interface imported from `src/types` where we will store all our Interfaces to be used in our application. For `IProducts`:

```typescript
import { Product } from "chec__commerce.js/types/product";

export interface IProducts extends Product {}
```

Then we will import them inside `src/types/index.tsx`:

```typescript
export * from "./products";
```

This way we can import multiple interfaces without having do it individually.

We will do the same for our `components` folder, we will create inside an `index.tsx` file:

```typescript
export { default as Products } from "./Products/Products";
export { default as Navbar } from "./Navbar/Navbar";
```

And we will import them inside our `App.tsx`:

```typescript
import React from "react";
import { Products, Navbar } from "./components";

const App: React.FC = () => {
  return (
    <div>
      <Products />
    </div>
  );
};

export default App;
```

### Product Card

Inside the Products folder, create the Product folder and inside add the file `src/components/Products/Product/Product.tsx`:

```typescript
import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
import { IProducts } from "../../../types";

import useStyles from "./styles";

interface Props {
  product: IProducts;
}

const Product: React.FC<Props> = ({ product }) => {
  const { name, price, description } = product;
  const classes = useStyles();

  const ProductName = (
    <Typography variant="h5" gutterBottom>
      {name}
    </Typography>
  );

  const ProductPrice = <Typography variant="h5">{price}</Typography>;

  const ProductDescription = (
    <Typography variant="body2" color="textSecondary">
      {description}
    </Typography>
  );

  const ProductAdd = (
    <IconButton aria-label="Add to Card">
      <AddShoppingCart />
    </IconButton>
  );

  return (
    <Card className={classes.root}>
      <CardMedia className={classes.media} image="" title={name} />
      <CardContent>
        <div className={classes.cardContent}>
          {ProductName}
          {ProductPrice}
        </div>
        {ProductDescription}
      </CardContent>

      <CardActions disableSpacing className={classes.cardActions}>
        {ProductAdd}
      </CardActions>
    </Card>
  );
};

export default Product;
```

Notice how we're using `IProduct` here as well.

The `Product` component is a a `Functional Component` that takes a `Props` called `product` which is an individual `IProduct` type.

## Importing images in TypeScript

Before we move on, on your `tsconfig.json` file add these:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react",
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true
  },
  "include": ["src", "src/globals.d.ts"],
  "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts"]
}
```

And create a file `src/globals.d.ts`, inside:

```javascript
declare module "*.png";
```

Now we can import images correctly with TypeScript.

## Navbar

Follow the same logic as we did with `Products` component (use the folder structure as guide), to create the `Navbar.tsx` component:

```typescript
import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  MenuItem,
  Menu,
  Typography,
} from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";

import useStyles from "./styles";
import logo from "../../assets/commerce.png";

const Navbar: React.FC = () => {
  const classes = useStyles();

  const logoImage = (
    <img src={logo} alt="Commerce.js" height="25px" className={classes.image} />
  );

  const elementSeparator = <div className={classes.grow} />;

  const cartButton = (
    <div className={classes.menuButton}>
      <IconButton aria-label="Show cart items" color="inherit">
        <Badge badgeContent={2} color="secondary">
          <ShoppingCart />
        </Badge>
      </IconButton>
    </div>
  );
  return (
    <>
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {logoImage}
            {elementSeparator}
            {cartButton}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
```

## CommerceJS

Go to: https://commercejs.com/ and create a free account.

It tell us to install `npm install @chec/commerce.js` but we already did.

We need to find our API keys, go to the `Developer` section and settings, there you will see your keys. The one you want is the sandbox public key.

Create a `.env` file and inside add your keys:

```text
REACT_APP_CHEC_PUBLIC_KEY = "YOU PUBLIC KEY"
```

Now create inside `src` a folder with a file called `src/lib/commerce.js`:

```javascript
import Commerce from "@chec/commerce.js";

export const commerce = new Commerce(
  process.env.REACT_APP_CHEC_PUBLIC_KEY || "",
  true
);
```

Now we import it inside our `App.tsx` file:

```typescript
import React, { useState, useEffect } from "react";
import { commerce } from "./lib/commerce";
import { Products, Navbar } from "./components";
import { IProducts } from "./types";

const App: React.FC = () => {
  const [products, setProducts] = useState<IProducts[]>([]);

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  console.log(products);

  return (
    <div>
      <Navbar />
      <Products />
    </div>
  );
};

export default App;
```

Check your console in the browser and you get `undefined`.

Now go to your `commerceJS` dashboard and create a new product, fill in the name, description and price, then add an image of your choice related to the product.

On Shipping Options toggle the button and enable Domestic (United States).

On settings click Shipping you can see United States, you can add more zones, do it with the name `International` and add the countries you want. Then add the shipping price and save.

On the product you created add the `International` shipping.

Now go back to our App and refresh, where you will get the **Products** you created in `commerceJS`!

Add other products you want.

We can remove the mocked ones we created and add the new ones.

```typescript
import React, { useState, useEffect } from "react";
import { commerce } from "./lib/commerce";
import { Products, Navbar } from "./components";
import { IProducts } from "./types";

const App: React.FC = () => {
  const [products, setProducts] = useState<IProducts[]>([]);

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <Products products={products} />
    </div>
  );
};

export default App;
```

And inside `src/components/Products/Products.tsx`:

```typescript
import React from "react";
import { Grid } from "@material-ui/core";
import { IProducts } from "../../types";
import Product from "./Product/Product";

import useStyles from "./styles";

interface Props {
  products: IProducts[];
}

const Products: React.FC<Props> = ({ products }) => {
  const classes = useStyles();
  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Grid container justify="center" spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Product product={product} />
          </Grid>
        ))}
      </Grid>
    </main>
  );
};

export default Products;
```

Now inside `Product`:

```typescript
// Update this line
const { name, price, description, media } = product;

// Now price will be price.formatted_with_symbol
const ProductPrice = (
  <Typography variant="h5">{price.formatted_with_symbol}</Typography>
);

// Our description is HTML so we need to make it render
const ProductDescription = (
  <Typography
    dangerouslySetInnerHTML={{ __html: description }}
    variant="body2"
    color="textSecondary"
  />
);
```

Run the App to see everything working!

## Add to cart

For this functionality we can use the `commerceJS` API, let's first create the interface for this:

In our `App.tsx` we need to setup the `addCart`:

```typescript
const initialCartValues = {
  currency: {
    code: "",
    symbol: "",
  },
  id: "",
  line_items: "",
  subtotal: {
    formatted: "",
    formatter_with_code: "",
    formatted_with_symbol: "",
  },
  total_items: 0,
};

// Create the local state
const [cart, setCart] = useState<ICart | null>(null);

// Create the async handler fetch
const fetchCart = async () => {
  setCart(await commerce.cart.retrieve());
};

// Create the async add cart handler
const handleAddToCart = async (productId: string, quantity: number) => {
  const item = await commerce.cart.add(productId, quantity);

  setCart(item.cart);
};

// Fetch the cart in the component did mount lifecycle
useEffect(() => {
  fetchProducts();
  fetchCart();
}, []);

// And finally add it as prop to `Products`
<Products products={products} onAddToCart={handleAddToCart} />;
```

Inside `Products.tsx` add as a props the `onAddToCart`:

```typescript
interface Props {
  products: IProducts[];
  onAddToCart: (productId: string, quantity: number) => void;
}

// And add it to Product.tsx
<Product product={product} onAddToCart={onAddToCart} />;
```

Now inside `Product.tsx`:

```typescript
// Update your interface
interface Props {
  product: IProducts;
  onAddToCart: (productId: string, quantity: number) => void;
}

// Create a function to use the onAddToCart
const handleAddToCart = () => onAddToCart(id, 1);

// Add it as an onClick to the IconButton
const ProductAdd = (
  <IconButton aria-label="Add to Card" onClick={handleAddToCart}>
    <AddShoppingCart />
  </IconButton>
);
```

## Cart Layout

When the user clicks the cart, it should show a new layout where they can add or remove items.

We can start by creating the main layout:

```typescript
import React from "react";
import { Container, Typography, Button, Grid } from "@material-ui/core";
import CartItem from "./CartItem/CartItem";

import useStyles from "./styles";
import { ICart } from "../../types/carts";

interface Props {
  cart: ICart;
}

const Cart: React.FC<Props> = ({ cart }) => {
  const classes = useStyles();

  const EmptyCart = () => (
    <Typography variant="subtitle1">
      You have no items in your shopping cart, start adding some!
    </Typography>
  );

  const FilledCart = () => (
    <>
      <Grid container spacing={3}>
        {cart.line_items.map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <CartItem
              item={item}
              onUpdateCartQty={() => {}}
              onRemoveFromCart={() => {}}
            />
          </Grid>
        ))}
      </Grid>
      <div className={classes.cardDetails}>
        <Typography variant="h4">
          Subtotal: {cart.subtotal.formatted_with_symbol}
        </Typography>
        <div>
          <Button
            className={classes.emptyButton}
            size="large"
            type="button"
            variant="contained"
            color="secondary"
          >
            Empty Cart
          </Button>
          <Button
            className={classes.checkoutButton}
            size="large"
            type="button"
            variant="contained"
            color="primary"
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  );

  if (!cart.line_items) return <div>Loading...</div>;
  return (
    <Container>
      <div className={classes.toolbar} />
      <Typography className={classes.title} variant="h3">
        Your Shopping Cart
      </Typography>
      {!cart.line_items.length ? <EmptyCart /> : <FilledCart />}
    </Container>
  );
};

export default Cart;
```

Nothing too crazy here, let's add the `CartItem` component:

```typescript
import React from "react";
import {
  Typography,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
} from "@material-ui/core";

import useStyles from "./styles";
import { ICartItem } from "../../../types/common";

interface Props {
  item: ICartItem;
  onUpdateCartQty: any;
  onRemoveFromCart: any;
}

const CartItem: React.FC<Props> = ({
  item,
  onUpdateCartQty,
  onRemoveFromCart,
}) => {
  const classes = useStyles();

  const handleUpdateCartQty = (lineItemId, newQuantity) =>
    onUpdateCartQty(lineItemId, newQuantity);

  const handleRemoveFromCart = (lineItemId) => onRemoveFromCart(lineItemId);

  console.log(item);

  return (
    <Card className="cart-item">
      <CardMedia image="" alt={item.name} className={classes.media} />
      <CardContent className={classes.cardContent}>
        <Typography variant="h4">{item.name}</Typography>
        <Typography variant="h5">
          {item.line_total.formatted_with_symbol}
        </Typography>
      </CardContent>
      <CardActions className={classes.cartActions}>
        <div className={classes.buttons}>
          <Button
            type="button"
            size="small"
            onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)}
          >
            -
          </Button>
          <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
          <Button
            type="button"
            size="small"
            onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}
          >
            +
          </Button>
        </div>
        <Button
          variant="contained"
          type="button"
          color="secondary"
          onClick={() => handleRemoveFromCart(item.id)}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default CartItem;
```

Now let's work on our Routing system, go back to `App.tsx`:

```typescript
// Import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
```

Now inside our `App.tsx` return:

```typescript
return (
  <Router>
    <div>
      <Navbar totalItems={cart.total_items} />
      <Routes>
        <Route
          path="/"
          element={
            <Products products={products} onAddToCart={handleAddToCart} />
          }
        />
        <Route path="/cart" element={<Cart cart={cart} />} />
      </Routes>
    </div>
  </Router>
);
```

Notice that instead of `Switch`, we now use `Routes` and instead of `component` we used `element`, this is because `react-router` upgraded to a new version with these changes, unnecessary in my opinion since this could potentially break millions of applications in the world.

After this little rant, lets move on.

Inside `src/components/Navbar` lets add a `Link` to send the user to `/cart` route:

```typescript
const cartButton = (
  <div>
    <IconButton
      component={Link}
      to="/cart"
      aria-label="Show cart items"
      color="inherit"
    >
      <Badge badgeContent={totalItems} color="secondary">
        <ShoppingCart />
      </Badge>
    </IconButton>
  </div>
);
```

Notice how `IconButton` has a `component` prop so it can receive a `react-router-dom` `Link`, making this component able to have the same properties as the `Link`!

Now we need to add functionality to the `CartItem` so the user can update and remove items from their `Cart` view:

```typescript
// App.tsx
const handleUpdateCartQty = async (productId: string, quantity: number) => {
  const { cart } = await commerce.cart.update(productId, { quantity });
  setCart(cart);
};

const handleRemoveFromCart = async (productId: string) => {
  const { cart } = await commerce.cart.remove(productId);
  setCart(cart);
};

const handleEmptyCart = async () => {
  const { cart } = await commerce.cart.empty();
  setCart(cart);
};
```

Add those handlers and put them inside our `Cart` as props:

```jsx
<Route
  path="/cart"
  element={
    <Cart
      cart={cart}
      handleUpdateCartQty={handleUpdateCartQty}
      handleRemoveFromCart={handleRemoveFromCart}
      handleEmptyCart={handleEmptyCart}
    />
  }
/>
```

Update the interface of `Cart`:

```typescript
interface Props {
  cart: ICart;
  handleRemoveFromCart: (productId: string) => void;
  handleUpdateCartQty: (productId: string, quantity: number) => void;
  handleEmptyCart: () => void;
}
```

And in in the `CartItem` inside `Cart.tsx`:

```jsx
<CartItem
  item={item}
  handleUpdateCartQty={handleUpdateCartQty}
  handleRemoveFromCart={handleRemoveFromCart}
  handleEmptyCart={handleEmptyCart}
/>
```

Inside our `CartItem.tsx`:

```typescript
interface Props {
  item: ICartItem;
  handleRemoveFromCart: (productId: string) => void;
  handleUpdateCartQty: (productId: string, quantity: number) => void;
  handleEmptyCart: () => void;
}
```

And add the functions:

```javascript
const onUpdateCartQty = (lineItemId: string, newQuantity: number) =>
  handleUpdateCartQty(lineItemId, newQuantity);

const onRemoveFromCart = (lineItemId: string) =>
  handleRemoveFromCart(lineItemId);
```

Which we add to the buttons responsible of adding/removing:

```jsx
<Button
    type="button"
    size="small"
    onClick={() => onUpdateCartQty(item.id, item.quantity - 1)}
    >
    -
</Button>
<Typography>&nbsp;{item.quantity}&nbsp;</Typography>
<Button
    type="button"
    size="small"
    onClick={() => onUpdateCartQty(item.id, item.quantity + 1)}
    >
    +
</Button>
</div>
<Button
    variant="contained"
    type="button"
    color="secondary"
    onClick={() => onRemoveFromCart(item.id)}
    >
    Remove
</Button>
```

We did a prop drilling here, but since we did it on one level and for two components only, using `context` isn't needed, if we added more then we would be needing one.

## Checkout feature

Go inside `Cart.tsx` and update the Checkout button:

```jsx
<Button
  className={classes.checkoutButton}
  size="large"
  type="button"
  variant="contained"
  color="primary"
  component={Link}
  to="/checkout"
>
  Checkout
</Button>
```

Now create the `Checkoout` component:

```jsx
import React, { useState } from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
} from "@material-ui/core";
import useStyles from "./styles";

const steps = ["Shipping address", "Payment details"];

const Checkout: React.FC = () => {
  const [activeStep, setActiveStep] = useState < number > 0;
  const classes = useStyles();
  return (
    <>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
```

If we check this out (remember to export inside our `components/index.tsx` and then inside `App.tsx`) we can see the shipping details.

### Form Input

We need to use `react-hook-form` to create a reusable input component that takes as component the Material UI Input, to do this we use the `Controller` feature of `react-hook-form`:

```jsx
import React from "react";
import { TextField, Grid } from "@material-ui/core";
import { useFormContext, Controller } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  required: boolean;
}

const FormInput: React.FC<Props> = ({ name, label, required }) => {
  const { control } = useFormContext();

  return (
    <Grid item xs={12} sm={6}>
      <Controller
        render={({ field: { onChange, value } }) => (
          <TextField
            onChange={onChange}
            fullWidth
            value={value}
            name={name}
            label={label}
          />
        )}
        control={control}
        name={name}
      />
    </Grid>
  );
};

export default FormInput;
```

### Address Form

Inside out Form:

```jsx
import React from "react";
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import FormInput from "./FormInput";

const AddressForm = () => {
  const methods = useForm();
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={() => {}}>
          <Grid container spacing={3}>
            <FormInput required name="firstName" label="First name" />
          </Grid>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
```

We can apply only sending the `name` and `label` property! We don't need to manually handle the local state or the `onChange` attribute.

We can create our new inputs the same way as above:

```jsx
<FormInput required name="firstName" label="First name" />
<FormInput name="lastName" label="Last name" />
<FormInput name="address1" label="Address" />
<FormInput name="email" label="Email" />
<FormInput name="city" label="City" />
<FormInput name="zip" label="Postal Code" />
```

Now we need to check the countries, subdivisions and shipping options, all of these are provided by the API, start by adding these local states:

```jsx
const [shippingCountries, setShippingCountries] = useState([]);
const [shippingCountry, setShippingCountry] = useState("");
const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
const [shippingSubdivision, setShippingSubdivision] = useState("");
const [shippingOptions, setShippingOptions] = useState([]);
const [shippingOption, setShippingOption] = useState("");
```

Then `import { commerce } from '../../lib/commerce'` and we can fetch our information:

```jsx
const fetchShippingCountries = async (checkoutTokenId: string) => {
  const { countries } = await commerce.services.localeListShippingCountries(
    checkoutTokenId
  );

  setShippingCountries(countries);
};
```

We need to create this `checkoutToken` which is like a receipt, we do that inside `Checkout.tsx`:

```jsx
// We get out token using the API
useEffect(() => {
  const generateToken = async () => {
    try {
      const token = await commerce.checkout.generateToken(cart.id, {
        type: "cart",
      });
      setCheckoutToken(token);
    } catch (error) {
      console.log("Error", error);
    }
  };

  generateToken();
}, [cart]);

// We store it in a local state
const [checkoutToken, setCheckoutToken] = useState(checkoutTokenInitialValue);

// Where the initial values are
const checkoutTokenInitialValue = {
  id: "",
};

// We need to send it as prop to AddressForm
<AddressForm checkoutToken={checkoutToken} />;
```

Inside `AddressForm` we update the interface:

```typescript
type Token = {
  id: string;
};

interface Props {
  checkoutToken: Token;
}
```

Now we have to store the information we got from our API inside our local state:

```jsx
const [shippingCountries, setShippingCountries] = useState([]);
const [shippingCountry, setShippingCountry] = useState("");
const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
const [shippingSubdivision, setShippingSubdivision] = useState("");
const [shippingOptions, setShippingOptions] = useState([]);
const [shippingOption, setShippingOption] = useState("");
```

Next we need to fetch the information we need:

```jsx
const fetchShippingCountries = async (checkoutTokenId: string) => {
  const { countries } = await commerce.services.localeListShippingCountries(
    checkoutTokenId
  );
  setShippingCountries(countries);
  setShippingCountry(Object.keys(countries)[0]);
};

const fetchShippingDivisons = async (countryCode: string) => {
  const { subdivisions } = await commerce.services.localeListSubdivisions(
    countryCode
  );
  setShippingSubdivisions(subdivisions);
  setShippingSubdivision(Object.keys(subdivisions)[0]);
};

const fetchShippingOptions = async (
  checkoutTokenId: string,
  country: string,
  region: string = null
) => {
  const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {
    country,
    region,
  });
  setShippingOptions(options);
  setShippingOption(options[0].id);
};
```

Which in turn we use inside the `useEffect`:

```jsx
React.useEffect(() => {
  fetchShippingCountries(checkoutToken.id);
}, []);

React.useEffect(() => {
  if (shippingCountry) fetchShippingDivisons(shippingCountry);
}, [shippingCountry]);

React.useEffect(() => {
  if (shippingSubdivision)
    fetchShippingOptions(
      checkoutToken.id,
      shippingCountry,
      shippingSubdivision
    );
}, [shippingSubdivision]);
```

Now we need to add a select input:

```jsx
// Add bellow your FormInputs
<Grid item xs={12} sm={6}>
  <InputLabel>Shipping Country</InputLabel>
  <Select value={shippingCountry} fullWidth onChange={onChangeShippingCountry}>
    {countries.map((country) => (
      <MenuItem key={country.id} value={country.id}>
        {country.label}
      </MenuItem>
    ))}
  </Select>
</Grid>
```

Where `onChangeShippingCountry` is:

```jsx
const onChangeShippingCountry = (e: React.ChangeEvent<{ value: unknown }>) =>
setShippingCountry(e.target.value as string);
```

We do the same process for `shippingSubdivision` and `shippingOption`.

We need to add two buttons to help the user navigate:

```jsx
<div style={{ display: "flex", justifyContent: "space-between" }}>
  <Button component={Link} to="/cart" variant="outlined">
    Back to Cart
  </Button>
  <Button type="submit" color="primary" variant="contained">
    Next
  </Button>
</div>
```

And finally we need to use `react-hook-form` to send the information we need:

```jsx
<form
  onSubmit={methods.handleSubmit((data) =>
    next({
      ...data,
      shippingCountry,
      shippingSubdivision,
      shippingOption,
    })
  )}
>
  {/* The rest of the code */}
</form>
```

We will continue Part 2 on another post!

## Conclusion

Today we learned about creating a ecommerce using React, TypeScript, Material UI and Commerce JS! This later provides a very useful API that let us perform all the necessary operations without having the need of a Backend which is very useful.

The styling is done using Material UI, but I have never been a fan of CSS Frameworks, I much prefer Tailwind for its flexibility, added Material UI because its the new Bootstrap (which I never liked) and a lot of companies use it.

We're missing the actual payment method and the testing!

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
