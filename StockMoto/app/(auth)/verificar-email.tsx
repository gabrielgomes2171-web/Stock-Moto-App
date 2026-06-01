import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

export default function VerificarEmail() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons
        name="mail-outline"
        size={80}
        color="#F28C28"
      />

      <Text style={styles.title}>
        VERIFIQUE SEU{'\n'}E-MAIL
      </Text>

      <Text style={styles.subtitle}>
        Enviamos um link de redefinição para seu e-mail.
        Abra sua caixa de entrada e siga as instruções para criar uma nova senha.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.buttonText}>
          VOLTAR PARA LOGIN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/esqueceu-senha')}
      >
        <Text style={styles.resend}>
          Enviar novamente
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    color: '#FFF',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },

  subtitle: {
    color: '#A1A1AA',
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 35,
    fontSize: 15,
    lineHeight: 22,
  },

  button: {
    width: '100%',
    backgroundColor: '#F28C28',
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 18,
  },

  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },

  resend: {
    color: '#F28C28',
    fontSize: 13,
    fontWeight: 'bold',
  },
});