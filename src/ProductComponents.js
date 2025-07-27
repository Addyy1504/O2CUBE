import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';

const ProductContext = createContext();

const generateProducts = () => {
  const canvas = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    title: `Canvas Art ${i + 1}`,
    basePrice: 799,
    category: 'Canvas',
    description: `High-quality canvas art piece number ${i + 1}.`,
    image: 'https://via.placeholder.com/400x300',
    sizes: [
      { label: '8x12 inch', price: 799 },
      { label: '16x20 inch', price: 1299 },
      { label: '20x30 inch', price: 1799 }
    ]
  }));

  const flags = Array.from({ length: 200 }, (_, i) => ({
    id: i + 201,
    title: `Wall Flag ${i + 1}`,
    basePrice: 399,
    category: 'Wall Flags',
    description: `Unique wall flag design number ${i + 1}.`,
    image: 'https://via.placeholder.com/400x300',
    sizes: [
      { label: '24x24 inch', price: 399 },
      { label: '30x40 inch', price: 599 },
      { label: '40x50 inch', price: 799 }
    ]
  }));

  return [...canvas, ...flags];
};

const ProductProvider = ({ children }) => {
  const [products] = useState(generateProducts());
  return <ProductContext.Provider value={products}>{children}</ProductContext.Provider>;
};

const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

const Navbar = ({ cartCount }) => (
  <nav className="flex justify-between items-center p-4 border-b shadow-sm sticky top-0 bg-white z-10">
    <Link to="/">
      <img
        src="/logo.png"
        alt="O2cube Logo"
        className="h-10 transition-transform duration-200 hover:scale-110"
      />
    </Link>
    <div className="space-x-4 flex items-center">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/canvas" className="hover:underline">Canvas</Link>
      <Link to="/flags" className="hover:underline">Wall Flags</Link>
      <Link to="/cart" className="relative hover:underline">
        {cartCount > 0 ? (
          <span className="bg-black text-white rounded-full text-xs w-6 h-6 flex items-center justify-center">{cartCount}</span>
        ) : (
          '🛒'
        )}
      </Link>
      <Link to="/login" className="hover:underline text-lg">👤</Link>
    </div>
  </nav>
);

const ProductPage = ({ onAdd }) => {
  const { id } = useParams();
  const products = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [rating] = useState(4.2);
  const [reviews] = useState([
    { user: 'John', text: 'Loved the quality and design!' },
    { user: 'Aisha', text: 'Looks amazing on my wall!' }
  ]);

  useEffect(() => {
    if (!id || !products || !Array.isArray(products)) return;
    const found = products.find((p) => p.id === Number(id));
    if (found) {
      setProduct(found);
      setSelectedSize(found.sizes[0]);
    } else {
      setProduct(null);
    }
  }, [id, products]);

  if (!product) return <p className="p-6">Product not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={product.image} alt={product.title} className="w-full h-auto rounded" />
        <div>
          <h2 className="text-3xl font-semibold mb-1">{product.title}</h2>
          <div className="flex items-center mb-3">
            <span className="text-yellow-500 mr-2">{'★'.repeat(Math.floor(rating))}{rating % 1 ? '½' : ''}</span>
            <span className="text-gray-600">{rating.toFixed(1)} / 5</span>
          </div>
          <p className="mb-4 text-gray-700">{product.description}</p>

          <label className="block mb-2 font-medium">Choose Size:</label>
          <select
            value={selectedSize?.label || ''}
            onChange={(e) => {
              const size = product.sizes.find((s) => s.label === e.target.value);
              setSelectedSize(size);
            }}
            className="border rounded p-2 mb-4 w-full"
          >
            {product.sizes.map((size) => (
              <option key={size.label} value={size.label}>
                {size.label} - ₹{size.price}
              </option>
            ))}
          </select>

          <button
            onClick={() => onAdd({ ...product, price: selectedSize.price, size: selectedSize.label })}
            className="bg-black text-white py-2 px-6 rounded hover:opacity-80"
            disabled={!selectedSize}
          >
            Add to Cart - ₹{selectedSize?.price || ''}
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
        {reviews.map((review, index) => (
          <div key={index} className="border-t pt-2 mt-2">
            <p className="font-medium">{review.user}</p>
            <p>{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Navbar, ProductPage, ProductProvider, useProducts }; 