import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import Footer from "../components/Footer";
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";

export default function Perfil() {
  // O perfil (nome e foto) é carregado pelo UserProvider para o usuário
  // autenticado; ver contexts/UserContext.tsx.
  const { nome, setNome, imagem, setImagem, salvarPerfil: salvarPerfilDoUsuario } = useUser();
  const { sair, saindo } = useAuth();
  const [erroSair, setErroSair] = useState<string | null>(null);

  async function salvarPerfil() {
    await salvarPerfilDoUsuario();
    alert("Perfil salvo com sucesso!");
  }

  // Encerra a sessão no Firebase. A navegação para /login é feita pelo
  // Stack.Protected (app/_layout.tsx) quando o Firebase confirma o logout.
  async function sairDaConta() {
    setErroSair(null);
    try {
      await sair();
    } catch (error) {
      console.log("Erro ao sair da conta:", error);
      setErroSair("Não foi possível sair da conta. Tente novamente.");
    }
  }

  async function selecionarImagem() {
    const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
       alert("Permissão necessária!");
       return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
     });

     if (!result.canceled) {
      setImagem(result.assets[0].uri);
      }
  }
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

            {imagem ? (
              <Image
              source={{ uri: imagem }}
              style={styles.avatarImage}
            />
            ) : (
              <Text style={styles.avatarText}>
                {nome ? nome.charAt(0) : "M"}
              </Text>
              )}

            </View>

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={selecionarImagem}
          >
            <Ionicons
            name="camera"
            size={16}
            color="#fff"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{nome}</Text>
        <Text style={styles.email}>
          stockmotopeca@gmail.com
        </Text>

      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informações Pessoais</Text>

        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Nome Completo"
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={salvarPerfil}
        >
        
          <Text style={styles.saveText}>SALVAR</Text>
        </TouchableOpacity> 
      </View>

      <View style={styles.logoutCard}>
        <Text style={styles.logoutTitle}>Sair da Conta</Text>
        <Text style={styles.logoutSub}>
          Você será desconectado do sistema
        </Text>

        <TouchableOpacity
          style={[styles.logoutButton, saindo && styles.logoutButtonDisabled]}
          onPress={sairDaConta}
          disabled={saindo}
          accessibilityRole="button"
          accessibilityState={{ disabled: saindo, busy: saindo }}
          >
          {saindo ? (
            <View style={styles.logoutLoading}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.logoutText}>SAINDO...</Text>
            </View>
          ) : (
            <Text style={styles.logoutText}>SAIR</Text>
          )}
        </TouchableOpacity>

        {erroSair && (
          <Text style={styles.logoutError} accessibilityRole="alert">
            {erroSair}
          </Text>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },

  header: {
    backgroundColor: "#F47C20",
    padding: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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

  avatarImage: {
  width: "100%",
  height: "100%",
  borderRadius: 50,
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
    padding: 15,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
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
    margin: 10,
    borderRadius: 12,
    padding: 10,
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

  logoutButtonDisabled: {
    opacity: 0.6,
  },

  logoutLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logoutError: {
    color: "#FF8A80",
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
  },
});