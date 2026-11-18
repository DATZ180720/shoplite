export default function ProductImage({ product, size = 'md' }) {
  return (
    <div className={`product-image ${size}`} style={{ background: product.color }} role="img" aria-label={product.name}>
      <span aria-hidden="true">{product.icon}</span>
    </div>
  );
}
