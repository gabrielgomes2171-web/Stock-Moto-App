import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { escolherImagemBase64 } from '../services/imagemBase64';

import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import {
  buscarProdutoPorIdFirebase,
  atualizarProdutoFirebase,
  excluirProdutoFirebase,
} from '../firebase/produtosFirebase';

import { listarCategoriasFirebase } from '../firebase/categoriasFirebase';

// Mesma lista da tela Cadastrar
const MODELOS_FIXOS = [
  'UNIVERSAL',
  'CG 160 FAN',
  'CG 160 TITAN',
  'CG 160 START',
  'CG 160 CARGO',
  'BIZ 125',
  'XRE 300',
];

// Altura do Footer (65) + distância dele até a borda (5)
const ALTURA_FOOTER = 70;

// Tela aberta ao tocar numa peça no estoque: /editarpeca?id=<id da peça>
export default function EditarPeca() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

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
  const [modelosExtras, setModelosExtras] = useState<string[]>([]);

  useEffect(() => {
    carregar();
  }, [id]);

  // Busca a peça no banco e preenche todos os campos
  async function carregar() {
    if (!id) return;

    try {
      const [produto, modelos] = await Promise.all([
        buscarProdutoPorIdFirebase(String(id)),
        listarCategoriasFirebase('modelo'),
      ]);

      if (!produto) {
        Alert.alert('Erro', 'Peça não encontrada');
        router.back();
        return;
      }

      const p: any = produto;
      setNome(p.nome || '');
      setCodigo(p.codigo || '');
      setCategoria(p.categoria || '');
      setMarca(p.marca || '');
      setModeloMoto(p.modelo_moto || '');
      setDescricao(p.descricao || '');
      setLocalizacao(p.localizacao || '');
      setPrecoVenda(String(p.preco_venda ?? ''));
      setPrecoCusto(String(p.preco_custo ?? ''));
      setQuantidade(String(p.quantidade ?? ''));
      setEstoqueMinimo(String(p.estoque_minimo ?? ''));
      setImagem(p.imagem || '');

      // Modelos criados pelo usuário + o modelo atual da peça
      // (para ele aparecer no seletor mesmo se não estiver na lista)
      const extras = (modelos as any[])
        .map((m) => m.nome)
        .filter((n) => !MODELOS_FIXOS.includes(n));

      if (p.modelo_moto && !MODELOS_FIXOS.includes(p.modelo_moto) && !extras.includes(p.modelo_moto)) {
        extras.push(p.modelo_moto);
      }

      setModelosExtras(extras);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível carregar a peça');
    } finally {
      setCarregando(false);
    }
  }

  async function escolherImagem() {
    const foto = await escolherImagemBase64();
    if (foto) {
      setImagem(foto);
    }
  }

  // Aceita "12,50" ou "12.50"
  function paraNumero(texto: string) {
    return Number(String(texto || '0').replace(',', '.')) || 0;
  }

  async function salvar() {
    if (!nome.trim() || !codigo.trim() || !modeloMoto.trim()) {
      Alert.alert('Erro', 'Preencha nome, código e modelo da moto');
      return;
    }

    try {
      setSalvando(true);

      await atualizarProdutoFirebase(String(id), {
        nome: nome.trim(),
        codigo: codigo.trim(),
        categoria: categoria.trim(),
        marca: marca.trim(),
        modelo_moto: modeloMoto.trim(),
        descricao: descricao.trim(),
        localizacao: localizacao.trim(),
        preco_custo: paraNumero(precoCusto),
        preco_venda: paraNumero(precoVenda),
        estoque_minimo: paraNumero(estoqueMinimo),
        quantidade: paraNumero(quantidade),
        imagem: imagem,
      });

      Alert.alert('Sucesso', 'Peça atualizada', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    } finally {
      setSalvando(false);
    }
  }

  function excluir() {
    Alert.alert(
      'Excluir peça',
      `Deseja excluir "${nome}"? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirProdutoFirebase(String(id));
              router.back();
            } catch (error) {
              console.log(error);
              Alert.alert('Erro', 'Não foi possível excluir a peça');
            }
          },
        },
      ]
    );
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <Header title="Editar Peça" showSettings />
        <ActivityIndicator color="#ff7a00" style={{ marginTop: 40 }} />
        <Footer active="estoque" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Editar Peça" showSettings />

      <ScrollView contentContainerStyle={styles.form}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.imageUpload}
          onPress={escolherImagem}
        >
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.previewImage} />
          ) : (
            <Ionicons name="image-outline" size={40} color="#777" />
          )}

          <View style={styles.uploadRow}>
            <Text style={styles.imageText}>
              {imagem ? 'Trocar imagem' : 'Adicionar Imagem'}
            </Text>
            <Ionicons
              name="cloud-upload-outline"
              size={16}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </View>
        </TouchableOpacity>

        {imagem ? (
          <TouchableOpacity onPress={() => setImagem('')}>
            <Text style={styles.removerImagem}>Remover imagem</Text>
          </TouchableOpacity>
        ) : null}

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
          placeholder="Ex: Freios, Capacetes, Baú"
        />

        <Input
          label="Marca"
          value={marca}
          onChangeText={setMarca}
          placeholder="Ex: Honda, Yamaha"
        />

        <Text style={styles.label}>Modelos Compatíveis</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={modeloMoto}
            onValueChange={(itemValue: string) => setModeloMoto(itemValue)}
            dropdownIconColor="#fff"
            style={styles.picker}
          >
            <Picker.Item label="Selecione a Moto" value="" color="#999" />

            {[...MODELOS_FIXOS, ...modelosExtras].map((modelo) => (
              <Picker.Item key={modelo} label={modelo} value={modelo} />
            ))}
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

        <Text style={styles.label}>Descrição</Text>

        <TextInput
          style={styles.textArea}
          placeholder="Detalhes Adicionais..."
          placeholderTextColor="#777"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />

        <TouchableOpacity style={styles.deleteButton} onPress={excluir}>
          <Ionicons name="trash-outline" size={18} color="#FF5A5A" />
          <Text style={styles.deleteButtonText}>Excluir peça</Text>
        </TouchableOpacity>

        <View style={{ height: 150 + insets.bottom }} />
      </ScrollView>

      <View
        style={[
          styles.fixedButtonContainer,
          { bottom: ALTURA_FOOTER + insets.bottom + 12 },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, salvando && { opacity: 0.6 }]}
          onPress={salvar}
          disabled={salvando}
        >
          <Text style={styles.buttonText}>
            {salvando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
          </Text>
        </TouchableOpacity>
      </View>

      <Footer active="estoque" />
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
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F4882F',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  removerImagem: {
    color: '#FF5A5A',
    textAlign: 'center',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF5A5A',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },

  deleteButtonText: {
    color: '#FF5A5A',
    fontWeight: 'bold',
    marginLeft: 6,
  },

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