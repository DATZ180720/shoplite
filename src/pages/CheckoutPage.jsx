import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext.jsx';
import { validateCheckout, formatCardNumber, formatExpiry } from '../checkout/validation.js';
import OrderSummary from '../components/OrderSummary.jsx';

const EMPTY = { fullName: '', email: '', address: '', city: '', postalCode: '', cardName: '', cardNumber: '', expiry: '', cvc: '' };

function Field({ label, name, form, errors, onChange, ...props }) {
  return (
    <label className={errors[name] ? 'invalid' : ''}>
      {label}
      <input name={name} value={form[name]} onChange={onChange} aria-invalid={!!errors[name]} {...props} />
      {errors[name] && <small className="error">{errors[name]}</small>}
    </label>
  );
}

export default function CheckoutPage() {
  const { cart, totals, dispatch } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (cart.items.length === 0) return <Navigate to="/cart" replace />;

  const onChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber') value = formatCardNumber(value);
    if (name === 'expiry') value = formatExpiry(value);
    if (name === 'cvc') value = value.replace(/\D/g, '').slice(0, 4);
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validateCheckout(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800)); // simulated payment request
    const orderId = `SL-${Date.now().toString(36).toUpperCase()}`;
    const order = { id: orderId, email: form.email, items: cart.items, totals };
    sessionStorage.setItem(`shoplite:order:${orderId}`, JSON.stringify(order));
    dispatch({ type: 'clear' });
    navigate(`/order/${orderId}`, { replace: true });
  };

  const fieldProps = { form, errors, onChange };

  return (
    <>
      <h1>Checkout</h1>
      <div className="two-columns">
        <form className="checkout" onSubmit={submit} noValidate>
          <fieldset>
            <legend>Shipping</legend>
            <Field label="Full name" name="fullName" autoComplete="name" {...fieldProps} />
            <Field label="Email" name="email" type="email" autoComplete="email" {...fieldProps} />
            <Field label="Address" name="address" autoComplete="street-address" {...fieldProps} />
            <div className="row">
              <Field label="City" name="city" autoComplete="address-level2" {...fieldProps} />
              <Field label="Postal code" name="postalCode" autoComplete="postal-code" {...fieldProps} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Payment <small className="muted">(demo — use 4242 4242 4242 4242)</small></legend>
            <Field label="Name on card" name="cardName" autoComplete="cc-name" {...fieldProps} />
            <Field label="Card number" name="cardNumber" inputMode="numeric" autoComplete="cc-number" {...fieldProps} />
            <div className="row">
              <Field label="Expiry (MM/YY)" name="expiry" inputMode="numeric" autoComplete="cc-exp" {...fieldProps} />
              <Field label="CVC" name="cvc" inputMode="numeric" autoComplete="cc-csc" {...fieldProps} />
            </div>
          </fieldset>

          <button className="full" disabled={submitting}>{submitting ? 'Processing…' : 'Place order'}</button>
        </form>
        <OrderSummary />
      </div>
    </>
  );
}
