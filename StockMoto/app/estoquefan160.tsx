import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const pecas = [
  {
    nome: "Óleo Motul 10W30",
    valor: "R$ 60,00",
    estoque: "10 Un",
    status: "OK",
  },
  {
    nome: "Amortecedor (DA)",
    valor: "R$ 200,00",
    estoque: "2 Un",
    status: "OK",
  },
];

export default function EstoqueFan160() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Estoque Honda" showSettings />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/estoquehonda")}
        >
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.heroCard}>

          <Image
            source={require("@/assets/images/honda.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>CG 160 FAN</Text>

          <Text style={styles.subtitle}>
            Modelos 2015 - 2026
          </Text>

        </View>

        <View style={styles.statsContainer}>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Tipos</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Unidades</Text>
          </View>

          <View style={styles.alertCard}>
            <Text style={styles.alertNumber}>0</Text>
            <Text style={styles.statLabel}>Alertas</Text>
          </View>

        </View>

        <View style={styles.moneyCard}>
          <Text style={styles.moneyTitle}>Valor Total em Estoque</Text>

          <Text style={styles.moneyValue}>
            R$ 1.000,00
          </Text>
        </View>

        <View style={styles.searchBox}>

          <Ionicons
            name="search"
            size={18}
            color="#888"
          />

          <TextInput
            placeholder="Buscar peça"
            placeholderTextColor="#888"
            style={styles.input}
          />

        </View>

        <Text style={styles.sectionTitle}>
          Peças em Estoque
        </Text>

        {pecas.map((item, index) => (

          <View style={styles.itemCard} key={index}>

            <View>
              <Text style={styles.itemName}>
                {item.nome}
              </Text>

              <Text style={styles.itemPrice}>
                {item.valor}
              </Text>
            </View>

            <View style={styles.rightContent}>

              <Text style={styles.stockText}>
                {item.estoque}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  item.status === "OK"
                    ? styles.statusOk
                    : styles.statusLow,
                ]}
              >
                <Text style={styles.statusText}>
                  {item.status}
                </Text>
              </View>

            </View>

          </View>

        ))}

      </ScrollView>

      <Footer active="estoque" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },

  content: {
    padding: 14,
    paddingBottom: 90,
  },

  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "#F4882F",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  heroCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
  },

  logo: {
    width: 90,
    height: 50,
    marginBottom: 10,
    borderRadius: 5,
  },

  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    color: "#AAA",
    marginTop: 4,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  statCard: {
    width: "30%",
    backgroundColor: "#2F2F2F",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },

  alertCard: {
    width: "30%",
    backgroundColor: "#3B2D1E",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },

  statNumber: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
  },

  alertNumber: {
    color: "#FFB300",
    fontSize: 22,
    fontWeight: "700",
  },

  statLabel: {
    color: "#AAA",
    fontSize: 12,
    marginTop: 5,
  },

  moneyCard: {
    backgroundColor: "#F4882F",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },

  moneyTitle: {
    color: "#FFF",
    fontSize: 13,
  },

  moneyValue: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 6,
  },

  searchBox: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    color: "#FFF",
    marginLeft: 8,
  },

  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  itemCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemName: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },

  itemPrice: {
    color: "#AAA",
    marginTop: 3,
    fontSize: 12,
  },

  rightContent: {
    alignItems: "flex-end",
  },

  stockText: {
    color: "#FFF",
    fontWeight: "700",
    marginBottom: 5,
  },

  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  statusOk: {
    backgroundColor: "#4CAF50",
  },

  statusLow: {
    backgroundColor: "#FF9800",
  },

  statusText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
});