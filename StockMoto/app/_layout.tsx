import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack 
    initialRouteName='(auth)/login'
    screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}