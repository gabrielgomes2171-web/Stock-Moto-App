import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

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
    // Dispara uma vez ao restaurar a sessão salva e a cada login/logout.
    const cancelarInscricao = onAuthStateChanged(auth, (usuarioAtual) => {
      setUsuario(usuarioAtual);
      setCarregando(false);
    });

    return cancelarInscricao;
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
