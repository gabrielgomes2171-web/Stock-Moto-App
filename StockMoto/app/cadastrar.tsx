import {  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Ionicons } from '@expo/vector-icons';

export default function Cadastrar() {
    return (
        <View style={styles.container}>
            <Header title="Adicionar Novo Produto" showSettings />

            <ScrollView contentContainerStyle={styles.form}>
                <TouchableOpacity style={styles.imageUpload}>
                    <Image
                        source={require('../assets/images/pastilhafreio.png')}
                        style={styles.previewImage}
                    />

                    <View style={styles.uploadRow}>
                        <Text style={styles.imageText}>Adicionar Imagem</Text>
                        <Ionicons name="cloud-upload-outline" size={16} color="#fff" style={{ marginLeft: 6 }} />
                    </View>
                </TouchableOpacity>

                    <Input label="Nome" placeholder="Ex: Pastilha de Freio" />
                    <Input label="Código" placeholder="Ex: PF-001" />
                    <Input label="Categoria" placeholder="Selecione" />
                    <Input label="Marca" placeholder="Ex: Honda, Yamaha" />
                    <Input label="Modelos Compatíveis" placeholder="Ex: CG 160, Fazer 250" />
                    
                    <View style={styles.row}>
                        <Input label="Preço de Venda" placeholder="0.00" style={{ flex: 1 }} />
                        <Input label="Preço de Custo" placeholder="0.00" style={{ flex: 1, marginLeft: 8 }} />
                    </View>

                    <View style={styles.row}>
                        <Input label="Quantidade" placeholder="0" style={{ flex: 1 }} />
                        <Input label="Estoque Min." placeholder="2" style={{ flex: 1, marginLeft: 8 }} />
                    </View>

                    <Input label="Localização na Prateleira" placeholder="Ex: Prateleira A20" />

                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Detalhes Adicionais..."
                        placeholderTextColor="#777"
                        multiline
                    />

                    <View style={{ height: 80 }} />
                </ScrollView>

                <View style={styles.fixedButtonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>SALVAR</Text>
                    </TouchableOpacity>
                </View>

            <Footer active="cadastrar"/>
        </View>
    );
}

function Input({ label, style, ...props }: any) {
    return (
        <View style={[styles.inputContainer, style]}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholderTextColor="#777"
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  form: {
    padding: 16,
  },
  imageUpload: {
    backgroundColor: '#1e1e1e',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 16,
  },
  imageText: {
    color: '#fff',
    fontSize: 12,
  },
  previewImage: {
    width: 80,
    height: 60,
    borderRadius: 6,
    marginBottom: 8,
    opacity: 0.6,
  },
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    marginBottom: 4,
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
  },
  textArea: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#ff7a00',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  fixedButtonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});