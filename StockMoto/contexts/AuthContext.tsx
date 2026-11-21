import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

/**
 * Limite de segurança: se o Firebase não responder sobre a sessão salva
 * nesse tempo, libera o app como "sem sessão" para não ficar preso na
 * tela de carregamento. Se a sessão chegar depois, o estado é atualizado.
 */
const LIMITE_CARREGAMENTO_MS = 10000;

type AuthContextType = {
  /** Usuário autenticado no Firebase, ou null se não houver sessão. */
  usuario: User | null;
  /** true até o Firebase restaurar (ou não) a sessão persistida. */
  carregando: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const limite = setTimeout(() => {
      console.warn(
        "AuthContext: sessão não restaurada a tempo; seguindo sem usuário."
      );
      setCarregando(false);
    }, LIMITE_CARREGAMENTO_MS);

    // Dispara uma vez ao restaurar a sessão salva e a cada login/logout.
    const cancelarInscricao = onAuthStateChanged(auth, (usuarioAtual) => {
      clearTimeout(limite);
      setUsuario(usuarioAtual);
      setCarregando(false);
    });

    return () => {
      clearTimeout(limite);
      cancelarInscricao();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return contexto;
}
