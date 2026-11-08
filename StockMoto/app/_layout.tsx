
import { Stack } from 'expo-router';
import { UserProvider } from '../contexts/UserContext';

export const unstable_settings = {
  initialRouteName: '(auth)/login',
};

export default function Layout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(auth)/login" />
      </Stack>
    </UserProvider>
  );
}
