import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  ImageSourcePropType,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InfoPeca from "@/components/InfoPeca";
import {
  listarTodosProdutosFirebase,
  adicionarQuantidadeFirebase,
  removerQuantidadeFirebase,
} from "../firebase/produtosFirebase";

/*
  Tela de estoque de um acessório (Capacetes, Baú...), ligada ao Firebase.

  Uma peça aparece aqui quando o campo "Categoria" dela, na tela Cadastrar,
  é um dos nomes de "categorias". Ex: para Capacetes vale "Capacete" ou "CAPACETES".
  Maiúsculas, acentos e espaços não importam.
*/

type Props = {
  tituloHeader: string;               // texto do Header. Ex: "Capacetes"
  titulo: string;                     // texto grande do card. Ex: "CAPACETES"
  imagem: ImageSourcePropType;        // imagem do card
  categorias: string[];               // nomes de Categoria aceitos
  categoriaCadastro: string;          // Categoria já preenchida ao cadastrar
  textoBotaoCadastro: string;         // Ex: "Cadastrar capacete"
};

// "Baú " -> "bau"  |  "CAPACETES" -> "capacetes"
function compacto(texto: string) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// 1234.5 -> "R$ 1.234,50"
function formatarReais(valor: number) {
  const [inteiro, centavos] = valor.toFixed(2).split(".");
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${centavos}`;
}

export default function EstoqueAcessorio({
  tituloHeader,
  titulo,
  imagem,
  categorias,
  categoriaCadastro,
  textoBotaoCadastro,
}: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [produtos, setProdutos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  const categoriasAceitas = categorias.map(compacto);

  async function carregar() {
    try {
      const todos = (await listarTodosProdutosFirebase()) as any[];
      const doAcessorio = todos
        .filter((p) => categoriasAceitas.includes(compacto(p.categoria)))
        .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
      setProdutos(doAcessorio);
    } catch (error) {
      console.log(error);
    } finally {
      setCarregando(false);
    }
  }

  // Recarrega sempre que a tela aparece (ex: depois de cadastrar)
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  // Muda a quantidade na tela na hora e depois salva no Firebase.
  // Se der erro, recarrega do banco para voltar ao valor certo.
  async function alterarQuantidade(produto: any, delta: 1 | -1) {
    const atual = Number(produto.quantidade || 0);
    if (delta === -1 && atual <= 0) return;

    setProdutos((lista) =>
      lista.map((p) =>
        p.id === produto.id ? { ...p, quantidade: atual + delta } : p
      )
    );

    try {
      if (delta === 1) {
        await adicionarQuantidadeFirebase(produto.id);
      } else {
        await removerQuantidadeFirebase(produto.id, atual);
      }
    } catch (error) {
      console.log(error);
      carregar();
    }
  }

  function statusDo(produto: any) {
    const quantidade = Number(produto.quantidade || 0);
    const minimo = Number(produto.estoque_minimo || 0);
    if (quantidade === 0) return { texto: "ZERADO", estilo: styles.statusZerado };
    if (quantidade <= minimo) return { texto: "BAIXO", estilo: styles.statusLow };
    return { texto: "OK", estilo: styles.statusOk };
  }

  // Números do topo, calculados com os dados do banco
  const tipos = produtos.length;
  const unidades = produtos.reduce((soma, p) => soma + Number(p.quantidade || 0), 0);
  const alertas = produtos.filter(
    (p) => Number(p.quantidade || 0) <= Number(p.estoque_minimo || 0)
  ).length;
  const valorTotal = produtos.reduce(
    (soma, p) => soma + Number(p.quantidade || 0) * Number(p.preco_venda || 0),
    0
  );

  // Busca por nome ou código
  const termo = compacto(busca);
  const produtosFiltrados = termo
    ? produtos.filter(
        (p) => compacto(p.nome).includes(termo) || compacto(p.codigo).includes(termo)
      )
    : produtos;

  function irParaCadastro() {
    router.push({
      pathname: "/cadastrar",
      params: { categoria: categoriaCadastro },
    });
  }

  return (
    <View style={styles.container}>
      <Header title={tituloHeader} showSettings />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 90 + insets.bottom },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/estoque")}
        >
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.heroCard}>
          <Image source={imagem} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>{titulo}</Text>
          <Text style={styles.subtitle}>Estoque Dedicado</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tipos}</Text>
            <Text style={styles.statLabel}>Tipos</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{unidades}</Text>
            <Text style={styles.statLabel}>Unidades</Text>
          </View>

          <View style={styles.alertCard}>
            <Text style={styles.alertNumber}>{alertas}</Text>
            <Text style={styles.statLabel}>Alertas</Text>
          </View>
        </View>

        <View style={styles.moneyCard}>
          <Text style={styles.moneyTitle}>Valor Total em Estoque</Text>
          <Text style={styles.moneyValue}>{formatarReais(valorTotal)}</Text>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput
            placeholder="Buscar por nome ou código"
            placeholderTextColor="#888"
            style={styles.input}
            value={busca}
            onChangeText={setBusca}
            autoCorrect={false}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca("")}>
              <Ionicons name="close" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Itens em Estoque</Text>

          <TouchableOpacity style={styles.addButton} onPress={irParaCadastro}>
            <Ionicons name="add" size={16} color="#FFF" />
            <Text style={styles.addButtonText}>Novo</Text>
          </TouchableOpacity>
        </View>

        {carregando ? (
          <ActivityIndicator color="#F4882F" style={{ marginTop: 20 }} />
        ) : produtos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="cube-outline" size={44} color="#777" />
            <Text style={styles.emptyText}>Nenhum item cadastrado ainda</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={irParaCadastro}>
              <Text style={styles.emptyButtonText}>+ {textoBotaoCadastro}</Text>
            </TouchableOpacity>
          </View>
        ) : produtosFiltrados.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum item encontrado para "{busca}"</Text>
        ) : (
          produtosFiltrados.map((item) => {
            const status = statusDo(item);
            const quantidade = Number(item.quantidade || 0);

            return (
              <View style={styles.itemCard} key={item.id}>
                <InfoPeca item={item} />

                <View style={styles.rightContent}>
                  <View style={styles.qtdRow}>
                    <TouchableOpacity
                      style={[styles.qtdButton, quantidade === 0 && { opacity: 0.4 }]}
                      onPress={() => alterarQuantidade(item, -1)}
                      disabled={quantidade === 0}
                    >
                      <Ionicons name="remove" size={16} color="#FFF" />
                    </TouchableOpacity>

                    <Text style={styles.stockText}>{quantidade} Un</Text>

                    <TouchableOpacity
                      style={styles.qtdButton}
                      onPress={() => alterarQuantidade(item, 1)}
                    >
                      <Ionicons name="add" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.statusBadge, status.estilo]}>
                    <Text style={styles.statusText}>{status.texto}</Text>
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
    height: 90,
    marginBottom: 10,
    borderRadius: 10,
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

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4882F",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  addButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 4,
  },

  emptyBox: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
  },

  emptyText: {
    color: "#AAA",
    textAlign: "center",
    marginTop: 10,
  },

  emptyButton: {
    backgroundColor: "#F4882F",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 15,
  },

  emptyButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  itemCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#FFF",
    resizeMode: "contain",
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

  itemCode: {
    color: "#777",
    marginTop: 2,
    fontSize: 11,
  },

  rightContent: {
    alignItems: "flex-end",
  },

  qtdRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  qtdButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#3A3A3A",
    justifyContent: "center",
    alignItems: "center",
  },

  stockText: {
    color: "#FFF",
    fontWeight: "700",
    marginHorizontal: 8,
    minWidth: 40,
    textAlign: "center",
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

  statusZerado: {
    backgroundColor: "#E53935",
  },

  statusText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
