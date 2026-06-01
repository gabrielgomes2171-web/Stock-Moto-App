import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';

import React, { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  recuperarSenhaFirebase,
} from '../../firebase/usuariosFirebase';

export default function EsqueceuSenha() {
  const router = useRouter();

  const [email, setEmail] = useState('');

  async function verificarEmail() {
    if (!email.trim()) {
      Alert.alert(
        'Erro',
        'Digite seu e-mail'
      );

      return;
    }

    try {
      await recuperarSenhaFirebase(
        email.trim().toLowerCase()
      );

      Alert.alert(
        'Sucesso',
        'Enviamos as instruções para seu e-mail'
      );

      router.push('/verificar-email');
    } catch (error) {
      Alert.alert(
        'Erro',
        'E-mail não encontrado ou inválido'
      );

      console.log(error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Esqueceu a senha?
        </Text>

        <Text style={styles.subtitle}>
          Digite seu e-mail cadastrado para receber instruções de redefinição
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#888"
          />

          <TextInput
            style={styles.input}
            placeholder="Seu e-mail"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={verificarEmail}
        >
          <Text style={styles.buttonText}>
            ENVIAR INSTRUÇÕES
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => router.push('/login')}
          >
            <Text style={styles.link}>
              Voltar para o Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/cadastre-se')}
          >
            <Text style={styles.link}>
              Cadastre-se aqui
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },

  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 450,
    height: 200,
    marginBottom: 20,
  },

  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    color: '#CCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 20,
  },

  input: {
    flex: 1,
    height: 45,
    marginLeft: 10,
    color: '#000',
  },

  button: {
    backgroundColor: '#f4882f',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },

  link: {
    color: '#4DA6FF',
    fontSize: 12,
  },
});