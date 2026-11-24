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
  doc,
  getDoc,
  setDoc,
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

/* =========================
   PERFIL (nome e foto)
   Fica em "perfis/{uid}", um documento por conta.
========================= */

export async function buscarPerfilFirebase(uid) {
  const perfil = await getDoc(doc(dbFirebase, 'perfis', uid));

  if (perfil.exists()) {
    return perfil.data();
  }

  // Ainda não salvou o perfil: usa o nome digitado ao criar a conta
  const q = query(
    collection(dbFirebase, 'usuarios'),
    where('uid', '==', uid)
  );

  const resultado = await getDocs(q);

  if (!resultado.empty) {
    return {
      nome: resultado.docs[0].data().nome || '',
      imagem: '',
    };
  }

  return null;
}

export async function salvarPerfilFirebase(uid, dados) {
  await setDoc(
    doc(dbFirebase, 'perfis', uid),
    {
      nome: dados.nome,
      imagem: dados.imagem || '',
      atualizado_em: new Date(),
    },
    { merge: true }
  );
}
