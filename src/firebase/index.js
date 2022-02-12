import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDj9R8HWU4uu2BY0FaTpBk7XOK5Z8do9zY",
  authDomain: "github-information-dashboard.firebaseapp.com",
  projectId: "github-information-dashboard",
  storageBucket: "github-information-dashboard.appspot.com",
  messagingSenderId: "945322208738",
  appId: "1:945322208738:web:6128b39a161b63b0569dbb",
  measurementId: "G-141BZY7EG6"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
