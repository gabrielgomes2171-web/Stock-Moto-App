import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

export default function RedefinirSenha() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons
        name="mail-outline"
        size={72}
        color="#FF7A00"
        style={styles.icon}
      />

      <Text style={styles.title}>
        REDEFINIR{'\n'}SENHA
      </Text>

      <Text style={styles.subtitle}>
        Enviamos um link para redefinir sua senha.
        Abra seu e-mail cadastrado e siga as instruções.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.buttonText}>
          VOLTAR PARA LOGIN
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  icon: {
    marginBottom: 18,
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
    lineHeight: 23,
    marginBottom: 30,
  },

  button: {
    backgroundColor: '#FF7A00',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});