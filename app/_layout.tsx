// Root Layout - Print-Xpress
import { Stack } from 'expo-router';
import { PrintXpressAuthProvider } from '../contexts/PrintXpressAuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <PrintXpressAuthProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="printxpress-splash" />
        <Stack.Screen name="printxpress-login" />
        <Stack.Screen name="printxpress-role-selection" />
        <Stack.Screen name="printxpress-user-home" />
        <Stack.Screen name="printxpress-pilot-dashboard" />
        <Stack.Screen name="printxpress-admin-dashboard" />
      </Stack>
    </PrintXpressAuthProvider>
  );
}
