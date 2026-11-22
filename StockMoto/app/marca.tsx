import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModeloCard from "@/components/ModeloCard";
import { listarModelosPorMarcaFirebase } from "../firebase/categoriasFirebase";

// Tela genérica para marcas adicionadas pelo usuário.
// Recebe ?nome=YAMAHA&imagem=<uri>
export default function Marca() {
  const router = useRouter();
  const { nome, imagem } = useLocalSearchParams<{ nome: string; imagem?: string }>();

  const [modelos, setModelos] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (nome) {
        listarModelosPorMarcaFirebase(nome)
          .then((dados) => setModelos(dados as any[]))
          .catch((error) => console.log(error));
      }
    }, [nome])
  );

  return (
    <View style={styles.container}>
      <Header title={`Estoque ${nome ?? ""}`} showSettings />

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/estoque")}
        >
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.brandBox}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.brandLogo} />
          ) : (
            <View style={[styles.brandLogo, styles.placeholder]}>
              <Ionicons name="image-outline" size={26} color="#777" />
            </View>
          )}

          <View>
            <Text style={styles.brandTitle}>{nome}</Text>
            <Text style={styles.brandSubtitle}>ESCOLHA O MODELO</Text>
          </View>
        </View>

        {modelos.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum modelo cadastrado para {nome}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/adicionarcategoria")}
            >
              <Text style={styles.addButtonText}>+ ADICIONAR MODELO</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {modelos.map((modelo) => (
              <ModeloCard key={modelo.id} modelo={modelo} />
            ))}
          </View>
        )}
      </ScrollView>

      <Footer active="estoque" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },

  content: {
    padding: 16,
    paddingBottom: 120,
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

  brandBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },

  brandLogo: {
    width: 90,
    height: 50,
    resizeMode: "contain",
    marginRight: 12,
    borderRadius: 5,
    backgroundColor: "#fff",
  },

  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  brandTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  brandSubtitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },


  empty: {
    alignItems: "center",
    marginTop: 20,
  },

  emptyText: {
    color: "#999",
    marginBottom: 14,
    textAlign: "center",
  },

  addButton: {
    backgroundColor: "#F47B20",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  addButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
