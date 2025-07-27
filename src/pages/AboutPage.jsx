import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-black text-white flex flex-col justify-between">
      <div className="px-6 py-20 flex justify-center">
        <div className="max-w-3xl w-full space-y-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">About O2cube</h1>

          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            <span className="text-white font-semibold">Your Wall. Your Story.</span><br /><br />
            O2cube isn’t just a store — it’s a vibe. We help you express your personality through curated, artistic wall décor.
          </p>

          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            Whether it’s bold flag tapestries or minimalist canvases, each product is made for the expressive, creative, and unapologetically Gen Z.
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base sm:text-lg">
            <li>✨ 100% customizable</li>
            <li>🎯 Gen Z-led designs</li>
            <li>🚛 Free nationwide shipping</li>
            <li>🎨 Made to express, not impress</li>
          </ul>
        </div>
      </div>

      <footer className="bg-black text-white py-8 px-6 border-t border-white/10">
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

export default AboutPage;
