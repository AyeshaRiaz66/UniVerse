import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdjTHniZJ_a31Qnj7inE3TJnOV3BbkKBM",
  authDomain: "universe-5c1f1.firebaseapp.com",
  projectId: "universe-5c1f1",
  storageBucket: "universe-5c1f1.firebasestorage.app",
  messagingSenderId: "308818690310",
  appId: "G-Q9FEVTEZFL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
