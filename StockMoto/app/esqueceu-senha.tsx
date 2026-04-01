import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleSend = () => {
    console.log('Enviar instruções para:', email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Ionicons name="bicycle" size={80} color="#FF7A00" />
          <Text style={styles.logoText}>STOCK</Text>
          <Text style={styles.subLogo}>MOTO PEÇAS</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Esqueceu a senha?</Text>
        <Text style={styles.subtitle}>
          Digite seu e-mail cadastrado para receber instruções de redefinição
        </Text>

        {/* Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={20} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="Seu e-mail"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>ENVIAR INSTRUÇÕES</Text>
        </TouchableOpacity>

        {/* Footer Links */}
        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={styles.link}>Voltar para o Login</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.link}>Cadastre-se aqui</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D'
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  logoText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },
  subLogo: {
    color: '#FF7A00',
    fontSize: 12,
    letterSpacing: 2
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    color: '#CCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20
  },
  input: {
    flex: 1,
    height: 45,
    marginLeft: 10,
    color: '#000'
  },
  button: {
    backgroundColor: '#FF7A00',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  link: {
    color: '#4DA6FF',
    fontSize: 12
  }
});
