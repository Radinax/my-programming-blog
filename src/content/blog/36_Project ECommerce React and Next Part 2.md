---
title: "ECommerce Store - Part 2 Testing and Stripe"
description: "This project is done by using React (CSR), Material UI for the styling, Commerce JS for the API that enables the functionality, TypeScript because its a must for every project and Stripe for the payments! This is part 2 where we test and add the payment features using Stripe."
category: ["typescript", "react", "frontend"]
pubDate: "2023-12-10"
published: true
---

For this article we will focus more on testing our current application.

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

## Installing Cypress

Start by `npm install cypress --save-dev` and `npm install eslint-plugin-cypress -D`. Inside our `package.json` we add these scripts:

```json
"scripts": {
  "cypress:open": "cypress open",
  "test:e2e": "cypress run"
}

"eslintConfig": {
  "env": {
    "cypress/globals": true
  },
  "extends": "react-app",
  "plugins": [
    "cypress",
  ]
}
```

We can run cypress by using `npm run cypress:open`.

Inside our `cypress.json` configuration file we can add different options:

```json
{
  "baseUrl": "http://localhost:3000"
}
```

## Cypress testing

### Initial View

Inside the `cypress` folder, then inside the `integration` folder, create an `ecommerce.spec.js` file and inside:

```javascript
describe("Ecommerce", () => {
  beforeEach(() => {
    cy.visit("/");
  });
});
```

We first need to visit the site, then we need to understand what we need to test:

```javascript
// Opens
// We click add product icon and cart number raises
```

We first start by adding in comments what we need to do, this way we can have a clear idea on what we need to test. Remember that we need to test user interactions, so in that sense we need to ensure the applications first opens:

```javascript
describe("Ecommerce", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  // Opens
  it("opens the application", () => {
    cy.contains("Commerce.js");
  });

  // We click add product icon button and cart number raises
});
```

Which works! Now we need to test the click add product, first we need to get the badge where the number of items in the cart are:

```javascript
// We click add product icon button and cart number raises
it("Click a product and raise badge", () => {
  cy.get(`.MuiBadge-badge`).as("badgeValue");
  cy.get("@badgeValue").should("contain", 0);
});
```

Now we made it into a variable called `badgeValue` which we can reference later as `@badgeValue`, next we need to click any product:

```javascript
cy.get(`[aria-label="Add to Card"]`).first().click();
```

And see if the `@badgeValue` raises:

```javascript
cy.get("@badgeValue").should("contain", 1);
```

Which it does! Lets continue with the cart view.

### Cart View

For this view we will just check if the `CartItem` plus and minus buttons are working properly:

```javascript
describe("Cart view", () => {
  before(() => {
    cy.visit("http://localhost:3000");
    cy.get(`.MuiBadge-badge`).as("badgeValue");
    cy.get(`[aria-label="Add to Card"]`)
      .first()
      .click()
      .then(() => {
        cy.visit("/cart");
        cy.get(`.MuiGrid-container`).as("container");
      });
  });

  it("Visits the right url", () => {
    cy.url("/cart");
  });

  it("Contains one product", () => {
    // MuiGrid-container
    cy.get(`.MuiGrid-container`).as("container");
    cy.get("@container").children().should("have.length", 1);
  });

  it("When clicking on + it raises the product quantity", () => {
    cy.get(".MuiTypography-body1").contains("1");
    cy.contains(".MuiButton-text", "+")
      .click()
      .then(() => cy.contains(".MuiTypography-body1", "2"));
  });

  it("When clicking on - it removes product if quantity is 1", () => {
    cy.get(".MuiTypography-body1").contains("2");
    cy.contains(".MuiButton-text", "-")
      .click()
      .then(() => cy.contains(".MuiTypography-body1", "1"));
    cy.contains(".MuiButton-text", "-")
      .click()
      .then(() =>
        cy.get(`.MuiGrid-container`).children().should("have.length", 0)
      );
  });
});
```

### Address Form

We need to do something first, considering we will be visiting the same URL for the different tests, we want to create a command for this. To do it we need to create a file inside `cypress/support/commands.js` file:

```javascript
Cypress.Commands.add("visitSite", () => {
  cy.visit("http://localhost:3000");
  cy.server();
  cy.route("GET", "https://api.chec.io/v1/products").as("productRoute");
  cy.route("GET", "https://api.chec.io/v1/carts").as("cartRoute");
  cy.wait(["@productRoute", "@cartRoute"], { responseTimeout: 15000 });
});
```

And now we can do `cy.visitSite`,

For the first step we need to add:

```javascript
Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});
```

This is bad practice, but the API library has an unhandled rejection which is out of our hands and cypress rightfully is complaining.

Let's add the checkout workflow:

```javascript
describe("checkout workflow", () => {
  before(() => {
    cy.visitSite();
    cy.get(`.MuiBadge-badge`).as("badgeValue");
    cy.get(`[aria-label="Add to Card"]`)
      .first()
      .click()
      .then(() => cy.visit("/cart"));
    cy.contains(".MuiButton-text", "+").click();
    cy.visit("/checkout");
  });

  it("loads the view", () => {
    cy.wait(10000);
    cy.contains("h6", "Shipping Address");
  });
});
```

The first step of loading the view, we should be waiting for the routes to complete and then check if the view loads, but the API is generating the tokens and we don't have a way to get them, those tokens are used on the requested URLs, so we decided to add a time until the view loads.

The correct way is waiting for all routes to complete.

Now let's work on making cypress test our inputs:

```javascript
it("user can fill form", () => {
  cy.get('input[name="firstName"]').type("Jhon");
  cy.get('input[name="lastName"]').type("Doe");
  cy.get('input[name="address1"]').type("Street neverland");
  cy.get('input[name="email"]').type("Jhon@doe.com");
  cy.get('input[name="city"]').type("Neverland");
  cy.get('input[name="zip"]').type("1234");

  cy.clickSelectInputOption("Shipping Country");
  cy.clickSelectInputOption("Shipping Subdivision");
  cy.clickSelectInputOption("Shipping Options");
});
```

Where `clickSelectInputOption` is a command we added:

```javascript
Cypress.Commands.add("clickSelectInputOption", (labelName) => {
  cy.contains("label", labelName).siblings(".MuiInput-root").click();
  cy.get(".MuiMenu-list").children().first().click();
});
```

What id does is select the "Select" and click the first option.

## Unit testing

For this we need to use `react-testing-library`, lets test the `Products.tsx` component:

### Products

```javascript
import React from "react";
import "@testing-library/jest-dom";
import { screen, render } from "@testing-library/react";
import { Products } from "..";

const products = [
  {
    id: "123",
    name: "product",
    description: "Description",
    price: {
      formatted: "50.00",
      formatter_with_code: "50.00 USD",
      formatted_with_symbol: "$50.00",
    },
    image: {
      url: "https://media.istockphoto.com/photos/big-and-small-picture-id172759822?b=1&k=20&m=172759822&s=170667a&w=0&h=kkmaR2OYuS14rTiEotbzXoBecwnRePNC79Jsgl3M4dY=",
    },
  },
];

const productId = "1";
const qty = 1;

describe("Products testing", () => {
  test("Renders correct amount of childs", () => {
    const { container } = render(
      <Products products={products} onAddToCart={(productId, qty) => {}} />
    );
    expect(container.getElementsByClassName("MuiGrid-item").length).toBe(1);
  });
});
```

We want to see if the name, description, price and images are shown, so we test those first.

For the image, `material-ui` makes it a bit hard to test it as a normal image, since its a div with a style `background-image` with an URL inside, so we had to test that.

Something to note, we need to import these two libraries for each test:

```javascript
import React from "react";
import "@testing-library/jest-dom";
```

`Products.tsx` was very straightforward. We could test the click button on the `Product` but we already tested it with `cypress` and much easier at that, so we don't really have to do it here.

But if we had to, we would need to do it inside `App.tsx`, but again, since we already did it with `cypress` we don't need to do it.

The purpose of the unit tests for this application is to ensure everything is rendering correctly, because it happens that when a common component is being shared in different views, and that component is changed, it might break some views, so this ensures everything is working as it should.

### Product

Let's add the other unit tests, we will start with `Product.tsx`, create a test file called `Product.test.js`:

```javascript
import React from "react";
import "@testing-library/jest-dom";
import { screen, render } from "@testing-library/react";
import Product from "./Product";

const product = {
  id: "123",
  name: "product",
  description: "Description",
  price: {
    formatted: "50.00",
    formatter_with_code: "50.00 USD",
    formatted_with_symbol: "$50.00",
  },
  image: {
    url: "https://media.istockphoto.com/photos/big-and-small-picture-id172759822?b=1&k=20&m=172759822&s=170667a&w=0&h=kkmaR2OYuS14rTiEotbzXoBecwnRePNC79Jsgl3M4dY=",
  },
};

const productId = "1";
const qty = 1;

describe("Correct initial view", () => {
  beforeEach(() => {
    render(<Product product={product} onAddToCart={(productId, qty) => {}} />);
  });

  test("product name, description and price are present", () => {
    const productName = screen.getByText(product.name);
    const productDescription = screen.getByText(product.description);
    const productPrice = screen.getByText(product.price.formatted_with_symbol);
    expect(productName).toBeInTheDocument();
    expect(productDescription).toBeInTheDocument();
    expect(productPrice).toBeInTheDocument();
  });

  test("product image is shown", () => {
    const productName = screen.getByText(product.name);
    // expect(container.firstChild.classList.contains('foo')).toBe(true)
    expect(productName).toHaveStyle(
      `background-color: url(${product.image.url})`
    );
  });
});
```

Here we make sure the Product card shows the name, description, image and price.

### Navbar

This is one is also straightforward:

```jsx
import React from "react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { screen, render } from "@testing-library/react";
import Navbar from "./Navbar";

const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);

  return render(ui, { wrapper: BrowserRouter });
};

describe("Navbar", () => {
  it("renders", () => {
    renderWithRouter(<Navbar totalItems={4} />);
    expect(screen.getByText("Commerce.js")).toBeInTheDocument();
  });

  it("shows correct amount of items", () => {
    const { container } = renderWithRouter(<Navbar totalItems={4} />);
    expect(
      container.getElementsByClassName("MuiBadge-badge")[0]
    ).toHaveTextContent(4);
  });
});
```

The documentation recommends using `renderWithRouter` as a utility function which acts as a wrapper around your component.

For the Navbar we want to make sure it renders and then that it shows in the cart the right amount of items.

Let's continue with developing our application.

## Payment Form with Stripe

We start by loading the stripe elements:

```javascript
import {
  Elements,
  CardElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
```

Lets create a Review component first:

### Review

We would do:

```jsx
import React from "react";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";
import { ICheckoutToken, ILineItem } from "../../types";

interface Props {
  checkoutToken: ICheckoutToken;
}

const Review: React.FC<Props> = ({ checkoutToken }) => (
  <>
    <Typography variant="h6" gutterBottom>
      Order summary
    </Typography>
    <List disablePadding>
      {checkoutToken.live.line_items.map((product: ILineItem) => (
        <ListItem style={{ padding: "10px 0" }} key={product.name}>
          <ListItemText
            primary={product.name}
            secondary={`Quantity: ${product.quantity}`}
          />
          <Typography variant="body2">
            {product.line_total.formatted_with_symbol}
          </Typography>
        </ListItem>
      ))}
      <ListItem style={{ padding: "10px 0" }}>
        <ListItemText primary="Total" />
        <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
          {checkoutToken.live.subtotal.formatted_with_symbol}
        </Typography>
      </ListItem>
    </List>
  </>
);

export default Review;
```

Where `ICheckoutToken` will come from our `types/common.tsx` file:

```jsx
import { CheckoutToken } from "chec__commerce.js/types/checkout-token";

export interface ICheckoutToken extends CheckoutToken {}
```

### Payment Form

We first need to load elements of `react-stripe`:

```javascript
import {
  Elements,
  CardElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
```

Which gets powered up by `import { loadStripe } from '@stripe/stripe-js';`:

```javascript
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
```

Our key is given on https://www.stripe.com, create a free account to start using `stripe`. Click on the left where it says `Developers` and finally `API keys`, where we get our key which we can add as an `env` variable!

`Elements` is a wrapper which accepts `stripePromise` as a props, and `ElementConsumer` accepts a function that returns a React element.

```jsx
<Elements stripe={stripePromise}>
  <ElementsConsumer>
    {({ elements, stripe }) => (
      <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
        <CardElement />
        <br /> <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={backStep}>
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!stripe}
            color="primary"
          >
            Pay {checkoutToken.live.subtotal.formatted_with_symbol}
          </Button>
        </div>
      </form>
    )}
  </ElementsConsumer>
</Elements>
```

When we submit the payment data, we need to handle this:

```jsx
const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    elements: StripeElements | null,
    stripe: Stripe | null
) => {
    event.preventDefault();

    if (!stripe || !elements || stripe === null) return;

    const cardElement = elements.getElement(CardElement) as StripeCardElement;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
    });

    if (error) {
        console.log("[error]", error);
    } else {
        const orderData = {
            line_items: checkoutToken.live.line_items,
            customer: {
                firstname: shippingData.firstName,
                lastname: shippingData.lastName,
                email: shippingData.email,
            },
            shipping: {
                name: "International",
                street: shippingData.address1,
                town_city: shippingData.city,
                county_state: shippingData.shippingSubdivision,
                postal_zip_code: shippingData.zip,
                country: shippingData.shippingCountry,
            },
            fulfillment: { shipping_method: shippingData.shippingOption },
            payment: {
                gateway: "stripe",
                stripe: {
                    payment_method_id: paymentMethod?.id,
                },
                },
            };

        onCaptureCheckout(checkoutToken.id, orderData);
        nextStep();
    }
};
```

We need to create the `onCaptureCheckout` which comes from `App.tsx`:

```jsx
const handleCaptureCheckout = async (
    checkoutTokenId: string,
    newOrder: ICheckoutCapture
) => {
    try {
        const incomingOrder = await commerce.checkout.capture(
            checkoutTokenId,
            newOrder as ICheckoutCapture
        );

        setOrder(incomingOrder);
        refreshCart();
    } catch (e) {
        const error = e as IError;
        setErrorMessage(error.data.error.message);
    }
};
```

We also need to update our cart after we checkout:

```javascript
const refreshCart = async () => {
  const newCart = await commerce.cart.refresh();

  setCart(newCart);
};
```

And we need to update our `types/commons.tsx` file:

```typescript
import { CheckoutCapture } from "@chec/commerce.js/types/checkout-capture";
import { CheckoutCaptureResponse } from "@chec/commerce.js/types/checkout-capture-response";
import { CheckoutToken } from "chec__commerce.js/types/checkout-token";

export interface ICheckoutToken extends CheckoutToken {}

export interface ICheckoutCaptureResponse extends CheckoutCaptureResponse {}

export interface ICheckoutCapture extends CheckoutCapture {}

export interface IError {
  data: {
    error: {
      message: "";
    };
  };
}
```

I rather have all the `commerceJS` types inside one file and exporting them all from there, instead of doing it one by one in the files we need them.

Now we need to update our `Checkout` component to receive the `order` you just set on the state:

```jsx
<Route
  path="/checkout"
  element={
    <Checkout
      cart={cart}
      order={order}
      onCaptureCheckout={handleCaptureCheckout}
      error={errorMessage}
    />
  }
/>
```

And we update our `Checkout` component types:

```typescript
interface Props {
  cart: ICart;
  order: ICheckoutCaptureResponse | null;
  onCaptureCheckout: (tokenId: string, order: ICheckoutCapture) => void;
  error: string;
}
```

Inside that same component we pass the `onCaptureCheckout` as props to the `PaymentForm` component.

Now go back to your `commerceJS` Dashboard, go into settings and payment methods, `https://dashboard.chec.io/settings/gateways`, here we can connect to Stripe.

Stripe default credit card number is `4242 4242 4242 4242` `04/24 242 42424`

And we're done!

## Conclusion

Today we added the tests for some of the functionalities and we added a payment method (which doesn't work because its fake data). The design could use a lot more work, but the idea of this project was to show, how to use this API with Stripe and adding testing alongside TypeScript.

See you on the next post.

Sincerely,

**End. Adrian Beria**
