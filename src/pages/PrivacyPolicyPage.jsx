import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#0f0f0f] to-black text-white">
      {/* Main content */}
      <main className="flex-1 px-6 py-20 flex justify-center">
        <div className="max-w-3xl w-full space-y-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Privacy Policy</h1>

          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            At O2cube, your privacy matters. We collect only the data we need to deliver your order and enhance your experience.
          </p>

          <ul className="list-disc pl-6 space-y-3 text-gray-300 text-base sm:text-lg">
            <li>Your name, email & address are used only for order fulfillment.</li>
            <li>We never store payment info. All transactions are secure.</li>
            <li>We don’t share or sell your personal information to third parties.</li>
            <li>You may opt out of promotional emails anytime.</li>
            <li>Cookies are used solely to enhance your shopping experience.</li>
          </ul>

          <p className="text-sm text-gray-400 mt-4">Last updated: July 2025</p>
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

export default PrivacyPolicyPage;
