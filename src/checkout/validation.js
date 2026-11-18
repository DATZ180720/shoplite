/** Checkout form validation. Returns an object { field: message }. */
export function validateCheckout(form) {
  const errors = {};
  const required = ['fullName', 'email', 'address', 'city', 'postalCode', 'cardName', 'cardNumber', 'expiry', 'cvc'];
  for (const field of required) {
    if (!String(form[field] ?? '').trim()) errors[field] = 'Required';
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';

  const digits = (form.cardNumber ?? '').replace(/\s/g, '');
  if (digits && !(/^\d{13,19}$/.test(digits) && luhn(digits))) errors.cardNumber = 'Invalid card number';

  if (form.expiry) {
    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(form.expiry);
    if (!match) errors.expiry = 'Use MM/YY';
    else {
      const [, mm, yy] = match;
      const endOfMonth = new Date(2000 + Number(yy), Number(mm), 1);
      if (endOfMonth <= new Date()) errors.expiry = 'Card has expired';
    }
  }

  if (form.cvc && !/^\d{3,4}$/.test(form.cvc)) errors.cvc = '3 or 4 digits';
  return errors;
}

/** Luhn checksum used by all major card networks. */
export function luhn(number) {
  let sum = 0;
  let double = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let d = Number(number[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export const formatCardNumber = (value) =>
  value.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');

export const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};
