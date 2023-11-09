
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-138af.firebaseapp.com",
  projectId: "mern-estate-138af",
  storageBucket: "mern-estate-138af.appspot.com",
  messagingSenderId: "121502283038",
  appId: "1:121502283038:web:b48bb335b8c634e148050f",
  measurementId: "G-731VJ8EK92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app