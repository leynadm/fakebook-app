// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-bqZlEYcBPL05pcB8Do38I8ZB1h_N3ik",
  authDomain: "stalkbook-99d40.firebaseapp.com",
  projectId: "stalkbook-99d40",
  storageBucket: "stalkbook-99d40.appspot.com",
  messagingSenderId: "188065717568",
  appId: "1:188065717568:web:1125de4dab3f9329282ea5",
  measurementId: "G-DL497JB0DR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { app, analytics, auth, db, storage };
