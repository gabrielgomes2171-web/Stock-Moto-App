import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc as firestoreDoc, query, where, serverTimestamp } from "firebase/firestore";
import { auth, dbFirebase } from "../firebase/firebaseConfig";

const COLLECTION = "orcamentos";

// Cada orçamento guarda o "usuario_id" de quem criou.
// Assim cada conta só vê, edita e exclui os próprios orçamentos.
async function usuarioLogado() {
  // Ao abrir/recarregar o app, espera o Firebase recuperar a sessão
  await auth.authStateReady();
  const usuario = auth.currentUser;

  if (!usuario) {
    throw new Error("Usuário não logado");
  }

  return usuario.uid;
}

export interface Orcamento {
  id?: string;
  cliente: string;
  telefone: string;
  moto: string;
  validade: string;
  observacoes: string;
  subtotal?: number;
  desconto?: number;
  total?: number;
}

export async function criarOrcamentoFirebase(
  cliente: string,
  telefone: string,
  moto: string,
  validade: string,
  observacoes: string,
  subtotal: number,
  desconto: number,
  total: number
) {
  const usuario_id = await usuarioLogado();

  const docRef = await addDoc(
    collection(dbFirebase, COLLECTION),
    {
      usuario_id,
      cliente,
      telefone,
      moto,
      validade,
      observacoes,
      subtotal,
      desconto,
      total,
      criadoEm: serverTimestamp(),
    }
  );

  return docRef.id;
}

export async function listarOrcamentosFirebase() {
  await auth.authStateReady();
  const usuario = auth.currentUser;

  if (!usuario) {
    return [];
  }

  const q = query(
    collection(dbFirebase, COLLECTION),
    where("usuario_id", "==", usuario.uid)
  );

  const snapshot = await getDocs(q);

  const lista = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as any[];

  // Mais recentes primeiro (ordenado aqui para não precisar de índice no Firebase)
  return lista.sort(
    (a, b) =>
      (b.criadoEm?.toMillis?.() ?? 0) - (a.criadoEm?.toMillis?.() ?? 0)
  );
}

async function buscarDoUsuario(id: string) {
  const uid = await usuarioLogado();
  const docRef = firestoreDoc(dbFirebase, COLLECTION, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists() || snapshot.data().usuario_id !== uid) {
    return null;
  }

  return { docRef, snapshot };
}

export async function buscarOrcamentoPorId(
  id: string
): Promise<Orcamento | null> {
  const encontrado = await buscarDoUsuario(id);

  if (!encontrado) {
    return null;
  }

  const { snapshot } = encontrado;

  return {
    id: snapshot.id,
    ...(snapshot.data() as Orcamento),
  };
}

export async function atualizarOrcamentoFirebase(
  id: string,
  dados: any
) {
  const encontrado = await buscarDoUsuario(id);

  if (!encontrado) {
    throw new Error("Orçamento não encontrado");
  }

  // Não deixa trocar o dono do orçamento
  const { usuario_id, ...resto } = dados || {};

  await updateDoc(encontrado.docRef, resto);
}

export async function excluirOrcamentoFirebase(
  id: string
) {
  const encontrado = await buscarDoUsuario(id);

  if (!encontrado) {
    throw new Error("Orçamento não encontrado");
  }

  await deleteDoc(encontrado.docRef);
}