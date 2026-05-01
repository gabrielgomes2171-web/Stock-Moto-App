import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ImageSourcePropType} from 'react-native';

export default function Inicial() {
  const router = useRouter();
    
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.headerTop}>

          <TouchableOpacity
            style={styles.profile}
            onPress={() => router.push('/perfil')}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
            </View>
            <Text style={styles.brand}>Moto Stock</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/configuracoes')}>
            <Ionicons name="settings-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Painel de Controle</Text>
      </View>

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
          onPress={() => navigation.navigate("Estoque")}
        />

        <Card
          title="Alertas"
          subtitle="Alertas de estoque"
          image={require("../assets/images/alerta.png")}
          onPress={() => navigation.navigate("Alertas")}
        />

        <Card
          title="Cadastrar"
          subtitle="Cadastre peças e acessórios"
          image={require("../assets/images/cadastrar.png")}
          onPress={() => navigation.navigate("Cadastrar")}
        />

        <Card
          title="Orçamentos"
          subtitle="Visualizar e criar"
          image={require("../assets/images/orcamentos.png")}
          onPress={() => navigation.navigate("Orcamentos")}
        />

      </View>

      <View style={styles.footer}>

        <TouchableOpacity onPress={() => navigation.navigate("Estoque")}>
          <MaterialIcons name="inventory" size={24} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Cadastrar")}>
          <Ionicons name="add-circle-outline" size={26} color="#555" />
        </TouchableOpacity>

        <View style={styles.activeTab}>
          <Ionicons name="grid" size={24} color="#F47B20" />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Orcamentos")}>
          <Feather name="dollar-sign" size={22} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Alertas")}>
          <Ionicons name="warning-outline" size={24} color="#555" />
        </TouchableOpacity>

      </View>

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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
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