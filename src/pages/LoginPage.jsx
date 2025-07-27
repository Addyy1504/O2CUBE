import React, { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', userCred.user.email);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Signup failed!');
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', result.user.email);
      toast.success('Signed up with Google!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Google signup failed!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl bg-white shadow">
      <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-black text-white p-2 rounded" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center my-4 text-gray-500 text-sm">or</div>

      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full border border-gray-300 p-2 rounded hover:bg-gray-100"
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
