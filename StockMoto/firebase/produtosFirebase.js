import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  increment,
} from 'firebase/firestore';

import {
  auth,
  dbFirebase,
} from './firebaseConfig';

export async function cadastrarProdutoFirebase(produto) {
  const usuario = auth.currentUser;

  if (!usuario) {
    throw new Error('Usuário não logado');
  }

  await addDoc(
    collection(dbFirebase, 'produtos'),
    {
      usuario_id: usuario.uid,
      nome: produto.nome,
      codigo: produto.codigo,
      categoria: produto.categoria,
      marca: produto.marca,
      modelo_moto: produto.modelo_moto,
      descricao: produto.descricao,
      localizacao: produto.localizacao,
      preco_custo: produto.preco_custo,
      preco_venda: produto.preco_venda,
      estoque_minimo: produto.estoque_minimo,
      quantidade: produto.quantidade,
      imagem: produto.imagem || '',
      criado_em: new Date(),
    }
  );
}

export async function listarProdutosPorModeloFirebase(modeloMoto) {
  const usuario = auth.currentUser;

  if (!usuario) {
    return [];
  }

  const q = query(
    collection(dbFirebase, 'produtos'),
    where('usuario_id', '==', usuario.uid),
    where('modelo_moto', '==', modeloMoto)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }));
}

export async function listarAlertasFirebase(configuracoes) {
  const usuario = auth.currentUser;

  if (!usuario) {
    return [];
  }

  const q = query(
    collection(dbFirebase, "produtos"),
    where("usuario_id", "==", usuario.uid)
  );

  const snapshot = await getDocs(q);

  const produtos = snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }));

  let alertas = [];

  produtos.forEach((produto) => {
    const quantidade = Number(produto.quantidade || 0);
    const minimo = Number(produto.estoque_minimo || 0);

    if (configuracoes.zerado && quantidade === 0) {
      alertas.push({
        tipo: "zerado",
        ...produto,
      });
    }

    if (
      configuracoes.minimo &&
      quantidade > 0 &&
      quantidade <= minimo
    ) {
      alertas.push({
        tipo: "baixo",
        ...produto,
      });
    }
  });

  return alertas;
}

export async function adicionarQuantidadeFirebase(produtoId) {
  const ref = doc(
    dbFirebase,
    'produtos',
    produtoId
  );

  await updateDoc(ref, {
    quantidade: increment(1),
  });
}

export async function removerQuantidadeFirebase(
  produtoId,
  quantidadeAtual
) {
  if (quantidadeAtual <= 0) {
    return;
  }

  const ref = doc(
    dbFirebase,
    'produtos',
    produtoId
  );

  await updateDoc(ref, {
    quantidade: increment(-1),
  });
}