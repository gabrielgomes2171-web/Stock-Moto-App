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
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect, useRouter } from "expo-router";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import {
  listarAlertasFirebase,
} from "../firebase/produtosFirebase";
import { listarOrcamentosFirebase } from "../services/orcamentosFirebase";
import { calcularValidade } from "../services/validadeOrcamento";

// Card de um orçamento que está vencendo ou já venceu
function ItemOrcamento({ item }: any) {
  const router = useRouter();
  const expirado = item.tipo === "orcamento_expirado";
  const cor = expirado ? "#FF3B3B" : "#FFC107";

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        router.push({
          pathname: "/editarorcamento",
          params: { id: item.id },
        })
      }
    >
      <View style={styles.left}>
        <View style={[styles.img, styles.iconBox]}>
          <Text style={{ fontSize: 22 }}>{expirado ? "⌛" : "📄"}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.tipoAlerta, { color: cor }]}>
            {expirado ? "⌛ ORÇAMENTO EXPIRADO" : "📄 ORÇAMENTO VENCENDO"}
          </Text>

          <Text style={styles.nome}>
            {item.cliente || "Cliente não informado"}
          </Text>

          <Text style={styles.moto}>
            🏍️ {item.moto || "-"}
          </Text>

          <Text style={[styles.moto, { color: cor }]}>
            {item.validadeInfo.texto}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={[styles.qtd, { color: "#4CAF50" }]}>
          R$ {Number(item.total || 0).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

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

  const [alertasOrcamento, setAlertasOrcamento] =
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

      // "Orçamentos Expirando" ligado em Configurações?
      if (configuracoes.orcamento) {
        const orcamentos =
          (await listarOrcamentosFirebase()) as any[];

        const comProblema = orcamentos
          .map((orcamento) => {
            const validadeInfo =
              calcularValidade(orcamento);

            return {
              ...orcamento,
              validadeInfo,
              tipo:
                validadeInfo.status === "expirado"
                  ? "orcamento_expirado"
                  : "orcamento_vencendo",
            };
          })
          .filter(
            (orcamento) =>
              orcamento.validadeInfo.status === "vencendo" ||
              orcamento.validadeInfo.status === "expirado"
          )
          // os que vencem primeiro aparecem em cima
          .sort(
            (a, b) =>
              a.validadeInfo.diasRestantes -
              b.validadeInfo.diasRestantes
          );

        setAlertasOrcamento(comProblema);
      } else {
        setAlertasOrcamento([]);
      }
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

  const listaFinal: any[] = [
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

  const orcamentosVencendo =
    alertasOrcamento.filter(
      (item: any) =>
        item.tipo === "orcamento_vencendo"
    );

  const orcamentosExpirados =
    alertasOrcamento.filter(
      (item: any) =>
        item.tipo === "orcamento_expirado"
    );

  if (orcamentosVencendo.length > 0) {
    listaFinal.push(
      {
        tipo: "titulo",
        titulo: `📄 Orçamentos Vencendo (${orcamentosVencendo.length})`,
        cor: "#FFC107",
      },
      ...orcamentosVencendo
    );
  }

  if (orcamentosExpirados.length > 0) {
    listaFinal.push(
      {
        tipo: "titulo",
        titulo: `⌛ Orçamentos Expirados (${orcamentosExpirados.length})`,
        cor: "#FF3B3B",
      },
      ...orcamentosExpirados
    );
  }

  const totalAlertas =
    alertas.length + alertasOrcamento.length;

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
          Produtos e orçamentos que precisam de atenção
        </Text>

        {totalAlertas === 0 ? (
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
              dentro do estoque ideal
              e nenhum orçamento está vencendo.
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
                ? `${item.tipo}-${item.id}`
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

              if (
                item.tipo === "orcamento_vencendo" ||
                item.tipo === "orcamento_expirado"
              ) {
                return (
                  <ItemOrcamento item={item} />
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

  iconBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3A3A3A",
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