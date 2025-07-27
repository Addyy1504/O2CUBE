import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD0mXh0KVnfy5eM0XXZATKCf9je41iBJfo",
  authDomain: "o2cube-3c235.firebaseapp.com",
  projectId: "o2cube-3c235",
  storageBucket: "o2cube-3c235.firebasestorage.app",
  messagingSenderId: "662319574920",
  appId: "1:662319574920:web:26a3aa6ba9c45800bd943d",
  measurementId: "G-B25TDKY8BK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app); // ✅ Firestore export
