import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';

import { getAuth } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyCP3Xd4_EjR2im5nWN3GTD5TPSngTc5FB8",

  authDomain: "motostock-eabc6.firebaseapp.com",

  projectId: "motostock-eabc6",

  storageBucket: "motostock-eabc6.firebasestorage.app",

  messagingSenderId: "200886797291",

  appId: "1:200886797291:web:95cd9c9ae48333301fcfae",

};

const app = initializeApp(firebaseConfig);

export const dbFirebase =
  getFirestore(app);

export const auth =
  getAuth(app);