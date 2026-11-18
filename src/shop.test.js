import { describe, it, expect } from 'vitest';
import { cartReducer, cartTotals, initialCart, SHIPPING_COST } from './cart/cartReducer.js';
import { PRODUCTS, queryProducts } from './data/products.js';
import { luhn, validateCheckout, formatCardNumber, formatExpiry } from './checkout/validation.js';

const product = { id: 'x', name: 'Thing', price: 20, stock: 3, icon: '📦', color: '#fff' };
const add = (state, quantity = 1, p = product) => cartReducer(state, { type: 'add', product: p, quantity });

describe('cartReducer', () => {
  it('adds a product and merges repeated adds', () => {
    const state = add(add(initialCart), 1);
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it('never exceeds available stock', () => {
    expect(add(initialCart, 10).items[0].quantity).toBe(3);
  });

  it('ignores sold-out products', () => {
    expect(add(initialCart, 1, { ...product, stock: 0 }).items).toHaveLength(0);
  });

  it('removes an item when its quantity reaches 0', () => {
    const state = cartReducer(add(initialCart), { type: 'setQuantity', id: 'x', quantity: 0 });
    expect(state.items).toHaveLength(0);
  });

  it('only accepts valid coupons (case-insensitive)', () => {
    expect(cartReducer(initialCart, { type: 'applyCoupon', code: 'fake' }).coupon).toBeNull();
    expect(cartReducer(initialCart, { type: 'applyCoupon', code: ' save10 ' }).coupon).toBe('SAVE10');
  });
});

describe('cartTotals', () => {
  it('charges shipping under the free-shipping threshold', () => {
    const totals = cartTotals(add(initialCart, 2)); // 40
    expect(totals.subtotal).toBe(40);
    expect(totals.shipping).toBe(SHIPPING_COST);
    expect(totals.tax).toBe(3.2);
    expect(totals.total).toBe(51.19);
  });

  it('gives free shipping above the threshold and applies discounts', () => {
    const big = { ...product, price: 120, stock: 5 };
    const state = cartReducer(add(initialCart, 1, big), { type: 'applyCoupon', code: 'SAVE10' });
    const totals = cartTotals(state);
    expect(totals.discount).toBe(12);
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBe(116.64); // (120 - 12) * 1.08
  });

  it('is all zeros for an empty cart', () => {
    expect(cartTotals(initialCart)).toMatchObject({ count: 0, total: 0, shipping: 0 });
  });
});

describe('queryProducts', () => {
  it('filters by category and search term', () => {
    const result = queryProducts(PRODUCTS, { category: 'Outdoors', search: 'bottle' });
    expect(result.map((p) => p.name)).toEqual(['Water Bottle']);
  });

  it('sorts by price ascending', () => {
    const prices = queryProducts(PRODUCTS, { sort: 'price-asc' }).map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('can hide sold-out products', () => {
    expect(queryProducts(PRODUCTS, { inStockOnly: true }).every((p) => p.stock > 0)).toBe(true);
  });
});

describe('checkout validation', () => {
  const valid = {
    fullName: 'Ana Pérez', email: 'ana@example.com', address: 'Calle 1', city: 'Bogotá', postalCode: '110111',
    cardName: 'ANA PEREZ', cardNumber: '4242 4242 4242 4242', expiry: '12/39', cvc: '123',
  };

  it('accepts a valid form', () => {
    expect(validateCheckout(valid)).toEqual({});
  });

  it('reports missing fields and bad formats', () => {
    const errors = validateCheckout({ ...valid, fullName: '', email: 'nope', cardNumber: '4242 4242 4242 4241', expiry: '01/20', cvc: '1' });
    expect(Object.keys(errors).sort()).toEqual(['cardNumber', 'cvc', 'email', 'expiry', 'fullName']);
    expect(errors.expiry).toBe('Card has expired');
  });

  it('implements the Luhn check', () => {
    expect(luhn('4242424242424242')).toBe(true);
    expect(luhn('4242424242424241')).toBe(false);
  });

  it('formats card number and expiry as the user types', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
    expect(formatExpiry('1239')).toBe('12/39');
  });
});
