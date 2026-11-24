import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect, Href } from 'expo-router';
import { ImageSourcePropType } from 'react-native';
import React, { useCallback, useState } from 'react';
import Footer from "../components/Footer";
import Header from "../components/Header";
import { listarCategoriasFirebase } from "../firebase/categoriasFirebase";
import { listarTodosProdutosFirebase } from "../firebase/produtosFirebase";
import { listarOrcamentosFirebase } from "../services/orcamentosFirebase";

// Quantos resultados mostrar por seção antes de pedir para refinar a busca
const LIMITE_POR_SECAO = 5;

/* =========================
   ATALHOS (cards da tela)
========================= */

type Atalho = {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  rota: Href;
  palavrasChave: string[];
};

// Lista dos atalhos da tela. Para criar um atalho novo, é só adicionar aqui.
// "palavrasChave" são termos extras que também fazem o atalho aparecer na busca.
const ATALHOS: Atalho[] = [
  {
    title: "Meu Estoque",
    subtitle: "Pesquisar peças e acessórios",
    image: require("../assets/images/estoque.png"),
    rota: "/estoque",
    palavrasChave: ["peças", "produtos", "marcas", "modelos", "acessórios"],
  },
  {
    title: "Alertas",
    subtitle: "Alertas de estoque",
    image: require("../assets/images/alerta.png"),
    rota: "/alertas",
    palavrasChave: ["aviso", "baixo", "zerado", "mínimo", "acabando"],
  },
  {
    title: "Cadastrar",
    subtitle: "Cadastre peças e acessórios",
    image: require("../assets/images/cadastrar.png"),
    rota: "/cadastrar",
    palavrasChave: ["novo", "adicionar", "produto", "peça", "incluir"],
  },
  {
    title: "Orçamentos",
    subtitle: "Visualizar e criar",
    image: require("../assets/images/orcamentos.png"),
    rota: "/orcamentos",
    palavrasChave: ["preço", "cliente", "venda", "valor", "criar orçamento"],
  },
];

/* =========================
   RESULTADOS DA BUSCA
   (cada linha leva direto para a tela certa)
========================= */

type Resultado = {
  id: string;
  titulo: string;
  subtitulo: string;
  extra?: string;          // texto à direita (quantidade, valor...)
  extraAlerta?: boolean;   // deixa o texto da direita em vermelho
  imagem?: ImageSourcePropType;
  icone: keyof typeof Ionicons.glyphMap;
  textoBusca: string;      // onde a busca procura
  textoExato?: string[];   // valores que abrem direto com "Enter"
  rota: Href;
};

// Motos e acessórios que já existem fixos no app
const ITENS_FIXOS: Resultado[] = [
  {
    id: "honda",
    titulo: "HONDA",
    subtitulo: "Marca",
    imagem: require("../assets/images/honda.png"),
    icone: "bicycle-outline",
    textoBusca: "HONDA marca",
    rota: "/estoquehonda",
  },
  {
    id: "cg160start",
    titulo: "CG 160 START",
    subtitulo: "Modelo • HONDA",
    imagem: require("../assets/images/cg160start.png"),
    icone: "bicycle-outline",
    textoBusca: "CG 160 START modelo HONDA",
    rota: "/estoquestart160",
  },
  {
    id: "cg160fan",
    titulo: "CG 160 FAN",
    subtitulo: "Modelo • HONDA",
    imagem: require("../assets/images/cg160fan.png"),
    icone: "bicycle-outline",
    textoBusca: "CG 160 FAN modelo HONDA",
    rota: "/estoquefan160",
  },
  {
    id: "cg160titan",
    titulo: "CG 160 TITAN",
    subtitulo: "Modelo • HONDA",
    imagem: require("../assets/images/cg160titan.png"),
    icone: "bicycle-outline",
    textoBusca: "CG 160 TITAN modelo HONDA",
    rota: "/estoquetitan160",
  },
  {
    id: "cg160cargo",
    titulo: "CG 160 CARGO",
    subtitulo: "Modelo • HONDA",
    imagem: require("../assets/images/cg160cargo.png"),
    icone: "bicycle-outline",
    textoBusca: "CG 160 CARGO modelo HONDA",
    rota: "/estoquecargo160",
  },
  {
    id: "capacetes",
    titulo: "CAPACETES",
    subtitulo: "Acessório",
    imagem: require("../assets/images/capacete.png"),
    icone: "cube-outline",
    textoBusca: "CAPACETES capacete acessório",
    rota: "/capacetes",
  },
  {
    id: "bau",
    titulo: "BAÚ",
    subtitulo: "Acessório",
    imagem: require("../assets/images/bau.png"),
    icone: "cube-outline",
    textoBusca: "BAÚ baus bauleto acessório",
    rota: "/bau",
  },
];

// Telas fixas de cada modelo (usado para abrir a peça na tela certa)
const ROTAS_MODELOS_FIXOS: Record<string, Href> = {
  "CG 160 START": "/estoquestart160",
  "CG 160 FAN": "/estoquefan160",
  "CG 160 TITAN": "/estoquetitan160",
  "CG 160 CARGO": "/estoquecargo160",
};

// Marca, modelo ou acessório adicionado em "Adicionar ao Estoque"
function converterCategoria(item: any): Resultado {
  const imagem = item.imagem ? { uri: item.imagem } : undefined;

  if (item.tipo === "marca") {
    return {
      id: item.id,
      titulo: item.nome,
      subtitulo: "Marca",
      imagem,
      icone: "bicycle-outline",
      textoBusca: `${item.nome} marca`,
      rota: { pathname: "/marca", params: { nome: item.nome, imagem: item.imagem || "" } },
    };
  }

  if (item.tipo === "modelo") {
    return {
      id: item.id,
      titulo: item.nome,
      subtitulo: `Modelo • ${item.marca}`,
      imagem,
      icone: "bicycle-outline",
      textoBusca: `${item.nome} modelo ${item.marca}`,
      rota: {
        pathname: "/itensestoque",
        params: { tipo: "modelo", nome: item.nome, marca: item.marca || "", imagem: item.imagem || "" },
      },
    };
  }

  return {
    id: item.id,
    titulo: item.nome,
    subtitulo: "Acessório",
    imagem,
    icone: "cube-outline",
    textoBusca: `${item.nome} acessório`,
    rota: {
      pathname: "/itensestoque",
      params: { tipo: "acessorio", nome: item.nome, imagem: item.imagem || "" },
    },
  };
}

// Peça: abre a tela do estoque onde ela aparece
function converterProduto(produto: any, acessorios: any[]): Resultado {
  const modelo = (produto.modelo_moto || "").trim().toUpperCase();
  const categoria = (produto.categoria || "").trim().toUpperCase();
  const quantidade = Number(produto.quantidade || 0);
  const minimo = Number(produto.estoque_minimo || 0);

  // 1) A categoria é um acessório criado pelo usuário? Abre o acessório.
  const acessorio = acessorios.find((a) => a.nome === categoria);

  const ehCapacete = ["CAPACETE", "CAPACETES"].includes(categoria);
  const ehBau = ["BAU", "BAÚ", "BAUS", "BAÚS", "BAULETO"].includes(categoria);
  const ehAcessorio = ehCapacete || ehBau || !!acessorio;

  let rota: Href;
  if (ehCapacete) {
    // Capacetes e Baú têm telas próprias
    rota = "/capacetes";
  } else if (ehBau) {
    rota = "/bau";
  } else if (acessorio) {
    rota = {
      pathname: "/itensestoque",
      params: { tipo: "acessorio", nome: acessorio.nome, imagem: acessorio.imagem || "" },
    };
  } else if (ROTAS_MODELOS_FIXOS[modelo]) {
    // 2) Modelo fixo do app (CG 160...)
    rota = ROTAS_MODELOS_FIXOS[modelo];
  } else {
    // 3) Qualquer outro modelo: tela genérica de peças
    rota = {
      pathname: "/itensestoque",
      params: { tipo: "modelo", nome: modelo, marca: produto.marca || "", imagem: "" },
    };
  }

  return {
    id: produto.id,
    titulo: produto.nome || "Sem nome",
    subtitulo: `Cód: ${produto.codigo || "-"} • ${ehAcessorio ? categoria : modelo || "Sem modelo"}`,
    extra: `${quantidade} un.`,
    extraAlerta: quantidade <= minimo,
    imagem: produto.imagem ? { uri: produto.imagem } : undefined,
    icone: "construct-outline",
    textoBusca: `${produto.nome || ""} ${produto.codigo || ""}`,
    textoExato: [produto.codigo || ""],
    rota,
  };
}

// Orçamento: abre a tela de editar orçamento
function converterOrcamento(orcamento: any): Resultado {
  return {
    id: orcamento.id,
    titulo: orcamento.cliente || "Cliente não informado",
    subtitulo: `Moto: ${orcamento.moto || "-"}`,
    extra: `R$ ${Number(orcamento.total || 0).toFixed(2)}`,
    icone: "document-text-outline",
    textoBusca: `${orcamento.cliente || ""}`,
    rota: { pathname: "/editarorcamento", params: { id: orcamento.id } },
  };
}

/* =========================
   FUNÇÕES DE TEXTO
========================= */

// Deixa o texto minúsculo e sem acento: "Orçamentos" -> "orcamentos"
// Assim a busca funciona mesmo se a pessoa digitar sem acento.
function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

// Remove espaços, traços e pontos: "PF-001" -> "pf001", "CG 160" -> "cg160"
function compacto(texto: string) {
  return normalizar(texto).replace(/[^a-z0-9]/g, "");
}

// Cada palavra digitada precisa aparecer no texto, em qualquer ordem:
// "titan 160" encontra "CG 160 TITAN"
function combina(texto: string, termo: string) {
  const alvo = normalizar(texto);
  const palavras = termo.split(/\s+/).filter(Boolean);
  const termoCompacto = compacto(termo);
  return (
    palavras.every((p) => alvo.includes(p)) ||
    (termoCompacto !== "" && compacto(texto).includes(termoCompacto))
  );
}

/* =========================
   TELA
========================= */

export default function Inicial() {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [motosExtras, setMotosExtras] = useState<Resultado[]>([]);
  const [pecas, setPecas] = useState<Resultado[]>([]);
  const [orcamentos, setOrcamentos] = useState<Resultado[]>([]);

  // Carrega tudo do Firebase sempre que a tela volta a aparecer.
  // Cada parte carrega separada: se uma falhar, as outras continuam funcionando.
  useFocusEffect(
    useCallback(() => {
      carregarMotosEPecas();
      carregarOrcamentos();
    }, [])
  );

  async function carregarMotosEPecas() {
    try {
      const [marcas, modelos, acessorios, produtos] = await Promise.all([
        listarCategoriasFirebase("marca"),
        listarCategoriasFirebase("modelo"),
        listarCategoriasFirebase("acessorio"),
        listarTodosProdutosFirebase(),
      ]);

      setMotosExtras(
        [...marcas, ...modelos, ...acessorios].map(converterCategoria)
      );
      setPecas(
        (produtos as any[]).map((p) => converterProduto(p, acessorios as any[]))
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function carregarOrcamentos() {
    try {
      const lista = await listarOrcamentosFirebase();
      setOrcamentos((lista as any[]).map(converterOrcamento));
    } catch (error) {
      console.log(error);
    }
  }

  const termo = normalizar(busca);
  const temBusca = termo !== "";

  function filtrar(lista: Resultado[]) {
    return temBusca ? lista.filter((r) => combina(r.textoBusca, termo)) : [];
  }

  const motosFiltradas = filtrar([...ITENS_FIXOS, ...motosExtras]);
  const pecasFiltradas = filtrar(pecas);
  const orcamentosFiltrados = filtrar(orcamentos);

  const atalhosFiltrados = ATALHOS.filter((atalho) => {
    if (!temBusca) return true; // campo vazio: mostra todos
    return combina(
      [atalho.title, atalho.subtitle, ...atalho.palavrasChave].join(" "),
      termo
    );
  });

  const totalResultados =
    motosFiltradas.length +
    pecasFiltradas.length +
    orcamentosFiltrados.length +
    atalhosFiltrados.length;

  const nadaEncontrado = temBusca && totalResultados === 0;

  function abrir(rota: Href) {
    setBusca("");
    router.push(rota);
  }

  // Ao apertar "Enter" no teclado:
  // 1) se o texto é exatamente o nome de uma moto/acessório ou o código de uma peça, abre ele
  // 2) se sobrou só 1 resultado no total, abre ele
  function abrirSeUnico() {
    if (!temBusca) return;

    const termoCompacto = compacto(termo);
    const exato = [...motosFiltradas, ...pecasFiltradas].find(
      (r) =>
        compacto(r.titulo) === termoCompacto ||
        (r.textoExato ?? []).some((t) => t !== "" && compacto(t) === termoCompacto)
    );
    if (exato) {
      abrir(exato.rota);
      return;
    }

    if (totalResultados === 1) {
      const unico = [...motosFiltradas, ...pecasFiltradas, ...orcamentosFiltrados][0];
      abrir(unico ? unico.rota : atalhosFiltrados[0].rota);
    }
  }

  return (
    <View style={styles.container}>

      <Header
        title="Painel de Controle"
        showSettings={true}
      />

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Moto, peça, código, cliente..."
          placeholderTextColor="#999"
          style={styles.search}
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={abrirSeUnico}
          returnKeyType="search"
          autoCorrect={false}
        />

        {busca.length > 0 ? (
          <TouchableOpacity onPress={() => setBusca("")}>
            <Feather name="x" size={22} color="#999" />
          </TouchableOpacity>
        ) : (
          <Feather name="search" size={22} color="#999" />
        )}
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <SecaoResultados titulo="Motos e acessórios" itens={motosFiltradas} onAbrir={abrir} />
        <SecaoResultados titulo="Peças" itens={pecasFiltradas} onAbrir={abrir} />
        <SecaoResultados titulo="Orçamentos" itens={orcamentosFiltrados} onAbrir={abrir} />

        {temBusca && atalhosFiltrados.length > 0 && (
          <Text style={styles.resultadosTitulo}>Atalhos</Text>
        )}

        <View style={styles.grid}>

          {atalhosFiltrados.map((atalho) => (
            <Card
              key={atalho.title}
              title={atalho.title}
              subtitle={atalho.subtitle}
              image={atalho.image}
              onPress={() => router.push(atalho.rota)}
            />
          ))}

          {nadaEncontrado && (
            <View style={styles.empty}>
              <Feather name="search" size={32} color="#555" />
              <Text style={styles.emptyText}>
                Nada encontrado para "{busca}"
              </Text>
            </View>
          )}

        </View>
      </ScrollView>

      <Footer active='inicial' />
    </View>
  );
}

/* =========================
   LISTA DE RESULTADOS
========================= */

type SecaoProps = {
  titulo: string;
  itens: Resultado[];
  onAbrir: (rota: Href) => void;
};

function SecaoResultados({ titulo, itens, onAbrir }: SecaoProps) {
  if (itens.length === 0) return null;

  const visiveis = itens.slice(0, LIMITE_POR_SECAO);
  const restantes = itens.length - visiveis.length;

  return (
    <View style={styles.resultados}>
      <Text style={[styles.resultadosTitulo, { paddingHorizontal: 0 }]}>
        {titulo} ({itens.length})
      </Text>

      {visiveis.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.resultadoItem}
          onPress={() => onAbrir(item.rota)}
        >
          <View style={styles.resultadoImagemBox}>
            {item.imagem ? (
              <Image source={item.imagem} style={styles.resultadoImagem} />
            ) : (
              <Ionicons name={item.icone} size={24} color="#F47B20" />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.resultadoNome} numberOfLines={1}>
              {item.titulo}
            </Text>
            <Text style={styles.resultadoTipo} numberOfLines={1}>
              {item.subtitulo}
            </Text>
          </View>

          {item.extra ? (
            <Text style={[styles.resultadoExtra, item.extraAlerta && styles.resultadoExtraAlerta]}>
              {item.extra}
            </Text>
          ) : null}

          <Feather name="chevron-right" size={20} color="#F47B20" />
        </TouchableOpacity>
      ))}

      {restantes > 0 && (
        <Text style={styles.maisResultados}>
          + {restantes} resultado(s). Digite mais para refinar a busca.
        </Text>
      )}
    </View>
  );
}

type CardProps = {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  onPress: () => void;
};

function Card({ title, subtitle, image, onPress }: CardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.image} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 0,
  },

  header: {
    backgroundColor: "#F47B20",
    padding: 20,
    marginBottom: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    marginTop: 15,
    marginHorizontal: 15,
  },

  search: {
    flex: 1,
    padding: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  scrollContent: {
    paddingBottom: 140,
  },

  resultados: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  resultadosTitulo: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    paddingHorizontal: 15,
  },

  resultadoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },

  resultadoImagemBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },

  resultadoImagem: {
    width: 44,
    height: 44,
    resizeMode: "contain",
  },

  resultadoNome: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },

  resultadoTipo: {
    color: "#AAA",
    fontSize: 12,
    marginTop: 2,
  },

  resultadoExtra: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
    marginHorizontal: 8,
  },

  resultadoExtraAlerta: {
    color: "#FF5A5A",
  },

  maisResultados: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: 90,
    borderRadius: 10,
  },

  cardTitle: {
    fontWeight: "bold",
    marginTop: 8,
  },

  empty: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },

  emptyText: {
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },

  cardSubtitle: {
    fontSize: 12,
    color: "#666",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
  },

  activeTab: {
    backgroundColor: "#fff3e9",
    padding: 10,
    borderRadius: 10,
  },
});