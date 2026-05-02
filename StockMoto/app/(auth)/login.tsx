import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

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
        <Text style={styles.googleText}>Continue com a Conta Google</Text>
      </TouchableOpacity>

      <Text style={styles.or}>Ou</Text>

      <TextInput
        placeholder="Usuario"
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
      />

      <PrimaryButton
        title="ENTRAR NA CONTA"
        onPress={() => {
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
    padding: 20,
  },
  logo: {
    width: 450,
    height: 200,
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    gap: 10,
  },
  googleText: {
    color: '#000',
    fontWeight: '500',
  },
  or: {
    marginVertical: 10,
    color: '#999',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  link: {
    color: '#2563EB',
    fontSize: 12,
  },
});