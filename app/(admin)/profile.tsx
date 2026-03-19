// Admin Profile Screen
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth-otp');
  };

  const stats = [
    { label: 'System Uptime', value: '99.9%' },
    { label: 'Active Nodes', value: '1,204' },
    { label: 'Total Revenue', value: '$2.4M' },
  ];

  const menuItems = [
    { icon: 'security', label: 'Security Settings', description: 'Manage 2FA and access control' },
    { icon: 'admin-panel-settings', label: 'User Permissions', description: 'Configure role-based access' },
    { icon: 'history-edu', label: 'Audit Logs', description: 'Review system activity logs' },
    { icon: 'settings-suggest', label: 'System Configuration', description: 'Adjust environment parameters' },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="admin-panel-settings" size={48} color="#FFF" />
          </View>
          <Text style={styles.name}>Admin Sarah</Text>
          <Text style={styles.role}>System Administrator</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Pressable style={styles.infoCard}>
            <LinearGradient
              colors={[theme.primary, theme.primaryDark]}
              style={styles.infoGradient}
            >
              <Text style={styles.infoLabel}>Admin ID</Text>
              <Text style={styles.infoValue}>PX-ADM-442</Text>
              <Text style={styles.infoLabel}>Region</Text>
              <Text style={styles.infoValue}>Central Hub</Text>
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoValue}>+1 555-022-9999</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <Pressable key={index} style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <MaterialIcons name={item.icon as any} size={24} color={theme.textSecondary} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={theme.textTertiary} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <Pressable style={styles.logoutButton} onPress={handleSignOut}>
            <MaterialIcons name="logout" size={20} color={theme.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...theme.shadow.medium,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: '#D1FAE5',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.success,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.success,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  infoCard: {
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadow.medium,
  },
  infoGradient: {
    padding: 24,
    gap: 8,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.large,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.error,
  },
});
