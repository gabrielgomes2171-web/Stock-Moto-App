import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from "expo-router";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import {
  listarAlertasFirebase,
} from "../firebase/produtosFirebase";

function ItemAlerta({ item }: any) {
  const esgotado = item.tipo === "zerado";

  const imagemProduto = item.imagem
    ? { uri: item.imagem }
    : require("../assets/images/zerado.png");

  return (
    <View style={styles.item}>
      <View style={styles.left}>
        <Image
          source={imagemProduto}
          style={styles.img}
        />

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.tipoAlerta,
              {
                color: esgotado
                  ? "#FF3B3B"
                  : "#FFC107",
              },
            ]}
          >
            {esgotado
              ? "🚨 ESTOQUE ZERADO"
              : "⚠ ESTOQUE BAIXO"}
          </Text>

          <Text style={styles.nome}>
            {item.nome}
          </Text>

          <View style={styles.row}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.categoria || "PEÇA"}
              </Text>
            </View>

            <Text style={styles.codigo}>
              {item.codigo}
            </Text>
          </View>

          <Text style={styles.moto}>
            {item.modelo_moto}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text
          style={[
            styles.qtd,
            {
              color: esgotado
                ? "#FF3B3B"
                : "#FFC107",
            },
          ]}
        >
          {item.quantidade} Uni.
        </Text>

        <Text style={styles.min}>
          Mín: {item.estoque_minimo}
        </Text>
      </View>
    </View>
  );
}

export default function Alertas() {
  const [alertas, setAlertas] =
    useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      carregarAlertas();
    }, [])
  );

  async function carregarAlertas() {
    try {
      const configSalva =
        await AsyncStorage.getItem(
          "configuracoes"
        );

      const configuracoes = configSalva
        ? JSON.parse(configSalva)
        : {
            minimo: true,
            zerado: true,
            orcamento: false,
          };

      const lista =
        await listarAlertasFirebase(
          configuracoes
        );

      setAlertas(lista as any[]);
    } catch (error) {
      console.log(error);
    }
  }

  const esgotados =
    alertas.filter(
      (item: any) =>
        item.tipo === "zerado"
    );

  const estoqueBaixo =
    alertas.filter(
      (item: any) =>
        item.tipo === "baixo"
    );

  const listaFinal = [
    {
      tipo: "titulo",
      titulo: `🚨 Esgotados (${esgotados.length})`,
      cor: "#FF3B3B",
    },

    ...esgotados,

    {
      tipo: "titulo",
      titulo: `⚠ Estoque Baixo (${estoqueBaixo.length})`,
      cor: "#FFC107",
    },

    ...estoqueBaixo,
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Alertas"
        showSettings
      />

      <View style={styles.content}>
        <Text style={styles.titulo}>
          Central de Alertas
        </Text>

        <Text style={styles.subtitulo}>
          Produtos que precisam de atenção
        </Text>

        {alertas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>
              ✅
            </Text>

            <Text style={styles.vazio}>
              Nenhum alerta encontrado
            </Text>

            <Text
              style={styles.vazioDescricao}
            >
              Todos os produtos estão
              dentro do estoque ideal.
            </Text>
          </View>
        ) : (
          <FlatList
            data={listaFinal}
            showsVerticalScrollIndicator={
              false
            }
            keyExtractor={(
              item: any,
              index
            ) =>
              item.id
                ? item.id.toString()
                : `titulo-${index}`
            }
            renderItem={({
              item,
            }: any) => {
              if (
                item.tipo === "titulo"
              ) {
                return (
                  <Text
                    style={[
                      styles.sectionLabel,
                      {
                        color: item.cor,
                      },
                    ]}
                  >
                    {item.titulo}
                  </Text>
                );
              }

              return (
                <ItemAlerta item={item} />
              );
            }}
          />
        )}
      </View>

      <Footer active="alertas" />
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
    paddingBottom: 100,
  },

  titulo: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#AAA",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
  },

  sectionLabel: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 12,
    marginBottom: 10,
  },

  item: {
    backgroundColor: "#2A2A2A",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  img: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#444",
    marginRight: 10,
  },

  tipoAlerta: {
    fontWeight: "bold",
    fontSize: 11,
    marginBottom: 4,
  },

  nome: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  badge: {
    backgroundColor: "#FF8C00",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },

  badgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
  },

  codigo: {
    color: "#BBB",
    fontSize: 12,
  },

  moto: {
    color: "#999",
    fontSize: 11,
    marginTop: 4,
  },

  right: {
    alignItems: "flex-end",
  },

  qtd: {
    fontWeight: "bold",
    fontSize: 15,
  },

  min: {
    color: "#BBB",
    fontSize: 11,
    marginTop: 2,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },

  emptyEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },

  vazio: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  vazioDescricao: {
    color: "#999",
    textAlign: "center",
    marginTop: 5,
  },
});