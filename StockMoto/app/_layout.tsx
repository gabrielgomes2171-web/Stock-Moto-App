import { Stack } from 'expo-router';
import { UserProvider } from '../contexts/UserContext';
import '../services/alertWeb';

export default function Layout() {
  return (

    <UserProvider>

      <Stack
        initialRouteName='(auth)/login'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="login" />
      </Stack>

    </UserProvider>

  );
}