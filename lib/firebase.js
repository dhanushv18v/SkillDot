import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZiswsWDnYNDoRk-vlQHrlAj-5IZG7ERQ",
  authDomain: "skilldot-a4b9c.firebaseapp.com",
  projectId: "skilldot-a4b9c",
  storageBucket: "skilldot-a4b9c.firebasestorage.app",
  messagingSenderId: "191014685638",
  appId: "1:191014685638:web:155a0171972203bf8300c7",
  measurementId: "G-FJ8S03RHEF",
};

// Initialize Firebase (singleton pattern for Next.js)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
