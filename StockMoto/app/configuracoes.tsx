import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import Footer from "../components/Footer";

export default function Configuracoes() {
  const [minimo, setMinimo] = useState(true);
  const [zerado, setZerado] = useState(true);
  const [orcamento, setOrcamento] = useState(false);
  const router = useRouter();

  return (
    
    <View style={styles.container}>
       <Footer />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          
          <TouchableOpacity
            style={styles.profile}
            onPress={() => router.push("/perfil")}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
            </View>
            <Text style={styles.brand}>Moto Stock</Text>
          </TouchableOpacity>

      </View>

      <Text style={styles.title}>Configurações</Text>
    </View>

      <Text style={styles.subtitle}>
        Personalize o sistema conforme a sua necessidade
      </Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="notifications-outline" size={18} color="#FFA94D" />
          <Text style={styles.cardTitle}> Notificações e Alertas</Text>
        </View>

        <View style={styles.item}>
          <View>
            <Text style={styles.itemTitle}>Estoque mínimo atingido</Text>
            <Text style={styles.itemDesc}>
              Alertar quando a quantidade estiver baixa
            </Text>
          </View>
          <Switch
            value={minimo}
            onValueChange={setMinimo}
            thumbColor="#fff"
            trackColor={{ false: "#555", true: "#FF8C00" }}
          />
        </View>

        <View style={styles.item}>
          <View>
            <Text style={styles.itemTitle}>Estoque Zerado</Text>
            <Text style={styles.itemDesc}>
              Alertar quando uma peça estiver esgotada
            </Text>
          </View>
          <Switch
            value={zerado}
            onValueChange={setZerado}
            thumbColor="#fff"
            trackColor={{ false: "#555", true: "#FF8C00" }}
          />
        </View>

        <View style={styles.item}>
          <View>
            <Text style={styles.itemTitle}>Orçamentos Expirando</Text>
            <Text style={styles.itemDesc}>
              Alertar sobre orçamentos próximos do vencimento
            </Text>
          </View>
          <Switch
            value={orcamento}
            onValueChange={setOrcamento}
            thumbColor="#fff"
            trackColor={{ false: "#555", true: "#FF8C00" }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    padding: 0,
  
  },

  header: {
    backgroundColor: "#F47B20",
    padding: 20,
    marginBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerTop: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

  profile: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },

  brand: {
    color: "#fff",
    fontWeight: "bold",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },

  subtitle: {
    color: "#ccc",
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 20,
    marginTop: 40,
    marginBottom: 80,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },

  itemTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  itemDesc: {
    color: "#aaa",
    fontSize: 11,
    marginTop: 2,
  },
});

