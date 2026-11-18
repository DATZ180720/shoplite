import { Link } from 'react-router-dom';
import { useCart } from '../cart/CartContext.jsx';
import { formatPrice } from '../cart/cartReducer.js';
import ProductImage from './ProductImage.jsx';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const soldOut = product.stock === 0;

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <ProductImage product={product} />
        <h3>{product.name}</h3>
      </Link>
      <p className="muted small">{product.category} · ★ {product.rating}</p>
      <div className="card-footer">
        <strong>{formatPrice(product.price)}</strong>
        <button disabled={soldOut} onClick={() => dispatch({ type: 'add', product })}>
          {soldOut ? 'Sold out' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}
