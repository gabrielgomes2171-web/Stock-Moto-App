import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  /** true quando a verificação da sessão está demorando mais que o normal. */
  demorando?: boolean;
};

/** Exibida enquanto o Firebase confirma se existe sessão salva. */
export default function TelaCarregando({ demorando = false }: Props) {
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={demorando ? "Verificando sua sessão" : "Carregando"}
      testID="tela-carregando"
    >
      <ActivityIndicator size="large" color="#F47B20" />

      {demorando ? (
        <>
          <Text style={styles.titulo} accessibilityLiveRegion="polite">
            Verificando sua sessão...
          </Text>
          <Text style={styles.texto}>
            A conexão está demorando mais que o esperado.
          </Text>
        </>
      ) : (
        <Text style={styles.texto}>Carregando...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  titulo: {
    color: "#FFF",
    marginTop: 16,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  texto: {
    color: "#999",
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
  },
});
