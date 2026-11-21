import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

/** Exibida enquanto o Firebase restaura (ou não) a sessão salva. */
export default function TelaCarregando() {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel="Carregando">
      <ActivityIndicator size="large" color="#F47B20" />
      <Text style={styles.texto}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    color: "#999",
    marginTop: 12,
    fontSize: 14,
  },
});
