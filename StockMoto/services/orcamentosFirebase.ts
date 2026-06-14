import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc as firestoreDoc, orderBy, query, serverTimestamp } from "firebase/firestore";
import { dbFirebase } from "../firebase/firebaseConfig";

const COLLECTION = "orcamentos";

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
  const docRef = await addDoc(
    collection(dbFirebase, COLLECTION),
    {
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
  const q = query(
    collection(dbFirebase, COLLECTION),
    orderBy("criadoEm", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function buscarOrcamentoPorId(
  id: string
): Promise<Orcamento | null> {
  const docRef = firestoreDoc(
    dbFirebase,
    COLLECTION,
    id
  );

  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Orcamento),
  };
}

export async function atualizarOrcamentoFirebase(
  id: string,
  dados: any
) {
  const docRef = firestoreDoc(
    dbFirebase,
    COLLECTION,
    id
  );

  await updateDoc(docRef, dados);
}

export async function excluirOrcamentoFirebase(
  id: string
) {
  const docRef = firestoreDoc(
    dbFirebase,
    COLLECTION,
    id
  );

  await deleteDoc(docRef);
}