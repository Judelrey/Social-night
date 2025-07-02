import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDmmaC3MKmzQ03Q3nrKIlF2KbcHz311ZU",
  authDomain: "star-rey.firebaseapp.com",
  projectId: "star-rey",
  storageBucket: "star-rey.appspot.com",
  messagingSenderId: "709224254692",
  appId: "1:709224254692:web:acb72a8ef1df57965930f1",
  measurementId: "G-T5EXT06L6J"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);