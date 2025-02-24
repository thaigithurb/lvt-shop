// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3deATRZPLqiRjKWzcLtYK1o1N_4sJ0Hc",
  authDomain: "lvt-shop.firebaseapp.com",
  databaseURL: "https://lvt-shop-default-rtdb.firebaseio.com",
  projectId: "lvt-shop",
  storageBucket: "lvt-shop.firebasestorage.app",
  messagingSenderId: "535843828737",
  appId: "1:535843828737:web:1dd5e69cab8c81ebc2bc00",
  measurementId: "G-QL1RMSL0S6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
