import { useCart } from '../cart/CartContext.jsx';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '../cart/cartReducer.js';

export default function OrderSummary({ children }) {
  const { cart, totals } = useCart();
  const missing = FREE_SHIPPING_THRESHOLD - (totals.subtotal - totals.discount);

  return (
    <aside className="summary">
      <h2>Order summary</h2>
      <dl>
        <div><dt>Subtotal ({totals.count} items)</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
        {totals.discount > 0 && <div className="discount"><dt>Discount ({cart.coupon})</dt><dd>−{formatPrice(totals.discount)}</dd></div>}
        <div><dt>Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd></div>
        <div><dt>Tax (8%)</dt><dd>{formatPrice(totals.tax)}</dd></div>
        <div className="total"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
      </dl>
      {totals.shipping > 0 && <p className="hint">Add {formatPrice(missing)} more for free shipping.</p>}
      {children}
    </aside>
  );
}
