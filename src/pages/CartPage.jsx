import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext.jsx';
import { COUPONS, formatPrice } from '../cart/cartReducer.js';
import ProductImage from '../components/ProductImage.jsx';
import OrderSummary from '../components/OrderSummary.jsx';

export default function CartPage() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (cart.items.length === 0) {
    return (
      <div className="empty">
        <h1>Your cart is empty</h1>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  const applyCoupon = (e) => {
    e.preventDefault();
    if (!COUPONS[code.trim().toUpperCase()]) return setCouponError('Invalid coupon code');
    dispatch({ type: 'applyCoupon', code });
    setCode('');
    setCouponError('');
  };

  return (
    <>
      <h1>Your cart</h1>
      <div className="two-columns">
        <ul className="cart-items">
          {cart.items.map((item) => (
            <li key={item.id}>
              <ProductImage product={item} size="sm" />
              <div className="item-info">
                <Link to={`/product/${item.id}`}>{item.name}</Link>
                <span className="muted small">{formatPrice(item.price)} each</span>
              </div>
              <div className="qty">
                <button onClick={() => dispatch({ type: 'setQuantity', id: item.id, quantity: item.quantity - 1 })} aria-label={`Decrease ${item.name}`}>−</button>
                <span>{item.quantity}</span>
                <button disabled={item.quantity >= item.stock} onClick={() => dispatch({ type: 'setQuantity', id: item.id, quantity: item.quantity + 1 })} aria-label={`Increase ${item.name}`}>+</button>
              </div>
              <strong className="line-total">{formatPrice(item.price * item.quantity)}</strong>
              <button className="link danger" onClick={() => dispatch({ type: 'remove', id: item.id })}>Remove</button>
            </li>
          ))}
        </ul>

        <OrderSummary>
          {cart.coupon ? (
            <p className="small">
              Coupon <strong>{cart.coupon}</strong> applied · <button className="link" onClick={() => dispatch({ type: 'removeCoupon' })}>Remove</button>
            </p>
          ) : (
            <form className="coupon" onSubmit={applyCoupon}>
              <input placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Coupon code" />
              <button className="secondary">Apply</button>
            </form>
          )}
          {couponError && <p className="error small">{couponError}</p>}
          <p className="muted small">Try SAVE10 or WELCOME15</p>
          <button className="full" onClick={() => navigate('/checkout')}>Checkout</button>
        </OrderSummary>
      </div>
    </>
  );
}
