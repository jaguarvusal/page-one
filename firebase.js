// Import the necessary Firebase SDK functions
import { initializeApp } from 'firebase/app';
// Import additional Firebase features if needed (e.g., Auth, Firestore, etc.)
// import { getAuth } from 'firebase/auth';  // Example: Firebase Auth

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0JQokd73NDsedE4R15HHuuNyWuPC7Y38",
  authDomain: "pageone-26.firebaseapp.com",
  projectId: "pageone-26",
  storageBucket: "pageone-26.firebasestorage.app",
  messagingSenderId: "495121334735",
  appId: "1:495121334735:web:9fc9a2187e6c73430d92ba",
  measurementId: "G-JV48VLV923"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// You can add additional Firebase services as needed, e.g.:
// const auth = getAuth(app); // For Firebase Authentication

export { app }; // Export the app instance to use it elsewhere in your app
