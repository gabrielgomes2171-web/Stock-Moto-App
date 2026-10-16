import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router/react-navigation";
import { listarOrcamentosFirebase, excluirOrcamentoFirebase } from "../services/orcamentosFirebase";

export default function Orcamentos() {
  const router = useRouter();

  const [orcamentos, setOrcamentos] = useState<any[]>([]);
  const [busca, setBusca] = useState("");

  async function carregarOrcamentos() {
    try {
      const lista = await listarOrcamentosFirebase();
      setOrcamentos(lista);
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarOrcamentos();
    }, [])
  );

  async function excluirOrcamento(id: string) {
    Alert.alert(
      "Excluir orçamento",
      "Deseja realmente excluir este orçamento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await excluirOrcamentoFirebase(id);
              carregarOrcamentos();
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  }

  const orcamentosFiltrados = orcamentos.filter(
    (item) =>
      item.cliente
        ?.toLowerCase()
        .includes(busca.toLowerCase()) ||
      item.moto
        ?.toLowerCase()
        .includes(busca.toLowerCase())
  );

  function renderItem({ item }: any) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons
            name="document-text"
            size={22}
            color="#F57C00"
          />

          <Text style={styles.cliente}>
            {item.cliente}
          </Text>
        </View>

        <Text style={styles.moto}>
          🏍️ {item.moto}
        </Text>

        <Text style={styles.info}>
          📞 {item.telefone || "Não informado"}
        </Text>

        <Text style={styles.info}>
          📅 Validade: {item.validade || "0"} dias
        </Text>

        <View style={styles.divider} />

        <Text style={styles.total}>
          R$ {Number(item.total || 0).toFixed(2)}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              router.push({
                pathname: "/editarorcamento",
                params: {
                  id: item.id,
                },
              })
            }
          >
            <Ionicons
              name="create-outline"
              size={20}
              color="#FFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              excluirOrcamento(item.id)
            }
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Orçamentos"
        showSettings
      />

      <View style={styles.content}>
        <Text style={styles.sub}>
          {orcamentos.length} orçamento(s)
          cadastrado(s)
        </Text>

        <View style={styles.search}>
          <Ionicons
            name="search"
            size={18}
            color="#999"
          />

          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar cliente ou moto..."
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>

        {orcamentosFiltrados.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons
              name="document-outline"
              size={50}
              color="#777"
            />

            <Text style={styles.emptyText}>
              Nenhum orçamento encontrado
            </Text>

            <Text style={styles.link}>
              Crie seu primeiro orçamento
            </Text>
          </View>
        ) : (
          <FlatList
            data={orcamentosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
          />
        )}
      </View>

      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push("/criarorcamento")
          }
        >
          <Text style={styles.buttonText}>
            + Novo Orçamento
          </Text>
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
  },

  sub: {
    color: "#CCC",
    fontSize: 13,
    marginBottom: 10,
  },

  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2B2B2B",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    color: "#FFF",
    marginLeft: 8,
  },

  emptyBox: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: "#CCC",
    marginTop: 10,
  },

  link: {
    color: "#F57C00",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  cliente: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  moto: {
    color: "#DDD",
    marginBottom: 4,
  },

  info: {
    color: "#AAA",
    marginBottom: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 10,
  },

  total: {
    color: "#4CAF50",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "right",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },

  editButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },

  deleteButton: {
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 8,
  },

  fixedButtonContainer: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
  },

  button: {
    backgroundColor: "#F57C00",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});