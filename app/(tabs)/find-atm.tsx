// Find ATM Screen - Placeholder
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function FindATMScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="map" size={80} color={theme.textTertiary} />
        <Text style={styles.title}>Find ATM</Text>
        <Text style={styles.description}>Map integration coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    ...theme.typography.pageTitle,
    color: theme.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    ...theme.typography.body,
    color: theme.textSecondary,
  },
});
