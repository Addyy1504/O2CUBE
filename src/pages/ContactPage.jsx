import React, { useState } from 'react';
import { FaInstagram, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const whatsappNumber = '919999999999'; // Replace with real number

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `Hi, I'm ${form.name} (%0AEmail: ${form.email}) 👋%0A%0A${form.message}`;
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#0f0f0f] to-black text-white">
      {/* Main content */}
      <main className="flex-1 px-6 py-20 flex justify-center">
        <div className="max-w-xl w-full space-y-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Contact Us</h1>
          <p className="text-gray-300 text-lg sm:text-xl">
            Got a question, collaboration, or custom request? We’re just a message away.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-3 rounded bg-black border border-white placeholder-gray-400 text-white"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full p-3 rounded bg-black border border-white placeholder-gray-400 text-white"
              required
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={5}
              className="w-full p-3 rounded bg-black border border-white placeholder-gray-400 text-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-black font-semibold px-6 py-2 rounded hover:bg-gray-200 transition w-full"
            >
              Send via WhatsApp
            </button>
          </form>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-white text-base mt-6">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-pink-400" />
              <a href="mailto:support@o2cube.in" className="underline hover:text-pink-400">
                support@o2cube.in
              </a>
            </div>
            <div className="flex items-center gap-2">
              <FaInstagram className="text-pink-400" />
              <a
                href="https://instagram.com/o2cubee"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-pink-400"
              >
                @o2cubee
              </a>
            </div>
          </div>
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

export default ContactPage;
