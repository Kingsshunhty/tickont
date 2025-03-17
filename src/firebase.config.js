// Import required Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration (Use environment variables for security)
const firebaseConfig = {
  apiKey: "AIzaSyDOJ4HTHbAInhEYYh2ieNDp9wzIugJV7es",
  authDomain: "ticket-bda52.firebaseapp.com",
  projectId: "ticket-bda52",
  storageBucket: "ticket-bda52.appspot.com",

  messagingSenderId: "480845611985",
  appId: "1:480845611985:web:a5b8e962f68d79010c56f0",
  measurementId: "G-ZCCMHZM89T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
