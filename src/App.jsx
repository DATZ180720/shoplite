import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { useCart } from './cart/CartContext.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';

export default function App() {
  const { totals } = useCart();

  return (
    <>
      <header className="navbar">
        <Link to="/" className="logo">🍋 ShopLite</Link>
        <nav>
          <NavLink to="/" end>Shop</NavLink>
          <NavLink to="/cart" className="cart-link">
            Cart {totals.count > 0 && <span className="badge">{totals.count}</span>}
          </NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
          <Route path="*" element={<p>Page not found. <Link to="/">Back to the shop</Link></p>} />
        </Routes>
      </main>
    </>
  );
}
