import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { Link } from 'react-router-dom';


const HomePage = () => {
  const navigate = useNavigate();
  const [showCanvasModal, setShowCanvasModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const { products } = useProducts();

  const handleNavigate = (base, slug) => {
    navigate(`/${base}/${slug}`);
    setShowCanvasModal(false);
    setShowFlagModal(false);
  };

  const canvasCategories = [
    { name: 'Motivation', slug: 'motivation' },
    { name: 'Divine Strokes', slug: 'tv-shows' },
    { name: 'Netflix Nirvana', slug: 'hindu-gods' },
    { name: 'GenZ Aesthetics', slug: 'genz' },
    { name: 'Line Minimal', slug: 'line-art' },
    { name: 'F1', slug: 'f-bold' },
  ];

  const flagCategories = [
    { name: 'Football Clubs', slug: 'football' },
    { name: 'NBA Legends', slug: 'nba' },
    { name: 'F1', slug: 'pop' },
    { name: 'Abstracts', slug: 'abstracts' },
  ];

  return (
    <div className="text-white bg-black font-sans">

      {/* HERO */}
      <section
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4 text-center"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/hero-bg.png)` }}
      >
        <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 drop-shadow-lg">Your Wall, Your Story</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => setShowCanvasModal(true)} className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition">
            Shop Canvas
          </button>
          <button onClick={() => setShowFlagModal(true)} className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition">
            Shop Wall Flags
          </button>
        </div>
      </section>

      {/* TRENDING */}
      <section className="py-12 px-4 bg-white text-black">
        <h2 className="text-3xl font-playfair font-semibold text-center mb-8">Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="bg-white border rounded shadow p-3">
              <img src={product.images?.[0]} alt={product.title} className="w-full h-48 object-cover rounded" />
              <h3 className="font-semibold mt-2">{product.title}</h3>
              <p className="text-sm text-gray-600">Starts at ₹{product.basePrice}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-0 text-center bg-white py-6 px-2 rounded text-black">
  <p className="text-xl italic font-playfair max-w-3xl mx-auto">
    “Style is a way to say who you are without having to speak.”
  </p>
  <p className="mt-4 text-sm text-gray-600 font-special">— Rachel Zoe</p>
</div>


      {/* WHY US */}
      <section className="bg-black text-white py-12 px-4 md:px-10">
  <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-16">Why Choose O2cube?</h2>

  <div className="flex flex-wrap justify-center md:justify-between gap-8 md:gap-0 mt-4">
    <div className="text-center w-64">
      <p className="text-xl font-semibold mb-1">🎨 Customisable Art</p>
      <p className="text-sm text-gray-300">Make it yours at no extra cost.</p>
    </div>
    <div className="text-center w-64">
      <p className="text-xl font-semibold mb-1">🚚 Free Shipping</p>
      <p className="text-sm text-gray-300">Pan India delivery on all orders.</p>
    </div>
    <div className="text-center w-64">
      <p className="text-xl font-semibold mb-1">🇮🇳 Made in India</p>
      <p className="text-sm text-gray-300">Proudly printed & packed locally.</p>
    </div>
    <div className="text-center w-64">
      <p className="text-xl font-semibold mb-1">✨ Premium Quality</p>
      <p className="text-sm text-gray-300">Fade-resistant, durable prints.</p>
    </div>
  </div>
</section>




      {/* ABOUT */}
      <section className="py-16 px-6 bg-[#f5f5f5] text-center text-black">
        <h2 className="text-3xl font-playfair font-semibold mb-4">About O2cube</h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-700">
          O2cube is not just a decor brand. We transform blank walls into personal stories. Whether you vibe with minimalism, motivation, or Gen-Z energy — we’ve got your aesthetic.
        </p>
      </section>

      {/* FOOTER */}
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

      {/* MODALS */}
      <AnimatePresence>
        {showCanvasModal && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white text-black p-6 rounded-xl shadow-xl w-80"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h2 className="text-xl font-bold mb-4">Choose Canvas Category</h2>
              {canvasCategories.map((cat) => (
                <button key={cat.slug} className="block w-full text-left py-2 px-4 hover:bg-pink-100 rounded"
                  onClick={() => handleNavigate('canvas', cat.slug)}>
                  {cat.name}
                </button>
              ))}
              <button onClick={() => setShowCanvasModal(false)} className="mt-4 text-sm text-gray-500 hover:underline">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFlagModal && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white text-black p-6 rounded-xl shadow-xl w-80"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h2 className="text-xl font-bold mb-4">Choose Flag Category</h2>
              {flagCategories.map((cat) => (
                <button key={cat.slug} className="block w-full text-left py-2 px-4 hover:bg-pink-100 rounded"
                  onClick={() => handleNavigate('flags', cat.slug)}>
                  {cat.name}
                </button>
              ))}
              <button onClick={() => setShowFlagModal(false)} className="mt-4 text-sm text-gray-500 hover:underline">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
