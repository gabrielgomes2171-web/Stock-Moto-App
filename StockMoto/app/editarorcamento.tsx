import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buscarOrcamentoPorId, atualizarOrcamentoFirebase } from "../services/orcamentosFirebase";
import { Ionicons } from "@expo/vector-icons";

export default function EditarOrcamento() {
  const router = useRouter();

  const { id } = useLocalSearchParams();

  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [moto, setMoto] = useState("");
  const [validade, setValidade] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [subtotal, setSubtotal] = useState("");
  const [desconto, setDesconto] = useState("");

  const total = useMemo(() => {
    const sub = Number(subtotal || 0);
    const desc = Number(desconto || 0);

    return Math.max(sub - desc, 0);
  }, [subtotal, desconto]);

  useEffect(() => {
    carregarOrcamento();
  }, []);

  async function carregarOrcamento() {
    try {
      const dados =
        await buscarOrcamentoPorId(
          String(id)
        );

      if (!dados) return;

      setCliente(dados.cliente || "");
      setTelefone(dados.telefone || "");
      setMoto(dados.moto || "");
      setValidade(dados.validade || "");
      setObservacoes(
        dados.observacoes || ""
      );

      setSubtotal(
        String(dados.subtotal || 0)
      );

      setDesconto(
        String(dados.desconto || 0)
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function salvarAlteracoes() {
    try {
      await atualizarOrcamentoFirebase(
        String(id),
        {
          cliente,
          telefone,
          moto,
          validade,
          observacoes,
          subtotal:
            Number(subtotal) || 0,
          desconto:
            Number(desconto) || 0,
          total,
        }
      );

      Alert.alert(
        "Sucesso",
        "Orçamento atualizado com sucesso!"
      );

      router.back();
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível atualizar o orçamento."
      );
    }
  }

  return (
    <View style={styles.container}>
      <Header
        title="Editar Orçamento"
        showSettings
      />
    
    <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/orcamentos")}
    >

    <Ionicons
        name="arrow-back"
        size={20}
        color="#FFF"
    />
    </TouchableOpacity>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Dados do Cliente
          </Text>

          <TextInput
            value={cliente}
            onChangeText={setCliente}
            placeholder="Cliente"
            placeholderTextColor="#888"
            style={styles.input}
          />

          <TextInput
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Telefone"
            placeholderTextColor="#888"
            style={styles.input}
          />

          <TextInput
            value={moto}
            onChangeText={setMoto}
            placeholder="Moto"
            placeholderTextColor="#888"
            style={styles.input}
          />

          <TextInput
            value={validade}
            onChangeText={setValidade}
            placeholder="Validade"
            placeholderTextColor="#888"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Resumo Financeiro
          </Text>

          <TextInput
            value={subtotal}
            onChangeText={setSubtotal}
            placeholder="Subtotal"
            placeholderTextColor="#888"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            value={desconto}
            onChangeText={setDesconto}
            placeholder="Desconto"
            placeholderTextColor="#888"
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.row}>
            <Text style={styles.label}>
              Total
            </Text>

            <Text style={styles.total}>
              R$ {total.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Observações
          </Text>

          <TextInput
            value={observacoes}
            onChangeText={
              setObservacoes
            }
            placeholder="Observações"
            placeholderTextColor="#888"
            multiline
            style={[
              styles.input,
              styles.textArea,
            ]}
          />
        </View>
      </ScrollView>

      <View
        style={
          styles.fixedButtonContainer
        }
      >
        <TouchableOpacity
          style={styles.button}
          onPress={
            salvarAlteracoes
          }
        >
          <Text
            style={styles.buttonText}
          >
            Salvar Alterações
          </Text>
        </TouchableOpacity>
      </View>

      <Footer active="orcamentos" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },

  content: {
    padding: 20,
    paddingBottom: 180,
  },

  card: {
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    color: "#F57C00",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: "#FFF",
    marginBottom: 10,
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  label: {
    color: "#AAA",
    fontSize: 16,
  },

  total: {
    color: "#4CAF50",
    fontSize: 20,
    fontWeight: "bold",
  },

  fixedButtonContainer: {
    position: "absolute",
    bottom: 120,
    left: 16,
    right: 16,
  },

  button: {
    backgroundColor: "#F57C00",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  backButton: {
  width: 40,
  height: 40,
  backgroundColor: "#F4882F",
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 10,
  marginLeft: 20,
  marginBottom: 10,
},
});