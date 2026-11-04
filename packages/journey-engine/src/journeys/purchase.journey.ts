import type { Journey } from "@journeylens/contracts";

export const purchaseJourney: Journey = {
  id: "JL-JRN-001",
  name: "Complete a purchase",
  description: "A customer purchases a product from an online store.",
  startUrl: "https://www.saucedemo.com/",

  steps: [
    {
        id: "step-1",
        action: "navigate",
        description: "Open the website",
        value: "https://www.saucedemo.com/",
    },
    {
      id: "step-2",
      action: "type",
      description: "Enter username",
      target: '[data-test="username"]',
      value: "standard_user",
    },
    {
      id: "step-3",
      action: "type",
      description: "Enter password",
      target: '[data-test="password"]',
      value: "secret_sauce",
    },
    {
      id: "step-4",
      action: "click",
      description: "Sign in",
      target: '[data-test="login-button"]',
    },
    {
        id: "step-5",
        action: "click",
        description: "Add backpack to cart",
        target: '[data-test="add-to-cart-sauce-labs-backpack"]',
        assertions: [
            {
            type: "text",
            target: ".shopping_cart_badge",
            expected: "1",
            description: "Cart count updates to one"
            }
        ]
    },
    {
      id: "step-6",
      action: "click",
      description: "Open shopping cart",
      target: ".shopping_cart_link",
    },
    {
      id: "step-7",
      action: "click",
      description: "Proceed to checkout",
      target: '[data-test="checkout"]',
    },
    {
      id: "step-8",
      action: "type",
      description: "Enter first name",
      target: '[data-test="firstName"]',
      value: "Demo",
    },
    {
      id: "step-9",
      action: "type",
      description: "Enter last name",
      target: '[data-test="lastName"]',
      value: "User",
    },
    {
      id: "step-10",
      action: "type",
      description: "Enter postal code",
      target: '[data-test="postalCode"]',
      value: "411001",
    },
    {
      id: "step-11",
      action: "click",
      description: "Continue to order summary",
      target: '[data-test="continue"]',
    },
    {
        id: "step-12",
        action: "click",
        description: "Finish checkout",
        target: '[data-test="finish"]',
        assertions: [
            {
            type: "visible",
            target: ".complete-header",
            description: "Order confirmation is displayed"
            },
            {
            type: "text",
            target: ".complete-header",
            expected: "Thank you for your order!",
            description: "Order confirmation message is correct"
            }
        ]
    },
  ],
};