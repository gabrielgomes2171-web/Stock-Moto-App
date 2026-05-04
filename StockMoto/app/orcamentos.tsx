import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Orcamentos() {
    const router = useRouter();
    return (

    <View style={styles.container}>
      <Header title="Orçamento" showSettings />
      
      <View style={styles.content}>
        <Text style={styles.sub}>0 orçamento(s) cadastrado(s)</Text>

        <View style={styles.search}>
            <Ionicons name="search" size={16} color="#999" />
            <TextInput
                placeholder="Buscar por cliente, número, moto..."
                placeholderTextColor="#999"
                style={styles.input}
            />
        </View>

        <View style={styles.emptyBox}>
            <Ionicons name="document-outline" size={40} color="#aaa" />
            <Text style={styles.emptyText}>
                Nenhum orçamento encontrado
            </Text>
            <Text style={styles.link}>Crie seu primeiro orçamento</Text>
        </View>

        <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push("/criarorcamentos")}
        >
            <Text style={styles.buttonText}>+ Novo Orçamento</Text>
        </TouchableOpacity>
       </View>
    
       <Footer active="orcamentos" />
     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },

  content: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },

  sub: {
    color: "#ccc",
    fontSize: 13,
    marginBottom: 10,
  },

  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2b2b2b",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 20,
  },

  input: {
    color: "#fff",
    marginLeft: 8,
    flex: 1,
    fontSize: 13,
  },

  emptyBox: {
    backgroundColor: "#2b2b2b",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  emptyText: {
    color: "#ccc",
    marginTop: 10,
    fontSize: 13,
  },

  link: {
    color: "#F47B20",
    fontSize: 12,
    marginTop: 5,
  },

  button: {
    backgroundColor: "#F47B20",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});