// Demo catalog. In a real app this would come from an API.
export const CATEGORIES = ['Electronics', 'Home', 'Outdoors', 'Accessories'];

export const PRODUCTS = [
  { id: 'p1', name: 'Wireless Headphones', category: 'Electronics', price: 129.0, rating: 4.6, stock: 12, icon: '🎧', color: '#e0e7ff', description: 'Over-ear Bluetooth headphones with active noise cancelling and 30-hour battery life.' },
  { id: 'p2', name: 'Mechanical Keyboard', category: 'Electronics', price: 89.9, rating: 4.7, stock: 8, icon: '⌨️', color: '#fae8ff', description: 'Compact 75% layout with hot-swappable switches and RGB backlight.' },
  { id: 'p3', name: 'Smart Watch', category: 'Electronics', price: 199.0, rating: 4.3, stock: 5, icon: '⌚', color: '#dcfce7', description: 'Heart-rate, sleep and GPS tracking with a 7-day battery.' },
  { id: 'p4', name: 'Portable Speaker', category: 'Electronics', price: 59.5, rating: 4.4, stock: 20, icon: '🔊', color: '#fef3c7', description: 'Waterproof speaker with deep bass and 12 hours of playback.' },
  { id: 'p5', name: 'Ceramic Mug Set', category: 'Home', price: 24.0, rating: 4.8, stock: 30, icon: '☕', color: '#ffe4e6', description: 'Set of 4 handmade stoneware mugs, dishwasher safe.' },
  { id: 'p6', name: 'Desk Lamp', category: 'Home', price: 45.0, rating: 4.5, stock: 14, icon: '💡', color: '#fef9c3', description: 'Dimmable LED lamp with adjustable color temperature and USB charging port.' },
  { id: 'p7', name: 'Indoor Plant', category: 'Home', price: 32.0, rating: 4.2, stock: 9, icon: '🪴', color: '#d1fae5', description: 'Low-maintenance monstera in a 20 cm ceramic pot.' },
  { id: 'p8', name: 'Throw Blanket', category: 'Home', price: 38.5, rating: 4.6, stock: 0, icon: '🧶', color: '#ede9fe', description: 'Soft knitted cotton blanket, 130 × 170 cm.' },
  { id: 'p9', name: 'Hiking Backpack', category: 'Outdoors', price: 79.0, rating: 4.7, stock: 11, icon: '🎒', color: '#cffafe', description: '35 L water-resistant pack with padded hip belt and rain cover.' },
  { id: 'p10', name: 'Camping Tent', category: 'Outdoors', price: 149.0, rating: 4.4, stock: 4, icon: '⛺', color: '#ecfccb', description: 'Two-person, three-season tent that sets up in under 5 minutes.' },
  { id: 'p11', name: 'Water Bottle', category: 'Outdoors', price: 19.9, rating: 4.9, stock: 50, icon: '🧴', color: '#e0f2fe', description: 'Insulated stainless steel bottle, keeps drinks cold for 24 hours.' },
  { id: 'p12', name: 'Bike Light Kit', category: 'Outdoors', price: 27.0, rating: 4.1, stock: 17, icon: '🚲', color: '#fee2e2', description: 'Rechargeable front and rear lights with 5 modes.' },
  { id: 'p13', name: 'Leather Wallet', category: 'Accessories', price: 42.0, rating: 4.5, stock: 22, icon: '👛', color: '#ffedd5', description: 'Slim full-grain leather wallet with RFID blocking.' },
  { id: 'p14', name: 'Sunglasses', category: 'Accessories', price: 65.0, rating: 4.3, stock: 7, icon: '🕶️', color: '#f1f5f9', description: 'Polarized lenses with UV400 protection and a light acetate frame.' },
  { id: 'p15', name: 'Canvas Tote Bag', category: 'Accessories', price: 18.0, rating: 4.6, stock: 40, icon: '👜', color: '#fce7f3', description: 'Heavy-duty organic cotton tote with inner pocket.' },
  { id: 'p16', name: 'Baseball Cap', category: 'Accessories', price: 22.0, rating: 4.0, stock: 25, icon: '🧢', color: '#dbeafe', description: 'Adjustable cotton twill cap, one size fits most.' },
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

/** Search, filter and sort the catalog. Pure function → easy to test. */
export function queryProducts(products, { search = '', category = '', sort = 'featured', inStockOnly = false } = {}) {
  const term = search.trim().toLowerCase();
  const result = products.filter(
    (p) =>
      (!term || p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)) &&
      (!category || p.category === category) &&
      (!inStockOnly || p.stock > 0),
  );
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  return sorters[sort] ? [...result].sort(sorters[sort]) : result;
}
