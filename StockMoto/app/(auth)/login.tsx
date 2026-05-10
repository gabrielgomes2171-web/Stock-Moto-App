import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        
      />

      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require('../../assets/images/iconegoogle.png')}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text style={styles.googleText}>Entrar com a Conta Google</Text>
      </TouchableOpacity>


        <View style={styles.inputContainer}>
        <Ionicons name='person-outline' size={18} color='#0D0D0D' />
        <TextInput
          placeholder="Usuario"
          placeholderTextColor="#666"
          value={usuario}
          onChangeText={setUsuario}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name='lock-closed-outline' size={20} color='#0D0D0D' />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#666"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!showPassword}
          style={styles.input}
        />

      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
      >
        <Ionicons
          name={showPassword ? 'eye' : 'eye-off'}
          size={24}
          color="#666"
        />
      </TouchableOpacity>
    </View>

      <PrimaryButton
        title="ENTRAR NA CONTA"
        onPress={() => {

          if (!usuario || !senha) {
            Alert.alert('Erro','Preencha usuário e senha');
            return;
          }

          Alert.alert('Bem Vindo Novamente!');
          router.replace('/inicial');
        }}
      />

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/esqueceu-senha')}>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/cadastre-se')}>
          <Text style={styles.link}>Cadastre-se aqui</Text>
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
    width: 450,
    height: 200,
    marginBottom: 20,
  },

  googleButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
  },

  googleIcon: {
    width: 22,
    height: 22,
  },

  googleText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    marginTop: 14,
    
  },

  input: {
    flex: 1,
    color: "#0D0D0D",
    fontSize: 13,
    marginLeft: 10,
  },


  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    color: '#000',
    fontSize: 15,
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