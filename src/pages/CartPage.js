import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CartPage = ({ cart = [], setCart }) => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleQuantityChange = (index, amount) => {
    setCart(prevCart =>
      prevCart
        .map((item, i) => {
          if (i === index) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toLowerCase() === 'o2cube10') {
      setCouponDiscount(0.1); // 10% discount
    } else {
      setCouponDiscount(0);
      alert('Invalid coupon code');
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * couponDiscount;
  const shippingFee = 0;
  const total = subtotal - discountAmount + shippingFee;

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Main Content */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-6 text-sm flex items-center justify-between">
  <span>🎉 You’re eligible for <strong>Free Shipping</strong> on all orders!</span>
  <span className="text-xs text-green-600">No hidden charges 🚚</span>
</div>

        <hr className="mb-6" />

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div key={index} className="flex items-center gap-6 mb-6 border-b pb-4">
                {/* Product Image */}
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded shadow-sm hover:opacity-80 transition"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-grow">
                  <Link to={`/product/${item.id}`}>
                    <p className="font-semibold text-lg hover:underline">{item.title}</p>
                  </Link>
                  <p className="text-gray-600 text-sm">Size: {item.size}</p>
                  <p className="text-gray-600 text-sm">Price: ₹{item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(index, -1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(index, 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            {/* Coupon Input */}
            <div className="mt-6 mb-4">
              <label htmlFor="coupon" className="block font-medium mb-1">Have a Coupon?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="border px-4 py-2 rounded w-full"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-pink-500 transition"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="border-t pt-4 mt-4 text-sm">
              <div className="flex justify-between mb-2">
                <span>MRP (Subtotal)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Coupon Discount</span>
                <span className="text-green-600">-₹{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping Fee</span>
                <span className="text-gray-500">₹0</span>
              </div>
              <div className="flex justify-between mt-4 text-lg font-bold border-t pt-4">
                <span>Total Payable</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout */}
            <button
              className="mt-6 bg-black text-white py-3 w-full rounded hover:bg-pink-500 transition"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto">
          <p className="text-sm">&copy; 2025 O2cube. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0 text-sm">
            <Link to="/about" className="hover:text-pink-500 transition">About</Link>
            <Link to="/contact" className="hover:text-pink-500 transition">Contact</Link>
            <Link to="/privacy-policy" className="hover:text-pink-500 transition">Privacy</Link>
            <Link to="/return-policy" className="hover:text-pink-500 transition">Returns</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;
