import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, PRODUCTS, queryProducts } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function CatalogPage() {
  // Filters live in the URL, so they survive reloads and can be shared.
  const [params, setParams] = useSearchParams();
  const filters = {
    search: params.get('q') ?? '',
    category: params.get('category') ?? '',
    sort: params.get('sort') ?? 'featured',
    inStockOnly: params.get('stock') === '1',
  };

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: true });
  };

  const products = useMemo(() => queryProducts(PRODUCTS, filters), [params]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <section className="toolbar">
        <input type="search" placeholder="Search products…" value={filters.search} onChange={(e) => setFilter('q', e.target.value)} aria-label="Search products" />
        <select value={filters.sort} onChange={(e) => setFilter('sort', e.target.value === 'featured' ? '' : e.target.value)} aria-label="Sort by">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Top rated</option>
          <option value="name">Name</option>
        </select>
        <label className="checkbox">
          <input type="checkbox" checked={filters.inStockOnly} onChange={(e) => setFilter('stock', e.target.checked ? '1' : '')} />
          In stock only
        </label>
      </section>

      <div className="chips" role="group" aria-label="Categories">
        {['', ...CATEGORIES].map((c) => (
          <button key={c || 'all'} className={`chip ${filters.category === c ? 'active' : ''}`} onClick={() => setFilter('category', c)}>
            {c || 'All'}
          </button>
        ))}
      </div>

      <p className="muted small">{products.length} products</p>
      {products.length === 0 ? (
        <p className="empty">No products match your filters.</p>
      ) : (
        <div className="grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </>
  );
}
