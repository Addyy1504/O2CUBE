import React from 'react';
import { Link } from 'react-router-dom';

const ReturnPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#0f0f0f] to-black text-white">
      {/* Main content area */}
      <main className="flex-1 px-6 py-20 flex justify-center">
        <div className="max-w-3xl w-full space-y-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Return & Exchange Policy</h1>

          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            At O2cube, every piece is <span className="text-white font-medium">made-to-order</span> and uniquely crafted just for you.
          </p>

          <p className="text-lg sm:text-xl font-semibold text-white">
            As of now, <span className="text-pink-400 font-bold">we do not offer returns or exchanges.</span>
          </p>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Please double-check your customization choices and delivery details before placing your order.
            If you receive a damaged or incorrect product, feel free to reach out to us at{" "}
            <a href="mailto:support@o2cube.in" className="text-pink-400 underline">support@o2cube.in</a> and we'll try our best to assist you.
          </p>
        </div>
      </main>

      {/* Footer */}
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

export default ReturnPolicyPage;
