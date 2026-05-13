import { Stack } from 'expo-router';
import { UserProvider } from '../contexts/UserContext';

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