// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnGdoKr5V8eXIYRjaK5WDV1DGLVL180Ig",
  authDomain: "house-marketplace-app-e1356.firebaseapp.com",
  projectId: "house-marketplace-app-e1356",
  storageBucket: "house-marketplace-app-e1356.appspot.com",
  messagingSenderId: "1011954547971",
  appId: "1:1011954547971:web:51d2670ff0b6c6a2eefd36",
  measurementId: "G-4XZGRBPQ4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore()