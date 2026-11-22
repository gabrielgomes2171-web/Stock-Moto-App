import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA1Lh-yA6XGTc2hij5exN_0pye6C-rh7hM",
  authDomain: "stockmoto-a922d.firebaseapp.com",
  projectId: "stockmoto-a922d",
  storageBucket: "stockmoto-a922d.firebasestorage.app",
  messagingSenderId: "364911465739",
  appId: "1:364911465739:web:a321dda542ff3e139cbe0e",
  measurementId: "G-8QPCH9QQR1"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

export { auth };
export const dbFirebase = getFirestore(app);
export default app;