import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

const googleProvider = new GoogleAuthProvider();

// Create user doc in Firestore on first sign-in
async function createUserDocument(user) {
  const userRef = doc(db, "users", user.uid);
  await setDoc(
    userRef,
    {
      displayName: user.displayName || "",
      email: user.email,
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      completedTopics: {},
    },
    { merge: true }
  );
}

export async function signUpWithEmail(email, password, displayName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  await createUserDocument({ ...credential.user, displayName });
  return credential.user;
}

export async function signInWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await setDoc(
    doc(db, "users", credential.user.uid),
    { lastActive: serverTimestamp() },
    { merge: true }
  );
  return credential.user;
}

export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  await createUserDocument(credential.user);
  return credential.user;
}

export async function logOut() {
  await signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
