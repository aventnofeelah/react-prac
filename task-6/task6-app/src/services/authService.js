import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";

export const authService = {
  subscribeToAuthChanges(callback) {
    return onAuthStateChanged(auth, callback);
  },

  signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  },

  login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  },

  logout() {
    return signOut(auth);
  },
};