import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAkYPQ6IFYObo62fLAtcuA3bHSjF6vy9c",
  authDomain: "presello-clone.firebaseapp.com",
  projectId: "presello-clone",
  storageBucket: "presello-clone.appspot.com",
  messagingSenderId: "1064387318345",
  appId: "1:1064387318345:web:037406e692059ba9db6598",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
