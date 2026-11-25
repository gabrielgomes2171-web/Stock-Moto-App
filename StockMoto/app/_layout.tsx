import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { UserProvider } from '../contexts/UserContext';
import '../services/alertWeb';

// Na versão web (Netlify) aparece o selo "Powered by Netlify" no canto de
// baixo da tela. Esse espaço no fim da página evita que ele cubra botões
// e o rodapé de navegação. No celular (Expo Go) não muda nada.
const ESPACO_SELO_WEB = Platform.OS === 'web' ? 90 : 0;

export default function Layout() {
  return (

    <UserProvider>

      <View style={{ flex: 1, paddingBottom: ESPACO_SELO_WEB, backgroundColor: '#101010' }}>
        <Stack
          initialRouteName='(auth)/login'
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="login" />
        </Stack>
      </View>

    </UserProvider>

  );
}
