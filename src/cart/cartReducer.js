export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING_COST = 7.99;
export const TAX_RATE = 0.08;
export const COUPONS = { SAVE10: 0.1, WELCOME15: 0.15 };

export const initialCart = { items: [], coupon: null };

/** Cart state transitions. Quantities are always clamped to [1, stock]. */
export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { product, quantity = 1 } = action;
      if (product.stock <= 0) return state;
      const existing = state.items.find((i) => i.id === product.id);
      const items = existing
        ? state.items.map((i) => (i.id === product.id ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) } : i))
        : [...state.items, { id: product.id, name: product.name, price: product.price, icon: product.icon, color: product.color, stock: product.stock, quantity: Math.min(quantity, product.stock) }];
      return { ...state, items };
    }
    case 'setQuantity': {
      const items = state.items
        .map((i) => (i.id === action.id ? { ...i, quantity: Math.min(Math.max(0, action.quantity), i.stock) } : i))
        .filter((i) => i.quantity > 0);
      return { ...state, items };
    }
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'applyCoupon': {
      const code = action.code.trim().toUpperCase();
      return COUPONS[code] ? { ...state, coupon: code } : state;
    }
    case 'removeCoupon':
      return { ...state, coupon: null };
    case 'clear':
      return initialCart;
    default:
      return state;
  }
}

const round = (n) => Math.round(n * 100) / 100;

export function cartTotals({ items, coupon }) {
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = round(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const discount = round(coupon ? subtotal * COUPONS[coupon] : 0);
  const afterDiscount = subtotal - discount;
  const shipping = count === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = round(afterDiscount * TAX_RATE);
  return { count, subtotal, discount, shipping, tax, total: round(afterDiscount + shipping + tax) };
}

export const formatPrice = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
