import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/*
  Parte esquerda do card de uma peça nas telas de estoque:
  foto, nome, código, marca, preço, localização na prateleira e descrição.
  Campos vazios não aparecem.
  Tocar aqui abre a tela "Editar Peça".
*/

type Props = {
  item: any;
  baixo?: boolean; // mostra o aviso "ESTOQUE BAIXO"
};

export default function InfoPeca({ item, baixo }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.6}
      onPress={() =>
        router.push({
          pathname: "/editarpeca",
          params: { id: item.id },
        })
      }
    >
      {item.imagem ? (
        <Image source={{ uri: item.imagem }} style={styles.foto} />
      ) : (
        <View style={[styles.foto, styles.semFoto]}>
          <Ionicons name="construct-outline" size={24} color="#777" />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome}</Text>

        {item.codigo ? (
          <Text style={styles.info}>Código: {item.codigo}</Text>
        ) : null}

        {item.marca ? (
          <Text style={styles.info}>Marca: {item.marca}</Text>
        ) : null}

        <Text style={styles.preco}>
          R$ {Number(item.preco_venda || 0).toFixed(2)}
        </Text>

        {item.localizacao ? (
          <View style={styles.localBox}>
            <Ionicons name="location-outline" size={12} color="#F4882F" />
            <Text style={styles.localTexto}>{item.localizacao}</Text>
          </View>
        ) : null}

        {item.descricao ? (
          <Text style={styles.descricao} numberOfLines={3}>
            {item.descricao}
          </Text>
        ) : null}

        {baixo && <Text style={styles.alerta}>⚠ ESTOQUE BAIXO</Text>}

        <View style={styles.editarDica}>
          <Ionicons name="create-outline" size={12} color="#777" />
          <Text style={styles.editarTexto}>Toque para editar</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginRight: 10,
  },

  foto: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#FFF",
    resizeMode: "contain",
  },

  semFoto: {
    backgroundColor: "#3A3A3A",
    justifyContent: "center",
    alignItems: "center",
  },

  nome: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },

  info: {
    color: "#AAA",
    fontSize: 12,
    marginTop: 2,
  },

  preco: {
    color: "#4CAF50",
    fontWeight: "700",
    fontSize: 13,
    marginTop: 4,
  },

  localBox: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#3B2D1E",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
  },

  localTexto: {
    color: "#F4882F",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 3,
  },

  descricao: {
    color: "#999",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 6,
  },

  editarDica: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  editarTexto: {
    color: "#777",
    fontSize: 11,
    marginLeft: 3,
  },

  alerta: {
    color: "#FFB300",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
  },
});
