import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

/**
 * Depois desse tempo sem resposta do Firebase, a tela de carregamento
 * passa a avisar que a conexão está lenta. É só um aviso: o app continua
 * aguardando e NÃO trata o usuário como deslogado.
 *
 * Por que não liberar a navegação: com sessão salva, o Firebase Auth só
 * informa o estado inicial depois de validar o usuário pela rede, o que
 * pode levar até 30 s na web e 60 s no Android/iOS (o timeout de rede do
 * próprio Firebase). Se a rede falhar, o Firebase mantém a sessão salva
 * (erro auth/network-request-failed); ele só informa "sem usuário" quando
 * não há sessão ou quando ela é inválida.
 */
const LIMITE_AVISO_DEMORA_MS = 10000;

type AuthContextType = {
  /** Usuário autenticado no Firebase, ou null se não houver sessão. */
  usuario: User | null;
  /**
   * true até o Firebase confirmar o estado inicial (com ou sem usuário).
   * Enquanto true, nenhuma rota é liberada nem redirecionada.
   */
  carregando: boolean;
  /** true se a confirmação inicial já passou de LIMITE_AVISO_DEMORA_MS. */
  demorando: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [demorando, setDemorando] = useState(false);

  useEffect(() => {
    // Variáveis locais a esta execução do efeito: uma remontagem (ex.:
    // StrictMode) cria um novo timer e uma nova inscrição, e a limpeza
    // abaixo encerra os anteriores, sem timers duplicados.
    let confirmado = false;

    const avisoDemora = setTimeout(() => {
      if (!confirmado) {
        setDemorando(true);
      }
    }, LIMITE_AVISO_DEMORA_MS);

    // Dispara uma vez quando o Firebase confirma o estado inicial e a cada
    // login/logout depois disso.
    const cancelarInscricao = onAuthStateChanged(auth, (usuarioAtual) => {
      confirmado = true;
      clearTimeout(avisoDemora);
      setUsuario(usuarioAtual);
      setDemorando(false);
      setCarregando(false);
    });

    return () => {
      clearTimeout(avisoDemora);
      cancelarInscricao();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, carregando, demorando }}>
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
