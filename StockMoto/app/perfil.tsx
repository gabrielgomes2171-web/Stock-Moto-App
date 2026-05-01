import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { replace } from "expo-router/build/global-state/routing";
import { useRouter } from 'expo-router';
import Footer from "../components/Footer";

export default function Perfil() {
  const router = useRouter();
  return (

    <SafeAreaView style={styles.container}>
      <Footer />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <Text style={styles.headerSubtitle}>
          Gerencie suas informações pessoais
        </Text>
      </View>

      <View style={styles.profileCard}>

        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MT</Text>
          </View>

          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* INFO */}
        <Text style={styles.name}>Moto Stock</Text>
        <Text style={styles.email}>
          stockmotopeca@gmail.com
        </Text>

      </View>


      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informações Pessoais</Text>

        <TextInput
          placeholder="Nome Completo"
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>SALVAR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutCard}>
        <Text style={styles.logoutTitle}>Sair da Conta</Text>
        <Text style={styles.logoutSub}>
          Você será desconectado do sistema
        </Text>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.replace('/login')}
          >
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    padding: -20,
  },

  header: {
    backgroundColor: "#F47C20",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  headerSubtitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },

  profileCard: {
    backgroundColor: "#2A2A2A",
    margin: 20,
    borderRadius: 12,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
  },

  avatarWrapper: {
    position: "absolute",
    top: -10,
    alignItems: "center",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F47C20",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#F47C20",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2A2A2A",
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
  },

  email: {
    color: "#ccc",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#2A2A2A",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#adadad63",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 10,
  },

  saveButton: {
    backgroundColor: "#F47C20",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },

  logoutCard: {
    backgroundColor: "#2A2A2A",
    margin: 20,
    borderRadius: 12,
    padding: 15,
  },

  logoutTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  logoutSub: {
    color: "#ccc",
    fontSize: 12,
    marginVertical: 6,
  },

  logoutButton: {
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});