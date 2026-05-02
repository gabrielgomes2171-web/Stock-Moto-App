import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RedefinirSenha() {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REDEFINIR{'\n'}SENHA</Text>

      <Text style={styles.subtitle}>
        Sua nova senha deve ser diferente da anterior. Verifique se os requisitos
        de segurança estão visíveis.
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#0D0D0D" />

      <TextInput
          placeholder="Nova senha"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
          name={showPassword ? 'eye-outline' : 'eye-off-outline'}
          size={20}
          color="#0D0D0D"
          />
          </TouchableOpacity>
          </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-open-outline" size={20} color="#0D0D0D" />

      <TextInput
          placeholder="Confirmar senha"
          placeholderTextColor="#999"
          secureTextEntry={!showConfirmPassword}
          style={styles.input}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

      <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons
          name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
          size={20}
          color="#0D0D0D"
      />
    </TouchableOpacity>
  </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>REDEFINIR SENHA</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.login}>Voltar para o Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    color: '#FFF',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },

  subtitle: {
    color: '#AAA',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,  
  },

  inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#E5E5E5',
  borderRadius: 8,
  paddingHorizontal: 12,
  marginBottom: 12,
  },

input: {
  flex: 1,
  backgroundColor: '#E5E5E5',
  color: '#0D0D0D',
  borderRadius: 8,
  paddingVertical: 14,
  marginLeft: 10,
},

button: {
  backgroundColor: '#FF7A00',
  padding: 14,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 20,
},

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  login: {
    color: '#4DA6FF',
    textAlign: 'center',
    marginTop: 16,
  },
});