import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';

import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import {
  cadastrarProdutoFirebase,
} from '../firebase/produtosFirebase';

export default function Cadastrar() {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [modeloMoto, setModeloMoto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [precoCusto, setPrecoCusto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [imagem, setImagem] = useState('');

  async function escolherImagem() {
    const permissao =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita acesso à galeria para escolher uma imagem'
      );
      return;
    }

    const resultado =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  }

  async function salvarProduto() {
    if (!nome.trim() || !codigo.trim() || !modeloMoto.trim()) {
      Alert.alert(
        'Erro',
        'Preencha nome, código e modelo da moto'
      );
      return;
    }

    try {
      await cadastrarProdutoFirebase({
        nome: nome.trim(),
        codigo: codigo.trim(),
        categoria: categoria.trim(),
        marca: marca.trim(),
        modelo_moto: modeloMoto.trim(),
        descricao: descricao.trim(),
        localizacao: localizacao.trim(),
        preco_custo: Number(precoCusto || 0),
        preco_venda: Number(precoVenda || 0),
        estoque_minimo: Number(estoqueMinimo || 0),
        quantidade: Number(quantidade || 0),
        imagem: imagem,
      });

      Alert.alert(
        'Sucesso',
        'Produto cadastrado com sucesso'
      );

      setNome('');
      setCodigo('');
      setCategoria('');
      setMarca('');
      setModeloMoto('');
      setDescricao('');
      setLocalizacao('');
      setPrecoVenda('');
      setPrecoCusto('');
      setQuantidade('');
      setEstoqueMinimo('');
      setImagem('');
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível cadastrar o produto'
      );

      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Adicionar Novo Produto" showSettings />

      <ScrollView contentContainerStyle={styles.form}>
        <TouchableOpacity
          style={styles.imageUpload}
          onPress={escolherImagem}
        >
          <Image
            source={
              imagem
                ? { uri: imagem }
                : require('../assets/images/pastilhafreio.png')
            }
            style={styles.previewImage}
          />

          <View style={styles.uploadRow}>
            <Text style={styles.imageText}>
              {imagem ? 'Imagem selecionada' : 'Adicionar Imagem'}
            </Text>

            <Ionicons
              name="cloud-upload-outline"
              size={16}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </View>
        </TouchableOpacity>

        <Input
          label="Nome"
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Pastilha de Freio"
        />

        <Input
          label="Código"
          value={codigo}
          onChangeText={setCodigo}
          placeholder="Ex: PF-001"
        />

        <Input
          label="Categoria"
          value={categoria}
          onChangeText={setCategoria}
          placeholder="Selecione"
        />

        <Input
          label="Marca"
          value={marca}
          onChangeText={setMarca}
          placeholder="Ex: Honda, Yamaha"
        />

        <Text style={styles.label}>
          Modelos Compatíveis
        </Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={modeloMoto}
            onValueChange={(itemValue: string) =>
              setModeloMoto(itemValue)
            }
            dropdownIconColor="#fff"
            style={styles.picker}
          >
            <Picker.Item
              label="Selecione a Moto"
              value=""
              color="#999"
            />

            <Picker.Item label="CG 160 FAN" value="CG 160 FAN" />
            <Picker.Item label="CG 160 TITAN" value="CG 160 TITAN" />
            <Picker.Item label="CG 160 START" value="CG 160 START" />
            <Picker.Item label="CG 160 CARGO" value="CG 160 CARGO" />
            <Picker.Item label="BIZ 125" value="BIZ 125" />
            <Picker.Item label="XRE 300" value="XRE 300" />
          </Picker>
        </View>

        <View style={styles.row}>
          <Input
            label="Preço de Venda"
            value={precoVenda}
            onChangeText={setPrecoVenda}
            placeholder="0.00"
            keyboardType="numeric"
            style={{ flex: 1 }}
          />

          <Input
            label="Preço de Custo"
            value={precoCusto}
            onChangeText={setPrecoCusto}
            placeholder="0.00"
            keyboardType="numeric"
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>

        <View style={styles.row}>
          <Input
            label="Quantidade"
            value={quantidade}
            onChangeText={setQuantidade}
            placeholder="0"
            keyboardType="numeric"
            style={{ flex: 1 }}
          />

          <Input
            label="Estoque Min."
            value={estoqueMinimo}
            onChangeText={setEstoqueMinimo}
            placeholder="2"
            keyboardType="numeric"
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>

        <Input
          label="Localização na Prateleira"
          value={localizacao}
          onChangeText={setLocalizacao}
          placeholder="Ex: Prateleira A20"
        />

        <Text style={styles.label}>
          Descrição
        </Text>

        <TextInput
          style={styles.textArea}
          placeholder="Detalhes Adicionais..."
          placeholderTextColor="#777"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />

        <View style={{ height: 150 }} />
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={salvarProduto}
        >
          <Text style={styles.buttonText}>
            SALVAR
          </Text>
        </TouchableOpacity>
      </View>

      <Footer active="cadastrar" />
    </View>
  );
}

function Input({ label, style, ...props }: any) {
  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={styles.label}>
        {label}
      </Text>

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
    resizeMode: 'cover',
    opacity: 0.9,
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

  pickerContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 12,
  },

  picker: {
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
    bottom: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    padding: 1,
    backgroundColor: 'transparent',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});