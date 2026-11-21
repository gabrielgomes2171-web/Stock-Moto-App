import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { UserProvider } from '../contexts/UserContext';

export default function Layout() {
  return (

    <AuthProvider>
      <UserProvider>

        <Stack screenOptions={{ headerShown: false }} />

      </UserProvider>
    </AuthProvider>

  );
}