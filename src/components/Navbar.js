import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export const Navbar = ({ cartCount }) => {
  const { user, token, login, logout, isAdmin } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [canvasDropdown, setCanvasDropdown] = useState(false);
  const [flagDropdown, setFlagDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const canvasCategories = [
    { name: 'Motivation', slug: 'motivation' },
    { name: 'Divine Strokes', slug: 'tv-shows' },
    { name: 'Netflix Nirvana', slug: 'hindu-gods' },
    { name: 'GenZ Aesthetics', slug: 'genz' },
    { name: 'Line Minimal', slug: 'line-art' },
    { name: 'F1', slug: 'f-bold' }
  ];

  const flagCategories = [
    { name: 'Football Clubs', slug: 'football' },
    { name: 'NBA Legends', slug: 'nba' },
    { name: 'Anime Vibes', slug: 'anime' },
    { name: 'Pop Culture', slug: 'pop' },
    { name: 'Abstracts', slug: 'abstracts' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`flex justify-between items-center px-6 py-3 fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      {/* Logo with hover animation */}
      <Link to="/" className="flex items-center">
        <img
          src="/logo.png"
          alt="O2cube Logo"
          className="h-10 w-auto transition-transform duration-300 hover:scale-110"
        />
      </Link>

      {/* Right side menu */}
      <div className="flex items-center gap-4 ml-auto text-sm">
        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Canvas Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setCanvasDropdown(true)}
            onMouseLeave={() => setCanvasDropdown(false)}
          >
            <button className="px-3 py-1 text-black hover:text-pink-600">Canvas ▼</button>
            {canvasDropdown && (
              <div className="absolute top-full left-0 bg-white shadow-md z-50 min-w-[150px]">
                {canvasCategories.map(cat => (
                  <Link
                    to={`/canvas/${cat.slug}`}
                    key={cat.slug}
                    className="block px-4 py-2 text-sm text-black hover:bg-pink-50"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Wall Flags Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setFlagDropdown(true)}
            onMouseLeave={() => setFlagDropdown(false)}
          >
            <button className="px-3 py-1 text-black hover:text-pink-600">Wall Flags ▼</button>
            {flagDropdown && (
              <div className="absolute top-full left-0 bg-white shadow-md z-50 min-w-[150px]">
                {flagCategories.map(cat => (
                  <Link
                    to={`/flags/${cat.slug}`}
                    key={cat.slug}
                    className="block px-4 py-2 text-sm text-black hover:bg-pink-50"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Customize Button */}
          <Link
            to="/custom"
            className="text-pink-600 font-medium hover:bg-pink-100 px-3 py-1 rounded-md"
          >
            Customize
          </Link>

          {/* Profile */}
          <Link
            to={user ? '/profile' : '/login'}
            className="text-xl px-2 py-1 hover:bg-pink-100 rounded-md"
            title={user ? 'Profile' : 'Login'}
          >
            👤
          </Link>
        </div>

        {/* Cart Icon */}
        <Link
          to="/cart"
          className="relative text-xl px-2 py-1 hover:bg-pink-100 rounded-md"
        >
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Hamburger for mobile */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="sm:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md sm:hidden z-50">
          {/* Canvas Section */}
          <div className="border-b">
            <button
              onClick={() => setCanvasDropdown(prev => !prev)}
              className="w-full text-left px-4 py-3 text-sm font-semibold flex justify-between"
            >
              Canvas <span>▼</span>
            </button>
            {canvasDropdown && (
              <div className="bg-pink-50">
                {canvasCategories.map(cat => (
                  <Link
                    to={`/canvas/${cat.slug}`}
                    key={cat.slug}
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-2 text-black text-sm"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Flags Section */}
          <div className="border-b">
            <button
              onClick={() => setFlagDropdown(prev => !prev)}
              className="w-full text-left px-4 py-3 text-sm font-semibold flex justify-between"
            >
              Wall Flags <span>▼</span>
            </button>
            {flagDropdown && (
              <div className="bg-pink-50">
                {flagCategories.map(cat => (
                  <Link
                    to={`/flags/${cat.slug}`}
                    key={cat.slug}
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-2 text-black text-sm"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Customize & Login */}
          <Link
            to="/custom"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-3 border-b text-pink-600 font-medium text-sm"
          >
            Customize
          </Link>
          <Link
            to={user ? '/profile' : '/login'}
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-3 text-sm text-black"
          >
            {user ? 'Profile' : 'Login'}
          </Link>
        </div>
      )}
    </nav>
  );
};
