
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

// =====================================================
// CADASTRAR PRODUTO
// =====================================================

export async function cadastrarProdutoFirebase(produto) {
  // Simulação exclusiva dos testes Playwright
  if (globalThis.__STOCKMOTO_E2E__ === true) {
    console.log('CADASTRO SIMULADO:', produto);

    return {
      id: 'produto-teste-stockmoto',
      ...produto,
    };
  }

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

// =====================================================
// LISTAR PRODUTOS POR MODELO
// =====================================================

export async function listarProdutosPorModeloFirebase(modeloMoto) {
  // Simulação exclusiva dos testes Playwright
  if (globalThis.__STOCKMOTO_E2E__ === true) {
    if (modeloMoto === 'CG 160 FAN') {
      return [
        {
          id: 'peca-teste-001',
          nome: 'Pastilha de Freio',
          codigo: 'PF-001',
          marca: 'Honda',
          modelo_moto: 'CG 160 FAN',
          preco_venda: 25.90,
          quantidade: 10,
          estoque_minimo: 2,
        },
        {
          id: 'peca-teste-002',
          nome: 'Filtro de Óleo',
          codigo: 'FO-002',
          marca: 'Honda',
          modelo_moto: 'CG 160 FAN',
          preco_venda: 18.50,
          quantidade: 5,
          estoque_minimo: 2,
        },
      ];
    }

    return [];
  }

  // Consulta normal ao Firebase
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

// =====================================================
// LISTAR ALERTAS
// =====================================================

export async function listarAlertasFirebase(configuracoes) {
  const usuario = auth.currentUser;

  if (!usuario) {
    return [];
  }

  const q = query(
    collection(dbFirebase, 'produtos'),
    where('usuario_id', '==', usuario.uid)
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
        tipo: 'zerado',
        ...produto,
      });
    }

    if (
      configuracoes.minimo &&
      quantidade > 0 &&
      quantidade <= minimo
    ) {
      alertas.push({
        tipo: 'baixo',
        ...produto,
      });
    }
  });

  return alertas;
}

// =====================================================
// ADICIONAR QUANTIDADE
// =====================================================

export async function adicionarQuantidadeFirebase(produtoId) {
  // Não altera o Firebase durante os testes
  if (globalThis.__STOCKMOTO_E2E__ === true) {
    console.log('ADIÇÃO SIMULADA:', produtoId);
    return;
  }

  const ref = doc(
    dbFirebase,
    'produtos',
    produtoId
  );

  await updateDoc(ref, {
    quantidade: increment(1),
  });
}

// =====================================================
// REMOVER QUANTIDADE
// =====================================================

export async function removerQuantidadeFirebase(
  produtoId,
  quantidadeAtual
) {
  if (quantidadeAtual <= 0) {
    return;
  }

  // Não altera o Firebase durante os testes
  if (globalThis.__STOCKMOTO_E2E__ === true) {
    console.log('REMOÇÃO SIMULADA:', produtoId);
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
