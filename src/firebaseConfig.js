// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcFB2Z1R6233sKCVb5W-b4qXo5RBoRs8c",
  authDomain: "cashierless-e3399.firebaseapp.com",
  projectId: "cashierless-e3399",
  storageBucket: "cashierless-e3399.appspot.com",
  messagingSenderId: "821316874891",
  appId: "1:821316874891:web:48d32e151f2dde1ced9a8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export {
  db, auth
}