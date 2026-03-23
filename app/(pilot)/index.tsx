// Print Pilot Dashboard
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../constants/theme';

export default function PilotDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isOnDuty, setIsOnDuty] = useState(true);

  const stats = [
    { label: 'Orders Delivered', value: '24', change: '+12%', icon: 'local-shipping', color: theme.success },
    { label: 'Total Earnings', value: '$482.50', change: 'Today', icon: 'payments', color: theme.primary },
    { label: 'Current Rating', value: '4.92', change: '★', icon: 'star', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Print Pilot</Text>
          <Text style={styles.title}>Welcome back, Alex</Text>
        </View>
        <Pressable 
          style={styles.avatarButton}
          onPress={() => router.push('/(pilot)/profile')}
        >
          <MaterialIcons name="person" size={24} color={theme.textSecondary} />
          <View style={styles.onlineIndicator} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <LinearGradient
            colors={isOnDuty ? ['#047857', '#059669'] : ['#6B7280', '#9CA3AF']}
            style={styles.statusGradient}
          >
            <View style={styles.statusHeader}>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, !isOnDuty && { backgroundColor: '#9CA3AF' }]} />
                <Text style={styles.statusText}>{isOnDuty ? 'Active Duty' : 'Off Duty'}</Text>
              </View>
              <Switch
                value={isOnDuty}
                onValueChange={setIsOnDuty}
                trackColor={{ false: '#D1D5DB', true: '#34D399' }}
                thumbColor="#FFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>
            <Text style={styles.statusTitle}>
              {isOnDuty
                ? 'Your next priority hub is ready for dispatch'
                : 'Go online to start receiving delivery requests'}
            </Text>
            {isOnDuty && (
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push('/(pilot)/requests')}
              >
                <Text style={styles.actionButtonText}>Go To Active Queue</Text>
                <MaterialIcons name="arrow-forward" size={18} color={theme.success} />
              </Pressable>
            )}
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <MaterialIcons name={stat.icon as any} size={28} color={stat.color} />
                </View>
                <View style={styles.changeBadge}>
                  <Text style={styles.changeText}>{stat.change}</Text>
                </View>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Zone Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zone Overview</Text>
          <View style={styles.zoneCard}>
            <View style={styles.zoneContent}>
              <MaterialIcons name="location-on" size={32} color={theme.success} />
              <View style={styles.zoneInfo}>
                <Text style={styles.zoneName}>Zone 7 - Delta</Text>
                <Text style={styles.zoneDetails}>Optimized Route • 4h 12m shift</Text>
              </View>
            </View>
            <View style={styles.zoneStats}>
              <View style={styles.zoneStat}>
                <Text style={styles.zoneStatValue}>18</Text>
                <Text style={styles.zoneStatLabel}>Agents Online</Text>
              </View>
              <View style={styles.zoneDivider} />
              <View style={styles.zoneStat}>
                <Text style={styles.zoneStatValue}>98.4%</Text>
                <Text style={styles.zoneStatLabel}>Efficiency</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <Pressable
              style={styles.quickAction}
              onPress={() => router.push('/(pilot)/requests')}
            >
              <MaterialIcons name="navigation" size={32} color={theme.primary} />
              <Text style={styles.quickActionText}>Navigate</Text>
            </Pressable>
            <Pressable
              style={styles.quickAction}
              onPress={() => alert('Scan OTP code from customer')}
            >
              <MaterialIcons name="qr-code-scanner" size={32} color={theme.primary} />
              <Text style={styles.quickActionText}>Scan OTP</Text>
            </Pressable>
            <Pressable
              style={styles.quickAction}
              onPress={() => alert('Contact Support: +1-555-PILOT (74568)')}
            >
              <MaterialIcons name="call" size={32} color={theme.primary} />
              <Text style={styles.quickActionText}>Contact</Text>
            </Pressable>
            <Pressable
              style={styles.quickAction}
              onPress={() => alert('Help Center\n\n1. How to accept orders\n2. Delivery guidelines\n3. OTP verification\n4. Payment issues')}
            >
              <MaterialIcons name="help" size={32} color={theme.primary} />
              <Text style={styles.quickActionText}>Help</Text>
            </Pressable>
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
    color: theme.success,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.success,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  statusCard: {
    marginTop: 24,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadow.medium,
  },
  statusGradient: {
    padding: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },

  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: theme.borderRadius.medium,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.success,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow.small,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statIcon: {
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
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 12,
  },
  zoneCard: {
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow.small,
  },
  zoneContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  zoneDetails: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  zoneStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  zoneStat: {
    flex: 1,
    alignItems: 'center',
  },
  zoneStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  zoneStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  zoneDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.border,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    width: '48%',
    aspectRatio: 1.5,
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow.small,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
  },
});
