import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { auth } from '../firebase'; // ✅ import Firebase Auth
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const welcomedRef = useRef(false);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    welcomedRef.current = false;
    toast.info('Logged out!');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setUser({ email: firebaseUser.email });
        setToken(token);
        localStorage.setItem('user', JSON.stringify({ email: firebaseUser.email }));
        localStorage.setItem('authToken', token);
        if (!welcomedRef.current) {
          welcomedRef.current = true;
          toast.success(`Welcome back, ${firebaseUser.email}!`);
        }
      } else {
        setUser(null);
        setToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === 'o2cube02@gmail.com';

  return (
    <AuthContext.Provider value={{ user, token, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
