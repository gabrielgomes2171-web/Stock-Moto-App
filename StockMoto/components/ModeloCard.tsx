import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Card de um modelo de moto adicionado pelo usuário.
// Abre a lista de peças daquele modelo.
export default function ModeloCard({ modelo }: { modelo: any }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/itensestoque",
          params: {
            tipo: "modelo",
            nome: modelo.nome,
            marca: modelo.marca,
            imagem: modelo.imagem || "",
          },
        })
      }
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{modelo.nome}</Text>
      </View>

      {modelo.imagem ? (
        <Image source={{ uri: modelo.imagem }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Ionicons name="bicycle-outline" size={40} color="#BBB" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 40,
    padding: 20,
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: -8,
    left: -8,
    backgroundColor: "#FF7A00",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    zIndex: 1,
  },

  badgeText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },

  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    marginTop: 10,
  },

  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
});
