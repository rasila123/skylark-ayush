// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3UYEAikFnqq9rWZ7UbrQolap_sTLLo9E",
  authDomain: "skylark-4f8e5.firebaseapp.com",
  projectId: "skylark-4f8e5",
  storageBucket: "skylark-4f8e5.appspot.com",
  messagingSenderId: "632909196181",
  appId: "1:632909196181:web:365ce3ca260ed430b7649c",
  measurementId: "G-HQKH5V3ZKH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);