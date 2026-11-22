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

import React, { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useFocusEffect } from 'expo-router';

import Header from '../components/Header';
import Footer from '../components/Footer';

import {
  cadastrarCategoriaFirebase,
  listarCategoriasFirebase,
  excluirCategoriaFirebase,
} from '../firebase/categoriasFirebase';

type Tipo = 'marca' | 'modelo' | 'acessorio';

const ABAS: { tipo: Tipo; label: string }[] = [
  { tipo: 'marca', label: 'MARCA' },
  { tipo: 'modelo', label: 'MODELO' },
  { tipo: 'acessorio', label: 'ACESSÓRIO' },
];

// Marcas que já existem fixas no app
const MARCAS_FIXAS = ['HONDA'];

const PLACEHOLDER: Record<Tipo, string> = {
  marca: 'Ex: Yamaha',
  modelo: 'Ex: Fazer 250',
  acessorio: 'Ex: Luvas',
};

export default function AdicionarCategoria() {
  const router = useRouter();

  const [tipo, setTipo] = useState<Tipo>('marca');
  const [nome, setNome] = useState('');
  const [imagem, setImagem] = useState('');
  const [marcaModelo, setMarcaModelo] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [marcas, setMarcas] = useState<any[]>([]);
  const [itens, setItens] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      carregar(tipo);
    }, [tipo])
  );

  async function carregar(tipoAtual: Tipo) {
    try {
      const [listaMarcas, listaItens] = await Promise.all([
        listarCategoriasFirebase('marca'),
        listarCategoriasFirebase(tipoAtual),
      ]);
      setMarcas(listaMarcas as any[]);
      setItens(listaItens as any[]);
    } catch (error) {
      console.log(error);
    }
  }

  const todasMarcas = [
    ...MARCAS_FIXAS,
    ...marcas.map((m) => m.nome).filter((n) => !MARCAS_FIXAS.includes(n)),
  ];

  async function escolherImagem() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita acesso à galeria para escolher uma imagem'
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  }

  function trocarAba(novo: Tipo) {
    setTipo(novo);
    setNome('');
    setImagem('');
    setMarcaModelo('');
  }

  async function salvar() {
    const nomeLimpo = nome.trim().toUpperCase();

    if (!nomeLimpo) {
      Alert.alert('Erro', 'Preencha o nome');
      return;
    }

    if (tipo === 'modelo' && !marcaModelo) {
      Alert.alert('Erro', 'Selecione a marca do modelo');
      return;
    }

    const jaExiste =
      itens.some(
        (i) =>
          i.nome === nomeLimpo &&
          (tipo !== 'modelo' || i.marca === marcaModelo)
      ) ||
      (tipo === 'marca' && MARCAS_FIXAS.includes(nomeLimpo));

    if (jaExiste) {
      Alert.alert('Atenção', `${nomeLimpo} já está cadastrado`);
      return;
    }

    try {
      setSalvando(true);
      await cadastrarCategoriaFirebase({
        tipo,
        nome: nomeLimpo,
        imagem,
        marca: tipo === 'modelo' ? marcaModelo : '',
      });

      Alert.alert('Sucesso', `${nomeLimpo} adicionado ao estoque`, [
        { text: 'Adicionar outro' },
        { text: 'Ver estoque', onPress: () => router.replace('/estoque') },
      ]);

      setNome('');
      setImagem('');
      carregar(tipo);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar');
      console.log(error);
    } finally {
      setSalvando(false);
    }
  }

  function excluir(item: any) {
    Alert.alert('Excluir', `Deseja remover ${item.nome}?`, [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          await excluirCategoriaFirebase(item.id);
          carregar(tipo);
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Header title="Adicionar ao Estoque" showSettings />

      <ScrollView contentContainerStyle={styles.form}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/estoque')}
        >
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.tabs}>
          {ABAS.map((aba) => (
            <TouchableOpacity
              key={aba.tipo}
              style={[styles.tab, tipo === aba.tipo && styles.tabActive]}
              onPress={() => trocarAba(aba.tipo)}
            >
              <Text
                style={[
                  styles.tabText,
                  tipo === aba.tipo && styles.tabTextActive,
                ]}
              >
                {aba.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.imageUpload} onPress={escolherImagem}>
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

        {tipo === 'modelo' && (
          <>
            <Text style={styles.label}>Marca</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={marcaModelo}
                onValueChange={(v: string) => setMarcaModelo(v)}
                dropdownIconColor="#fff"
                style={styles.picker}
              >
                <Picker.Item label="Selecione a Marca" value="" color="#999" />
                {todasMarcas.map((m) => (
                  <Picker.Item key={m} label={m} value={m} />
                ))}
              </Picker>
            </View>
          </>
        )}

        <Text style={styles.label}>
          {tipo === 'marca'
            ? 'Nome da Marca'
            : tipo === 'modelo'
            ? 'Nome do Modelo'
            : 'Nome do Acessório'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={PLACEHOLDER[tipo]}
          placeholderTextColor="#777"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="characters"
        />

        {tipo === 'acessorio' && (
          <Text style={styles.hint}>
            Ao cadastrar um produto, use este nome no campo “Categoria” para ele
            aparecer dentro deste acessório.
          </Text>
        )}

        <TouchableOpacity
          style={[styles.button, salvando && { opacity: 0.6 }]}
          onPress={salvar}
          disabled={salvando}
        >
          <Text style={styles.buttonText}>
            {salvando ? 'SALVANDO...' : 'SALVAR'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>
          {tipo === 'marca'
            ? 'Marcas adicionadas'
            : tipo === 'modelo'
            ? 'Modelos adicionados'
            : 'Acessórios adicionados'}
        </Text>

        {itens.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum item adicionado ainda</Text>
        ) : (
          itens.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              {item.imagem ? (
                <Image source={{ uri: item.imagem }} style={styles.itemImage} />
              ) : (
                <View style={[styles.itemImage, styles.itemImageEmpty]}>
                  <Ionicons name="image-outline" size={20} color="#777" />
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.nome}</Text>
                {item.marca ? (
                  <Text style={styles.itemInfo}>{item.marca}</Text>
                ) : null}
              </View>

              <TouchableOpacity onPress={() => excluir(item)}>
                <Ionicons name="trash-outline" size={20} color="#FF5A5A" />
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <Footer active="estoque" />
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

  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F4882F',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  tabActive: {
    backgroundColor: '#ff7a00',
  },

  tabText: {
    color: '#999',
    fontWeight: '700',
    fontSize: 12,
  },

  tabTextActive: {
    color: '#fff',
  },

  imageUpload: {
    backgroundColor: '#1e1e1e',
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 16,
  },

  previewImage: {
    width: 90,
    height: 70,
    borderRadius: 6,
    marginBottom: 8,
    resizeMode: 'contain',
  },

  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  imageText: {
    color: '#fff',
    fontSize: 12,
  },

  label: {
    color: '#fff',
    marginBottom: 4,
    fontSize: 12,
  },

  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    marginBottom: 12,
  },

  hint: {
    color: '#888',
    fontSize: 11,
    marginTop: -6,
    marginBottom: 12,
  },

  pickerContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 12,
  },

  picker: {
    color: '#fff',
  },

  button: {
    backgroundColor: '#ff7a00',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },

  itemCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#fff',
    resizeMode: 'contain',
  },

  itemImageEmpty: {
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemName: {
    color: '#FFF',
    fontWeight: '700',
  },

  itemInfo: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 2,
  },
});
