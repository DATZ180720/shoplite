# ShopLite

An e-commerce front-end built with **React**, **React Router** and **Vite**: product catalog, cart, coupons and a validated checkout flow.

## Features

- **Catalog** with search, category chips, sorting and an "in stock only" filter. Filters are stored in the URL, so they survive reloads and can be shared
- **Product page** with quantity selector, stock warnings and related products
- **Cart** with quantity controls that respect stock, persisted in `localStorage`
- **Coupons** (`SAVE10`, `WELCOME15`), free shipping over $100, tax calculation and a "spend X more for free shipping" hint
- **Checkout** with field-level validation, card number formatting, Luhn check and expiry validation (demo only, no real payment)
- **Order confirmation** page
- Responsive layout, accessible labels and keyboard-friendly controls
- 15 unit tests (Vitest) for cart logic, totals, filtering and checkout validation

## Tech stack

React 18 · React Router 6 · Vite · Vitest · CSS (no UI framework)

## Getting started

```bash
npm install
npm run dev     # http://localhost:5173
npm test
npm run build
```

Demo card for checkout: `4242 4242 4242 4242`, any future date, any 3-digit CVC.

## Architecture

```
src/
├── App.jsx                     # layout + routes
├── data/products.js            # catalog + queryProducts() (search/filter/sort)
├── cart/
│   ├── cartReducer.js          # pure reducer + totals (shipping, tax, coupons)
│   └── CartContext.jsx         # useReducer + Context + localStorage persistence
├── checkout/validation.js      # form validation, Luhn check, input formatting
├── components/                 # ProductCard, ProductImage, OrderSummary
└── pages/                      # Catalog, Product, Cart, Checkout, OrderConfirmation
```

Business logic (cart, totals, filtering, validation) is written as **pure functions** separated from the components, which keeps the UI simple and makes the logic easy to unit test.

## Possible improvements

- Connect to a real backend (products, orders) and Stripe for payments
- User accounts and order history
- Wishlist and product reviews
- End-to-end tests with Playwright
