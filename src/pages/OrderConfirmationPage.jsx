import { Link, useParams } from 'react-router-dom';
import { formatPrice } from '../cart/cartReducer.js';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  let order = null;
  try {
    order = JSON.parse(sessionStorage.getItem(`shoplite:order:${orderId}`));
  } catch {
    /* ignore */
  }

  return (
    <section className="confirmation">
      <div className="check">✓</div>
      <h1>Thank you for your order!</h1>
      <p className="muted">Order <strong>{orderId}</strong>{order && <> · confirmation sent to {order.email}</>}</p>
      {order && (
        <ul className="confirmation-items">
          {order.items.map((i) => (
            <li key={i.id}>
              <span>{i.icon} {i.name} × {i.quantity}</span>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
          <li className="total"><span>Total paid</span><span>{formatPrice(order.totals.total)}</span></li>
        </ul>
      )}
      <Link to="/" className="button">Continue shopping</Link>
    </section>
  );
}
