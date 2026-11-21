import { getApp, getApps, initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';

import { criarAuth } from './authInstance';

const firebaseConfig = {

  apiKey: "AIzaSyCP3Xd4_EjR2im5nWN3GTD5TPSngTc5FB8",

  authDomain: "motostock-eabc6.firebaseapp.com",

  projectId: "motostock-eabc6",

  storageBucket: "motostock-eabc6.firebasestorage.app",

  messagingSenderId: "200886797291",

  appId: "1:200886797291:web:95cd9c9ae48333301fcfae",

};

// Evita inicializar o app duas vezes (ex.: Fast Refresh).
const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const dbFirebase =
  getFirestore(app);

// Persistência por plataforma: ver authInstance.ts / authInstance.native.ts
export const auth =
  criarAuth(app);