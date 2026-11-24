import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";
import {
  buscarPerfilFirebase,
  salvarPerfilFirebase,
} from "../firebase/usuariosFirebase";

/*
  Guarda o nome e a foto do usuário para todas as telas.
  1) Ao abrir o app, carrega o que está salvo no celular (aparece na hora).
  2) Depois busca o perfil daquela conta no Firebase (coleção "perfis").
*/

const NOME_PADRAO = "Moto Stock";

type UserContextType = {
  nome: string;
  setNome: (nome: string) => void;
  imagem: string | null;
  setImagem: (imagem: string | null) => void;
  email: string;
  salvarPerfil: () => Promise<void>;
};

const UserContext = createContext({} as UserContextType);

// Chaves do celular separadas por conta. Ex: "@nome:abc123"
function chaves(uid: string) {
  return { nome: `@nome:${uid}`, imagem: `@imagem:${uid}` };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [nome, setNome] = useState(NOME_PADRAO);
  const [imagem, setImagem] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    // Roda quando alguém entra ou sai da conta (e ao abrir o app já logado)
    const pararDeOuvir = onAuthStateChanged(auth, async (usuario) => {
      if (!usuario) {
        setUid(null);
        setEmail("");
        setNome(NOME_PADRAO);
        setImagem(null);
        return;
      }

      setUid(usuario.uid);
      setEmail(usuario.email || "");

      // 1) O que está salvo no celular
      try {
        const k = chaves(usuario.uid);
        const [nomeLocal, imagemLocal] = await Promise.all([
          AsyncStorage.getItem(k.nome),
          AsyncStorage.getItem(k.imagem),
        ]);
        if (nomeLocal) setNome(nomeLocal);
        if (imagemLocal) setImagem(imagemLocal);
      } catch (error) {
        console.log("Erro ao ler perfil do celular:", error);
      }

      // 2) O que está salvo no Firebase
      try {
        const perfil: any = await buscarPerfilFirebase(usuario.uid);

        if (perfil) {
          setNome(perfil.nome || NOME_PADRAO);
          setImagem(perfil.imagem || null);

          const k = chaves(usuario.uid);
          await AsyncStorage.setItem(k.nome, perfil.nome || NOME_PADRAO);
          if (perfil.imagem) {
            await AsyncStorage.setItem(k.imagem, perfil.imagem);
          } else {
            await AsyncStorage.removeItem(k.imagem);
          }
        }
      } catch (error) {
        console.log("Erro ao buscar perfil no Firebase:", error);
      }
    });

    return pararDeOuvir;
  }, []);

  async function salvarPerfil() {
    if (!uid) {
      throw new Error("Usuário não logado");
    }

    const nomeFinal = nome.trim() || NOME_PADRAO;
    const k = chaves(uid);

    await AsyncStorage.setItem(k.nome, nomeFinal);
    if (imagem) {
      await AsyncStorage.setItem(k.imagem, imagem);
    } else {
      await AsyncStorage.removeItem(k.imagem);
    }

    await salvarPerfilFirebase(uid, {
      nome: nomeFinal,
      imagem: imagem || "",
    });

    setNome(nomeFinal);
  }

  return (
    <UserContext.Provider
      value={{ nome, setNome, imagem, setImagem, email, salvarPerfil }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}