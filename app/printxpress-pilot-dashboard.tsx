// Print-Xpress Pilot Dashboard (Placeholder)
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { printXpressTheme } from '../constants/printXpressTheme';
import { usePrintXpressAuth } from '../contexts/PrintXpressAuthContext';

export default function PrintXpressPilotDashboardScreen() {
  const { user, logout } = usePrintXpressAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <MaterialIcons name="electric-bike" size={80} color={printXpressTheme.colors.secondary} />
        <Text style={styles.title}>Pilot Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.displayName}!</Text>
        
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>
            Print Pilot dashboard with incoming requests, active deliveries, earnings tracker, and workflow management will be implemented here.
          </Text>
        </View>

        <Pressable style={styles.logoutButton} onPress={logout}>
          <MaterialIcons name="logout" size={20} color={printXpressTheme.colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: printXpressTheme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    ...printXpressTheme.typography.headlineMedium,
    color: printXpressTheme.colors.textPrimary,
  },
  subtitle: {
    ...printXpressTheme.typography.bodyLarge,
    color: printXpressTheme.colors.textSecondary,
  },
  placeholderCard: {
    backgroundColor: printXpressTheme.colors.surfaceContainerLow,
    padding: 24,
    borderRadius: printXpressTheme.borderRadius.large,
    marginTop: 32,
  },
  placeholderText: {
    ...printXpressTheme.typography.bodyMedium,
    color: printXpressTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: printXpressTheme.borderRadius.medium,
    borderWidth: 1,
    borderColor: printXpressTheme.colors.error,
  },
  logoutText: {
    ...printXpressTheme.typography.labelLarge,
    color: printXpressTheme.colors.error,
  },
});
