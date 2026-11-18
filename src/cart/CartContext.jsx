import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { cartReducer, cartTotals, initialCart } from './cartReducer.js';

const STORAGE_KEY = 'shoplite:cart';
const CartContext = createContext(null);

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.items ? saved : initialCart;
  } catch {
    return initialCart;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable */
    }
  }, [cart]);

  const value = useMemo(() => ({ cart, totals: cartTotals(cart), dispatch }), [cart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
