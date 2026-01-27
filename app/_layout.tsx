// Root Layout - Print-Xpress
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { PrintProvider } from '../contexts/PrintContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <PrintProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="upload" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="payment" />
          <Stack.Screen name="otp" />
          <Stack.Screen name="success" />
          <Stack.Screen name="profile-settings" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="print-settings" />
          <Stack.Screen name="payment-methods" />
          <Stack.Screen name="help" />
          <Stack.Screen name="feedback" />
          <Stack.Screen name="about" />
          <Stack.Screen name="delivery" />
          <Stack.Screen name="delivery-tracking" />
        </Stack>
      </PrintProvider>
    </AuthProvider>
  );
}
