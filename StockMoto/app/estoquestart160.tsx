import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";

import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import {
  listarProdutosPorModeloFirebase,
  adicionarQuantidadeFirebase,
  removerQuantidadeFirebase,
} from "../firebase/produtosFirebase";

const MODELO_MOTO = "CG 160 START";

export default function EstoqueStart160() {
  const router = useRouter();

  const [pecas, setPecas] = useState<any[]>([]);
  const [busca, setBusca] = useState("");

  useFocusEffect(
    useCallback(() => {
      carregarPecas();
    }, [])
  );

  async function carregarPecas() {
    const dados = await listarProdutosPorModeloFirebase(MODELO_MOTO);
    setPecas(dados as any[]);
  }

  async function aumentar(id: string, nome: string) {
    Alert.alert("Adicionar peça", `Deseja adicionar 1 unidade de ${nome}?`, [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        onPress: async () => {
          await adicionarQuantidadeFirebase(id);
          carregarPecas();
        },
      },
    ]);
  }

  async function diminuir(id: string, quantidade: number, nome: string) {
    if (quantidade <= 0) {
      Alert.alert("Erro", "Estoque já está zerado");
      return;
    }

    Alert.alert("Remover peça", `Deseja remover 1 unidade de ${nome}?`, [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        onPress: async () => {
          await removerQuantidadeFirebase(id, quantidade);
          carregarPecas();
        },
      },
    ]);
  }

  const pecasFiltradas = pecas.filter(
    (item: any) =>
      item.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      item.codigo?.toLowerCase().includes(busca.toLowerCase())
  );

  const totalTipos = pecas.length;

  const totalUnidades = pecas.reduce(
    (total: number, item: any) => total + Number(item.quantidade || 0),
    0
  );

  const totalValor = pecas.reduce(
    (total: number, item: any) =>
      total + Number(item.preco_venda || 0) * Number(item.quantidade || 0),
    0
  );

  const totalAlertas = pecas.filter(
    (item: any) =>
      Number(item.quantidade || 0) <= Number(item.estoque_minimo || 0)
  ).length;

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

          <Text style={styles.title}>{MODELO_MOTO}</Text>

          <Text style={styles.subtitle}>Modelos 2015 - 2026</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalTipos}</Text>
            <Text style={styles.statLabel}>Tipos</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalUnidades}</Text>
            <Text style={styles.statLabel}>Unidades</Text>
          </View>

          <View style={styles.alertCard}>
            <Text style={styles.alertNumber}>{totalAlertas}</Text>
            <Text style={styles.statLabel}>Alertas</Text>
          </View>
        </View>

        <View style={styles.moneyCard}>
          <Text style={styles.moneyTitle}>Valor Total em Estoque</Text>

          <Text style={styles.moneyValue}>
            R$ {totalValor.toFixed(2)}
          </Text>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#888" />

          <TextInput
            placeholder="Buscar peça"
            placeholderTextColor="#888"
            style={styles.input}
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <Text style={styles.sectionTitle}>Peças em Estoque</Text>

        {pecasFiltradas.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma peça cadastrada</Text>
        ) : (
          pecasFiltradas.map((item: any) => {
            const baixo =
              Number(item.quantidade || 0) <= Number(item.estoque_minimo || 0);

            return (
              <View style={styles.itemCard} key={item.id}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.nome}</Text>

                  <Text style={styles.itemInfo}>Código: {item.codigo}</Text>

                  <Text style={styles.itemInfo}>Marca: {item.marca}</Text>

                  <Text style={styles.itemPrice}>
                    R$ {Number(item.preco_venda || 0).toFixed(2)}
                  </Text>

                  {baixo && (
                    <Text style={styles.alertText}>⚠ ESTOQUE BAIXO</Text>
                  )}
                </View>

                <View style={styles.rightContent}>
                  <Text
                    style={[
                      styles.stockNumber,
                      baixo && styles.stockLow,
                    ]}
                  >
                    {item.quantidade}
                  </Text>

                  <Text style={styles.stockLabel}>un.</Text>

                  <View
                    style={[
                      styles.statusBadge,
                      baixo ? styles.statusLow : styles.statusOk,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {baixo ? "BAIXO" : "OK"}
                    </Text>
                  </View>

                  <View style={styles.buttonsRow}>
                    <TouchableOpacity
                      style={styles.minusButton}
                      onPress={() =>
                        diminuir(item.id, item.quantidade, item.nome)
                      }
                    >
                      <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.plusButton}
                      onPress={() => aumentar(item.id, item.nome)}
                    >
                      <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
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

  emptyText: {
    color: "#999",
    textAlign: "center",
    marginTop: 20,
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

  itemInfo: {
    color: "#AAA",
    marginTop: 3,
    fontSize: 12,
  },

  itemPrice: {
    color: "#AAA",
    marginTop: 3,
    fontSize: 12,
  },

  alertText: {
    color: "#FF3B30",
    marginTop: 6,
    fontWeight: "700",
    fontSize: 12,
  },

  rightContent: {
    alignItems: "flex-end",
    marginLeft: 10,
  },

  stockNumber: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
  },

  stockLow: {
    color: "#FF3B30",
  },

  stockLabel: {
    color: "#AAA",
    fontSize: 12,
    marginBottom: 5,
  },

  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
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

  buttonsRow: {
    flexDirection: "row",
    marginTop: 4,
  },

  minusButton: {
    backgroundColor: "#FF3B30",
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  plusButton: {
    backgroundColor: "#00C853",
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },
});