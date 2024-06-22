// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDAUd0GQrLjOMaSOVrXc-_-h9rhtRqAphE",
  authDomain: "chatpos-6ea59.firebaseapp.com",
  projectId: "chatpos-6ea59",
  storageBucket: "chatpos-6ea59.appspot.com",
  messagingSenderId: "880507209999",
  appId: "1:880507209999:web:bbe6fc3014959921d0567a",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
