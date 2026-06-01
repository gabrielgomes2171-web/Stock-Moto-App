import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import React, { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import {
  criarContaFirebase,
} from '../../firebase/usuariosFirebase';

export default function CadastreSe() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarVisivel, setConfirmarVisivel] = useState(false);

  async function cadastrarUsuario() {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();
    const confirmarSenhaLimpa = confirmarSenha.trim();

    if (
      !nomeLimpo ||
      !emailLimpo ||
      !senhaLimpa ||
      !confirmarSenhaLimpa
    ) {
      Alert.alert(
        'Erro',
        'Preencha todos os campos'
      );
      return;
    }

    if (senhaLimpa.length < 6) {
      Alert.alert(
        'Erro',
        'A senha precisa ter no mínimo 6 caracteres'
      );
      return;
    }

    if (senhaLimpa !== confirmarSenhaLimpa) {
      Alert.alert(
        'Erro',
        'As senhas não coincidem'
      );
      return;
    }

    try {
      await criarContaFirebase(
        nomeLimpo,
        emailLimpo,
        senhaLimpa
      );

      Alert.alert(
        'Sucesso',
        'Conta criada com sucesso'
      );

      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');

      router.replace('/login');
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível criar a conta'
      );

      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          CRIAR CONTA
        </Text>

        <Text style={styles.subtitle}>
          Bem-vindo ao STOCKMOTO!
        </Text>

        <Text style={styles.subtitle}>
          Preencha seus dados para começar
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={18}
            color="#0D0D0D"
          />

          <TextInput
            placeholder="Nome Completo"
            placeholderTextColor="#999"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#0D0D0D"
          />

          <TextInput
            placeholder="Seu E-mail"
            placeholderTextColor="#999"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#0D0D0D"
          />

          <TextInput
            placeholder="Nova Senha"
            placeholderTextColor="#999"
            secureTextEntry={!senhaVisivel}
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity
            onPress={() =>
              setSenhaVisivel(!senhaVisivel)
            }
          >
            <Ionicons
              name={
                senhaVisivel
                  ? 'eye-outline'
                  : 'eye-off-outline'
              }
              size={20}
              color="#0D0D0D"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-open-outline"
            size={18}
            color="#0D0D0D"
          />

          <TextInput
            placeholder="Confirmar Senha"
            placeholderTextColor="#999"
            secureTextEntry={!confirmarVisivel}
            style={styles.input}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <TouchableOpacity
            onPress={() =>
              setConfirmarVisivel(!confirmarVisivel)
            }
          >
            <Ionicons
              name={
                confirmarVisivel
                  ? 'eye-outline'
                  : 'eye-off-outline'
              }
              size={20}
              color="#0D0D0D"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.terms}>
          Li e aceito os{' '}
          <Text style={styles.link}>
            Termos de Uso
          </Text>
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={cadastrarUsuario}
        >
          <Text style={styles.buttonText}>
            CADASTRAR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push('/login')
          }
        >
          <Text style={styles.login}>
            Voltar para o Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    maxWidth: 360,
  },

  title: {
    color: '#FFF',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },

  subtitle: {
    color: '#AAA',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 18,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    marginTop: 14,
  },

  input: {
    flex: 1,
    color: '#0D0D0D',
    fontSize: 13,
    marginLeft: 10,
  },

  terms: {
    color: '#9CA3AF',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
  },

  link: {
    color: '#FF7A00',
    fontWeight: '500',
  },

  button: {
    backgroundColor: '#FF7A00',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  login: {
    color: '#38BDF8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 14,
  },
});
