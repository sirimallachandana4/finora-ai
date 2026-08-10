import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWtbekJcVbFYIUCkDulewfP2Kb-FBAVa0",
  authDomain: "finora-ai-de482.firebaseapp.com",
  projectId: "finora-ai-de482",
  storageBucket: "finora-ai-de482.firebasestorage.app",
  messagingSenderId: "605367403691",
  appId: "1:605367403691:web:5bc61f39e20c1ab347e3ee",
  measurementId: "G-4MJRZG36PT",
};

const app = initializeApp(firebaseConfig);

getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);