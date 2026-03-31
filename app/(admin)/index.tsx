// Admin Dashboard - System Overview
import { View, Text, Pressable, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../constants/theme';

const ADMIN = '#7C3AED';
const ADMIN_DARK = '#5B21B6';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleAddPrinter = () => {
    router.push('/admin-add-printer');
  };

  const handleBroadcastAlert = () => {
    if (Platform.OS === 'web') {
      const message = prompt('Enter broadcast message:');
      if (!message) return;
      const confirmed = window.confirm(`Send this message to all printers and agents?\n\n"${message}"`);
      if (confirmed) {
        alert('✓ Broadcast Sent!\n\nYour message has been delivered to:\n• 1,284 Active Printers\n• 156 Online Agents\n\nTimestamp: ' + new Date().toLocaleString());
      }
    } else {
      Alert.alert(
        'Broadcast Alert',
        'Select broadcast type:',
        [
          {
            text: 'Maintenance Notice',
            onPress: () => Alert.alert('Maintenance', 'Scheduled maintenance notification sent to all devices.\n\n"System maintenance scheduled for Sunday 3-5 AM. All services will be temporarily unavailable."')
          },
          {
            text: 'System Update',
            onPress: () => Alert.alert('Update', 'System update notification sent.\n\n"New software version 2.1.5 available. Update will be deployed during next maintenance window."')
          },
          {
            text: 'Emergency Notice',
            onPress: () => Alert.alert('Emergency', 'Emergency notification sent to all agents and printers.\n\n"URGENT: Immediate system alert requires attention."')
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const handleNotifications = () => {
    if (Platform.OS === 'web') {
      alert('Notifications (3)\n\n🟡 Printer PRT-112 low ink (2 mins ago)\n   Black: 12% | Color: 8%\n\n🔴 5 new pending orders (5 mins ago)\n   Require immediate assignment\n\n🔵 System update available (1 hour ago)\n   Version 2.1.5 ready to deploy');
    } else {
      Alert.alert(
        'Notifications (3)',
        '🟡 Printer PRT-112 low ink (2 mins ago)\n\n🔴 5 new pending orders (5 mins ago)\n\n🔵 System update available (1 hour ago)',
        [
          { text: 'View All', onPress: () => router.push('/notifications') },
          { text: 'Dismiss' }
        ]
      );
    }
  };

  const metrics = [
    { label: 'Active Printers', value: '1,284', change: '+12%', icon: 'print', color: ADMIN },
    { label: 'Pending Orders', value: '42', change: 'High', icon: 'pending-actions', color: theme.warning },
    { label: 'Delivery Orders', value: '318', change: 'On Time', icon: 'local-shipping', color: theme.success },
    { label: 'Online Agents', value: '156', change: 'Stable', icon: 'support-agent', color: '#A78BFA' },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Console</Text>
          <Text style={styles.title}>Print-Xpress</Text>
        </View>
        <Pressable
          style={styles.notificationButton}
          onPress={handleNotifications}
        >
          <MaterialIcons name="notifications" size={24} color={theme.textPrimary} />
          <View style={styles.badge} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickActions}>
            <Pressable
              style={styles.actionButton}
              onPress={handleAddPrinter}
            >
              <MaterialIcons name="add-circle" size={24} color={ADMIN} />
              <Text style={styles.actionText}>Add Printer</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={handleBroadcastAlert}
            >
              <MaterialIcons name="campaign" size={24} color="#FFF" />
              <Text style={[styles.actionText, styles.actionTextWhite]}>Broadcast Alert</Text>
            </Pressable>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operations Hub</Text>
          <View style={styles.metricsGrid}>
            {metrics.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIcon, { backgroundColor: `${metric.color}15` }]}>
                    <MaterialIcons name={metric.icon as any} size={28} color={metric.color} />
                  </View>
                  <View style={styles.changeBadge}>
                    <Text style={styles.changeText}>{metric.change}</Text>
                  </View>
                </View>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Network Status */}
        <View style={styles.section}>
          <Pressable style={styles.statusCard}>
            <LinearGradient
              colors={[ADMIN, ADMIN_DARK]}
              style={styles.statusGradient}
            >
              <View style={styles.statusContent}>
                <View style={styles.statusHeader}>
                  <Text style={styles.statusLabel}>Network Status</Text>
                  <View style={styles.statusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusBadgeText}>Healthy</Text>
                  </View>
                </View>
                <Text style={styles.statusTitle}>System Monitor</Text>
                <View style={styles.statusMetrics}>
                  <View style={styles.statusMetric}>
                    <Text style={styles.statusMetricLabel}>Uptime</Text>
                    <Text style={styles.statusMetricValue}>99.98%</Text>
                  </View>
                  <View style={styles.statusDivider} />
                  <View style={styles.statusMetric}>
                    <Text style={styles.statusMetricLabel}>Latency</Text>
                    <Text style={styles.statusMetricValue}>12ms</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Pressable onPress={() => alert('Activity Logs\n\nAll system events:\n• Printer status changes\n• Agent activity\n• System updates\n• Order completions\n• Error notifications\n\nView detailed logs in System Monitor.')}>
              <Text style={styles.viewAll}>View All</Text>
            </Pressable>
          </View>

          <View style={styles.activityList}>
            {[
              { icon: 'check-circle', text: 'Printer P-882 Online', time: '2 mins ago', color: theme.success },
              { icon: 'warning', text: 'Ink Level Critical', time: '14 mins ago', color: theme.error },
              { icon: 'update', text: 'System Update Complete', time: '1 hr ago', color: ADMIN },
            ].map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: `${activity.color}15` }]}>
                  <MaterialIcons name={activity.icon as any} size={20} color={activity.color} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>{activity.text}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
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
  greeting: {
    fontSize: 12,
    fontWeight: '600',
    color: ADMIN,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.error,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: ADMIN,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: theme.border,
  },
  actionButtonPrimary: {
    backgroundColor: ADMIN,
    borderColor: ADMIN,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  actionTextWhite: {
    color: '#FFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow.small,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: theme.backgroundSecondary,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.textSecondary,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  statusCard: {
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadow.medium,
  },
  statusGradient: {
    padding: 24,
  },
  statusContent: {
    gap: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  statusMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusMetric: {
    flex: 1,
  },
  statusMetricLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  statusMetricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  statusDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activityList: {
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: theme.textSecondary,
  },
});
