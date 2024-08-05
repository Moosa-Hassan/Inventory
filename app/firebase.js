// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1RxWmpxaZoT3gvDT1rUQOYmwFMDomcXk",
  authDomain: "inventory-manager-16467.firebaseapp.com",
  projectId: "inventory-manager-16467",
  storageBucket: "inventory-manager-16467.appspot.com",
  messagingSenderId: "1084636774578",
  appId: "1:1084636774578:web:8a7e070ccf086ec8d4c9ab",
  measurementId: "G-ZX1NL9EK6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore, collection, addDoc, getDocs, deleteDoc, doc };