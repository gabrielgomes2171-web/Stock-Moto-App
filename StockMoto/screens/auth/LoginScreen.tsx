import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginScreen() {
  const router = useRouter();

  function handleLogin() {
    Alert.alert('Bem vindo!');
    router.replace('/(tabs)');
  }

  return (
    <View style={{ flex: 1 }}>
      <LoginForm
        onLogin={handleLogin}
        onForgotPassword={() => router.push('/esqueceu-senha')}
        onRegister={() => router.push('/cadastrar')}
      />
    </View>
  );
}