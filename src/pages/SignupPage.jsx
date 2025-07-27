import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://o2cube-production.up.railway.app/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) alert(data.error || 'Signup failed');
      else {
        alert("Signup successful. You can now login.");
        navigate('/login');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // Optionally, you can hide or disable Google Auth if not supported by backend
  const handleGoogleAuth = () => {
    alert("Google signup is not available at the moment.");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-black text-white p-2 rounded">
          Create Account
        </button>
      </form>

      <div className="text-center my-4 text-gray-500 text-sm">or</div>

      <button
        type="button"
        onClick={handleGoogleAuth}
        className="w-full border border-gray-300 p-2 rounded hover:bg-gray-100"
        disabled // disable for now if backend not ready
      >
        Continue with Google
      </button>

      <p className="mt-4 text-sm text-center">
        Already have an account?{' '}
        <Link className="text-blue-500" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
