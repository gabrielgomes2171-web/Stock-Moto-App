import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';

import { useRouter } from 'expo-router';

import React, { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';

import {
  loginFirebase,
} from '../../firebase/usuariosFirebase';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function entrar() {
    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();

    if (!emailLimpo || !senhaLimpa) {
      Alert.alert(
        'Erro',
        'Preencha email e senha'
      );

      return;
    }

    try {
      const usuarioEncontrado =
        await loginFirebase(
          emailLimpo,
          senhaLimpa
        );

      (globalThis as any).usuarioLogado = {
        id: usuarioEncontrado.uid,
        uid: usuarioEncontrado.uid,
        email: usuarioEncontrado.email,
      };

      Alert.alert(
        'Sucesso',
        'Bem-vindo novamente!'
      );

      router.replace('/inicial');
    } catch (error) {
      Alert.alert(
        'Erro',
        'Email ou senha inválidos'
      );

      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={18}
          color="#0D0D0D"
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#0D0D0D"
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#666"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!showPassword}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={() =>
            setShowPassword(!showPassword)
          }
        >
          <Ionicons
            name={
              showPassword
                ? 'eye'
                : 'eye-off'
            }
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <PrimaryButton
        title="ENTRAR NA CONTA"
        onPress={entrar}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() =>
            router.push('/esqueceu-senha')
          }
        >
          <Text style={styles.link}>
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push('/cadastre-se')
          }
        >
          <Text style={styles.link}>
            Cadastre-se aqui
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  logo: {
    width: 400,
    height: 300,
    marginBottom: 0,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    marginTop: 14,
    width: '100%',
  },

  input: {
    flex: 1,
    color: '#0D0D0D',
    fontSize: 13,
    marginLeft: 10,
  },

  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  link: {
    color: '#2563EB',
    fontSize: 12,
  },
});