import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ImageSourcePropType} from 'react-native';
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Inicial() {
  const router = useRouter();
    
  return (
    <View style={styles.container}>

      <Header
        title="Painel de Controle"
        showSettings={true}
      />

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Pesquise aqui..."
          placeholderTextColor="#999"
          style={styles.search}
        />
        <Feather name="search" size={22} color="#999" />
      </View>

      <View style={styles.grid}>

        <Card
          title="Meu Estoque"
          subtitle="Pesquisar peças e acessórios"
          image={require("../assets/images/estoque.png")}
          onPress={() => router.push("/estoque")}
        />

        <Card
          title="Alertas"
          subtitle="Alertas de estoque"
          image={require("../assets/images/alerta.png")}
          onPress={() => router.push("/alertas")}
        />

        <Card
          title="Cadastrar"
          subtitle="Cadastre peças e acessórios"
          image={require("../assets/images/cadastrar.png")}
          onPress={() => router.push("/cadastrar")}
        />

        <Card
          title="Orçamentos"
          subtitle="Visualizar e criar"
          image={require("../assets/images/orcamentos.png")}
          onPress={() => router.push("/orcamentos")}
        />

      </View>

      <View style={styles.footer}>

        <TouchableOpacity onPress={() => router.push("/estoque")}>
          <MaterialIcons name="inventory" size={24} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/cadastrar")}>
          <Ionicons name="add-circle-outline" size={26} color="#555" />
        </TouchableOpacity>


        <TouchableOpacity onPress={() => router.push("/orcamentos")}>
          <Feather name="dollar-sign" size={22} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/alertas")}>
          <Ionicons name="warning-outline" size={24} color="#555" />
        </TouchableOpacity>

      </View>
      <Footer active='inicial' /> 
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
    marginBottom: 80,
    paddingHorizontal: 15,
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