import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import {
  auth,
  dbFirebase,
} from './firebaseConfig';

/* =========================
   CRIAR CONTA
========================= */

export async function criarContaFirebase(
  nome,
  email,
  senha
) {

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );

  const usuario =
    userCredential.user;

  await addDoc(
    collection(
      dbFirebase,
      'usuarios'
    ),
    {
      uid: usuario.uid,
      nome,
      email,
      criado_em:
        new Date(),
    }
  );

  return usuario;

}

/* =========================
   LOGIN
========================= */

export async function loginFirebase(
  email,
  senha
) {

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      senha
    );

  return userCredential.user;

}

/* =========================
   RECUPERAR SENHA
========================= */

export async function recuperarSenhaFirebase(
  email
) {

  await sendPasswordResetEmail(
    auth,
    email
  );

}

/* =========================
   BUSCAR USUÁRIO
========================= */

export async function buscarUsuarioFirebase(
  email
) {

  const q = query(
    collection(
      dbFirebase,
      'usuarios'
    ),

    where(
      'email',
      '==',
      email
    )
  );

  const querySnapshot =
    await getDocs(q);

  return querySnapshot;

}