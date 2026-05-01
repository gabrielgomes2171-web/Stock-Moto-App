import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Footer() {
  const router = useRouter();

  return (
    <View style={styles.footer}>

      <TouchableOpacity onPress={() => router.push("/estoque")}>
        <MaterialIcons name="inventory" size={24} color="#555" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/cadastrar")}>
        <Ionicons name="add-circle-outline" size={26} color="#555" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/inicial")}>
        <Ionicons name="grid" size={24} color="#555" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/orcamentos")}>
        <Feather name="dollar-sign" size={22} color="#555" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/alertas")}>
        <Ionicons name="warning-outline" size={24} color="#555" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 70,
  backgroundColor: "#fff",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
},

  activeTab: {
    backgroundColor: "#fff3e9",
    padding: 12,
    borderRadius: 10,
  },
});