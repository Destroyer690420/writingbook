import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCBDYc3gh9Yc2Uvqi504W3Dd357UawSFZs",
  authDomain: "writingbook-a6cac.firebaseapp.com",
  projectId: "writingbook-a6cac",
  storageBucket: "writingbook-a6cac.firebasestorage.app",
  messagingSenderId: "900535013414",
  appId: "1:900535013414:web:613a1601ed5c6c43f516e7",
  measurementId: "G-9WWME5X5S7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);