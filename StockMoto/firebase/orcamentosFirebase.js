import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

import {
  auth,
  dbFirebase,
} from './firebaseConfig';

export async function listarOrcamentosFirebase() {

  const usuario =
    auth.currentUser;

  if (!usuario) {
    return [];
  }

  const q = query(

    collection(
      dbFirebase,
      'orcamentos'
    ),

    where(
      'usuario_id',
      '==',
      usuario.uid
    ),

    orderBy(
      'criado_em',
      'desc'
    )

  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (documento) => ({
      id: documento.id,
      ...documento.data(),
    })
  );

}

export async function criarOrcamentoFirebase(
  orcamento
) {

  const usuario =
    auth.currentUser;

  if (!usuario) {

    throw new Error(
      'Usuário não logado'
    );

  }

  await addDoc(

    collection(
      dbFirebase,
      'orcamentos'
    ),

    {

      usuario_id:
        usuario.uid,

      cliente_nome:
        orcamento.cliente_nome,

      telefone:
        orcamento.telefone,

      moto:
        orcamento.moto,

      validade:
        orcamento.validade,

      observacoes:
        orcamento.observacoes,

      total:
        orcamento.total,

      status:
        orcamento.status || 'Aberto',

      criado_em:
        new Date(),

    }

  );

}