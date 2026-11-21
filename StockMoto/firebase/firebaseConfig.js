import { getApp, getApps, initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';

import { criarAuth } from './authInstance';

// Configuração usada pelo app. Por padrão é a de produção, como antes.
//
// Somente o build dos testes automatizados define
// EXPO_PUBLIC_FIREBASE_AMBIENTE=teste (ver playwright.config.ts). Nesse caso
// o app usa um projeto fictício "demo-", que não existe no Firebase: mesmo
// que uma requisição escapasse do mock dos testes, ela nunca alcançaria o
// projeto de produção. O Expo substitui a variável no momento do build, e o
// minificador descarta a configuração que não for usada.
const firebaseConfig =
  process.env.EXPO_PUBLIC_FIREBASE_AMBIENTE === 'teste'
    ? {
        apiKey: 'demo-api-key-stockmoto-testes',
        authDomain: 'demo-stockmoto.firebaseapp.com',
        projectId: 'demo-stockmoto',
        storageBucket: 'demo-stockmoto.appspot.com',
        messagingSenderId: '000000000000',
        appId: '1:000000000000:web:0000000000000000000000',
      }
    : {

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