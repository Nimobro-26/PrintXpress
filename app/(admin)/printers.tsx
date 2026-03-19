// Admin Printers Management Screen
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function AdminPrintersScreen() {
  const insets = useSafeAreaInsets();

  const printers = [
    { id: 'PRT-001', location: 'Main Library', status: 'online' },
    { id: 'PRT-042', location: 'South Wing Hub', status: 'offline' },
    { id: 'PRT-089', location: 'Logistics Annex', status: 'online' },
    { id: 'PRT-112', location: 'Admin Block B', status: 'warning' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return theme.success;
      case 'offline': return theme.textSecondary;
      case 'warning': return theme.warning;
      default: return theme.textSecondary;
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Printer Fleet</Text>
        <Pressable style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="#FFF" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.printersList}>
          {printers.map((printer) => (
            <View key={printer.id} style={styles.printerCard}>
              <View style={styles.printerHeader}>
                <View>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(printer.status) }]} />
                    <Text style={styles.statusLabel}>{printer.status.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.printerId}>{printer.id}</Text>
                  <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={14} color={theme.textSecondary} />
                    <Text style={styles.location}>{printer.location}</Text>
                  </View>
                </View>
                <View style={styles.qrIcon}>
                  <MaterialIcons name="qr-code-2" size={32} color={theme.primary} />
                </View>
              </View>

              <View style={styles.printerActions}>
                <Pressable style={styles.actionButton}>
                  <MaterialIcons name="edit" size={18} color={theme.textSecondary} />
                </Pressable>
                <Pressable style={styles.actionButton}>
                  <MaterialIcons name="bar-chart" size={18} color={theme.textSecondary} />
                </Pressable>
                <Pressable style={styles.actionButton}>
                  <MaterialIcons name="delete" size={18} color={theme.error} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.medium,
  },
  printersList: {
    marginTop: 24,
    gap: 16,
  },
  printerCard: {
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow.small,
  },
  printerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.textSecondary,
    letterSpacing: 1,
  },
  printerId: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  qrIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  printerActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.backgroundSecondary,
  },
});
