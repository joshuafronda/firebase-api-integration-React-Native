import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2zOUc7N2up5WXSDlz2ylkoSyczfwYKQ4",
  authDomain: "android-app-85d15.firebaseapp.com",
  projectId: "android-app-85d15",
  storageBucket: "android-app-85d15.firebasestorage.app",
  messagingSenderId: "580589539996",
  appId: "1:580589539996:web:e28988795cfbc8a596d359",
  measurementId: "G-1HZSVT53L8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics only if supported (web environment)
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { analytics };

export default app;
