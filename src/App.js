import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { GoogleOAuthProvider } from '@react-oauth/google';

import { ProductProvider } from './context/ProductContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import ChatBot from './components/ChatBot';

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ProductGrid from './pages/ProductGrid';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OrderHistory from './pages/OrderHistory';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import CustomizationHub from './pages/CustomizationHub';
import CanvasCategoryPage from './pages/CanvasCategoryPage';
import FlagsCategoryPage from './pages/FlagsCategoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GOOGLE_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  '879042990708-30amritno6a24tpgncoe755tv1aaq446.apps.googleusercontent.com';

// 🔐 User-protected route
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// 🔐 Admin-protected route (waits for auth to load)
const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (user === null) {
    return <div className="p-10 text-center">Checking admin access...</div>;
  }

  const isAdmin = user.email === 'o2cube02@gmail.com';
  return isAdmin ? children : <Navigate to="/" />;
};

function App() {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const index = prev.findIndex((p) => p.id === item.id && p.size === item.size);
      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity += item.quantity || 1;
        return updated;
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const handleRemoveFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <ProductProvider>
            <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <div className="pt-[110px] px-2 sm:px-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/canvas/:slug" element={<CanvasCategoryPage onAdd={handleAddToCart} />} />
                <Route path="/flags/:slug" element={<FlagsCategoryPage onAdd={handleAddToCart} />} />
                <Route path="/product/:id" element={<ProductPage onAdd={handleAddToCart} />} />
                <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} onRemove={handleRemoveFromCart} />} />
                <Route path="/custom" element={<CustomizationHub onAdd={handleAddToCart} />} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage cartItems={cart} setCart={setCart} /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/return-policy" element={<ReturnPolicyPage />} />
              </Routes>
            </div>

            <ChatBot />
          </ProductProvider>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
