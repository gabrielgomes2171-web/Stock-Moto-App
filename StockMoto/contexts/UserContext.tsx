import React, { createContext, useContext, useState } from "react";

type UserContextType = {
  nome: string;
  setNome: (nome: string) => void;

  imagem: string | null;
  setImagem: (imagem: string | null) => void;
};

const UserContext = createContext({} as UserContextType);

export function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [nome, setNome] = useState("Moto Stock");
  const [imagem, setImagem] = useState<string | null>(null);

  return (
    <UserContext.Provider
      value={{
        nome,
        setNome,
        imagem,
        setImagem,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}