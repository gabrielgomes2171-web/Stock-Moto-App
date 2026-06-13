import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Configuracoes {
  minimo: boolean;
  zerado: boolean;
  orcamento: boolean;
}

export const obterConfiguracoes = async (): Promise<Configuracoes> => {
  try {
    const config = await AsyncStorage.getItem("configuracoes");

    if (config) {
      return JSON.parse(config);
    }

    return {
      minimo: true,
      zerado: true,
      orcamento: false,
    };
  } catch {
    return {
      minimo: true,
      zerado: true,
      orcamento: false,
    };
  }
};

export const salvarConfiguracoes = async (
  configuracoes: Configuracoes
) => {
  await AsyncStorage.setItem(
    "configuracoes",
    JSON.stringify(configuracoes)
  );
};