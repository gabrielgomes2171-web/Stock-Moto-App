import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';

import { auth, dbFirebase } from './firebaseConfig';

// Coleção "categorias" guarda as marcas, modelos e acessórios criados pelo usuário.
// tipo: 'marca' | 'modelo' | 'acessorio'
// Para tipo 'modelo', o campo "marca" guarda o NOME da marca (ex: "HONDA").

export async function cadastrarCategoriaFirebase({ tipo, nome, imagem, marca }) {
  const usuario = auth.currentUser;

  if (!usuario) {
    throw new Error('Usuário não logado');
  }

  await addDoc(collection(dbFirebase, 'categorias'), {
    usuario_id: usuario.uid,
    tipo,
    nome: nome.trim().toUpperCase(),
    imagem: imagem || '',
    marca: marca ? marca.trim().toUpperCase() : '',
    criado_em: new Date(),
  });
}

export async function listarCategoriasFirebase(tipo) {
  const usuario = auth.currentUser;

  if (!usuario) {
    return [];
  }

  const q = query(
    collection(dbFirebase, 'categorias'),
    where('usuario_id', '==', usuario.uid),
    where('tipo', '==', tipo)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((documento) => ({ id: documento.id, ...documento.data() }))
    .sort((a, b) => a.nome.localeCompare(b.nome));
}

export async function listarModelosPorMarcaFirebase(marca) {
  const modelos = await listarCategoriasFirebase('modelo');
  const alvo = (marca || '').trim().toUpperCase();
  return modelos.filter((m) => m.marca === alvo);
}

export async function excluirCategoriaFirebase(id) {
  await deleteDoc(doc(dbFirebase, 'categorias', id));
}
