import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct, PRODUCTS } from '../data/products.js';
import { useCart } from '../cart/CartContext.jsx';
import { formatPrice } from '../cart/cartReducer.js';
import ProductImage from '../components/ProductImage.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const product = getProduct(id);
  const { cart, dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return <p>Product not found. <Link to="/">Back to the shop</Link></p>;

  const inCart = cart.items.find((i) => i.id === product.id)?.quantity ?? 0;
  const available = product.stock - inCart;
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const add = () => {
    dispatch({ type: 'add', product, quantity });
    setAdded(true);
    setQuantity(1);
  };

  return (
    <>
      <Link to="/" className="back">← Back to shop</Link>
      <section className="product-detail">
        <ProductImage product={product} size="lg" />
        <div>
          <p className="muted">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="muted">★ {product.rating} / 5</p>
          <p className="price">{formatPrice(product.price)}</p>
          <p>{product.description}</p>
          <p className={product.stock < 5 ? 'warning' : 'muted'}>
            {product.stock === 0 ? 'Out of stock' : product.stock < 5 ? `Only ${product.stock} left` : 'In stock'}
          </p>

          {available > 0 && (
            <div className="buy">
              <div className="qty">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(available, q + 1))} aria-label="Increase quantity">+</button>
              </div>
              <button onClick={add}>Add to cart</button>
            </div>
          )}
          {inCart > 0 && <p className="success">{added ? 'Added! ' : ''}{inCart} in your cart · <Link to="/cart">View cart</Link></p>}
        </div>
      </section>

      {related.length > 0 && (
        <section>
          <h2>You may also like</h2>
          <div className="grid">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </>
  );
}
