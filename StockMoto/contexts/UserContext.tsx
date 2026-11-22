import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "./AuthContext";

/**
 * Perfil exibido no app (nome e foto), salvo localmente no aparelho.
 *
 * O perfil pertence ao usuário autenticado: as chaves do AsyncStorage
 * incluem o uid, e o estado em memória é descartado sempre que o usuário
 * muda (logout, login ou troca de conta). Assim uma conta nunca vê o nome
 * ou a foto de outra. Os dados salvos de cada usuário não são apagados no
 * logout: voltam quando o mesmo usuário entrar de novo.
 *
 * As chaves antigas "@nome" e "@imagem" (anteriores a esta versão) eram
 * compartilhadas por todas as contas do aparelho e não têm dono
 * identificável; por isso são ignoradas (não são lidas nem apagadas).
 */
const NOME_PADRAO = "Moto Stock";

const chavePerfil = (uid: string, campo: "nome" | "imagem") => `@perfil:${uid}:${campo}`;

type UserContextType = {
  nome: string;
  setNome: (nome: string) => void;

  imagem: string | null;
  setImagem: (imagem: string | null) => void;

  /** Salva nome e foto do usuário autenticado. */
  salvarPerfil: () => Promise<void>;
};

type Perfil = {
  /** Dono deste estado; null quando não há usuário autenticado. */
  uid: string | null;
  nome: string;
  imagem: string | null;
};

const perfilVazio = (uid: string | null): Perfil => ({ uid, nome: NOME_PADRAO, imagem: null });

const UserContext = createContext({} as UserContextType);

export function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario } = useAuth();
  const uid = usuario?.uid ?? null;

  const [estado, setEstado] = useState<Perfil>(() => perfilVazio(uid));

  // Se o estado guardado é de outro usuário, ele é ignorado já neste render
  // (nem por um instante a nova conta vê o perfil da anterior).
  const perfil = estado.uid === uid ? estado : perfilVazio(uid);

  useEffect(() => {
    if (!uid) {
      return;
    }

    let ativo = true;

    async function carregarPerfil(dono: string) {
      try {
        const [nomeSalvo, imagemSalva] = await Promise.all([
          AsyncStorage.getItem(chavePerfil(dono, "nome")),
          AsyncStorage.getItem(chavePerfil(dono, "imagem")),
        ]);

        // Descarta o resultado se o usuário mudou durante a leitura.
        if (!ativo) return;

        setEstado({ uid: dono, nome: nomeSalvo || NOME_PADRAO, imagem: imagemSalva || null });
      } catch (error) {
        console.log("Erro ao carregar perfil:", error);
      }
    }

    carregarPerfil(uid);

    return () => {
      ativo = false;
    };
  }, [uid]);

  const setNome = useCallback(
    (nome: string) => setEstado((atual) => ({ ...(atual.uid === uid ? atual : perfilVazio(uid)), nome })),
    [uid]
  );

  const setImagem = useCallback(
    (imagem: string | null) => setEstado((atual) => ({ ...(atual.uid === uid ? atual : perfilVazio(uid)), imagem })),
    [uid]
  );

  const salvarPerfil = useCallback(async () => {
    if (!uid) {
      throw new Error("Nenhum usuário autenticado para salvar o perfil");
    }

    await AsyncStorage.setItem(chavePerfil(uid, "nome"), perfil.nome);

    if (perfil.imagem) {
      await AsyncStorage.setItem(chavePerfil(uid, "imagem"), perfil.imagem);
    }
  }, [uid, perfil.nome, perfil.imagem]);

  return (
    <UserContext.Provider
      value={{
        nome: perfil.nome,
        setNome,
        imagem: perfil.imagem,
        setImagem,
        salvarPerfil,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
