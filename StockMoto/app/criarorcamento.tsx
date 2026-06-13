import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CriarOrcamento() {
    return (
        <View style={styles.container}>
            <Header title="Novo Orçamento" showSettings />

            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Dados do Cliente</Text>

                    <TextInput
                        placeholder="Ex: João Pedro"
                        placeholderTextColor="#888"
                        style={styles.input}
                />

                    <TextInput
                        placeholder="(DD) 00000-0000"
                        placeholderTextColor="#888"
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Ex: Honda CG 160 TITAN"
                        placeholderTextColor="#888"
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Validade (dias)"
                        placeholderTextColor="#888"
                        style={styles.input}
                    />
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Peças</Text>

                    <TextInput
                        placeholder="Buscar peça por nome, código"
                        placeholderTextColor="#888"
                        style={styles.input}
                    />

                    <View style={styles.emptyBox}>
                        <Text style={styles.plus}>＋</Text>

                        <Text style={styles.emptyText}>
                            Busque e adicione peças acima
                        </Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Resumo</Text>

                    <TextInput
                        placeholder="Observações"
                        placeholderTextColor="#888"
                        style={[styles.input, { height: 75 }]}
                        multiline
                    />

                    <View style={styles.row}>
                        <Text style={styles.label}>Subtotal</Text>
                        <Text style={styles.value}>R$ 0,00</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Desconto</Text>
                        <Text style={styles.value}>R$ 0,00</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.total}>Total</Text>
                        <Text style={styles.total}>R$ 0,00</Text>
                    </View>
                </View>
            </ScrollView>
    
            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Criar Orçamento</Text>
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
    paddingBottom: 190,
  },

  card: {
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    color: "#F57C00",
    fontSize: 14,
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

  emptyBox: {
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    marginTop: 10,
  },

  plus: {
    fontSize: 24,
    color: "#AAA",
  },

  emptyText: {
    color: "#888",
    marginTop: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  label: {
    color: "#AAA",
  },

  value: {
    color: "#FFF",
  },

  total: {
    color: "#F57C00",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },

  button: {
    backgroundColor: "#F57C00",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  fixedButtonContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    padding: 1,
    backgroundColor: 'transparent',
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
