import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = ({ cartItems = [], setCart }) => {
  const { user, token, login, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const total = (cartItems || []).reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadCustomImage = async (file, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    try {
      const res = await fetch('https://o2cube-production.up.railway.app/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const saveOrderToBackend = async () => {
    setLoading(true);

    const updatedItems = await Promise.all(
      cartItems.map(async (item) => {
        if (item.isCustom && item.file) {
          const url = await uploadCustomImage(item.file, user.id);
          if (!url) throw new Error('Image upload failed');
          return { ...item, image: url };
        }
        return item;
      })
    );

    try {
      const res = await fetch('https://o2cube-production.up.railway.app/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          user_id: user.id,
          items: updatedItems,
          total_amount: total,
          customer_info: { ...form, email: form.email || user.email },
        }),
      });

      if (!res.ok) {
        toast.error('❌ Failed to place order');
        setLoading(false);
        return false;
      }

      setCart([]);
      toast.success('✅ Order placed successfully!');
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Order save failed:', error);
      toast.error('❌ Failed to place order');
      setLoading(false);
      return false;
    }
  };

  const handleCashfreePayment = async () => {
    if (!user) return toast.error('Please log in first');

    if (!window.Cashfree) {
      toast.error('Cashfree SDK not loaded');
      return;
    }

    try {
      const res = await fetch('https://o2cube-production.up.railway.app/api/create-cashfree-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderAmount: total,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
        }),
      });

      const data = await res.json();

      if (!data.paymentSessionId) {
        return toast.error('Payment session failed');
      }

      toast.info('Redirecting to payment gateway...');

      const cashfree = new window.Cashfree();
      cashfree.initialiseDropin({
        paymentSessionId: data.paymentSessionId,
        returnUrl: `${window.location.origin}/orders`,
        redirectTarget: '_self',
        onSuccess: async () => {
          const success = await saveOrderToBackend();
          if (success) navigate('/orders');
        },
        onFailure: (data) => {
          toast.error('Payment failed');
          console.log('Cashfree Failure:', data);
        },
        onError: (err) => {
          toast.error('Payment error');
          console.log('Cashfree Error:', err);
        },
      });
    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error('⚠️ Failed to initiate payment. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return toast.error('Login required');
    const isEmpty = Object.values(form).some((val) => !val);
    if (isEmpty) return toast.error('Fill all fields');
    if (form.pincode.length !== 6) return toast.error('Invalid Pincode');

    handleCashfreePayment();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded w-full" />
        <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="border p-2 rounded w-full" />
        <input type="text" name="address" placeholder="Address Line" value={form.address} onChange={handleChange} className="border p-2 rounded w-full md:col-span-2" />
        <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} className="border p-2 rounded w-full" />
        <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} className="border p-2 rounded w-full" />
        <input type="text" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="border p-2 rounded w-full" />

        <button
          type="submit"
          disabled={loading}
          className="bg-black hover:bg-pink-500 transition-colors duration-200 text-white py-3 rounded md:col-span-2 w-full"
        >
          {loading ? 'Processing...' : 'Pay with Cashfree'}
        </button>
      </form>

      <div className="border-t pt-4 mt-8">
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm mb-2">
            <span>{item.title} x {item.quantity || 1} ({item.size})</span>
            <span>₹{item.price * (item.quantity || 1)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
