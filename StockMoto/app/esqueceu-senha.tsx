import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSend = () => {
    console.log('Enviar instruções para:', email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Image
        source={require('../assets/images/logo.png')} 
        style={styles.logo}
        />

        <Text style={styles.title}>Esqueceu a senha?</Text>
        <Text style={styles.subtitle}>
          Digite seu e-mail cadastrado para receber instruções de redefinição
        </Text>

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

        <TouchableOpacity style={styles.button} 
        onPress={() => router.push('/verificar-email')}
        >
          <Text style={styles.buttonText}>ENVIAR INSTRUÇÕES</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.back()}>
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
    backgroundColor: '#101010'
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
  width: 450,
  height: 200,
  marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50
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
    width: '100%',
    marginBottom: 20
  },
  input: {
    flex: 1,
    height: 45,
    marginLeft: 10,
    color: '#000'
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
    fontWeight: 'bold'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  link: {
    color: '#4DA6FF',
    fontSize: 12
  },
});
