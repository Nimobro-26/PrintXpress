// Print Pilot Incoming Requests Screen
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function PilotRequestsScreen() {
  const insets = useSafeAreaInsets();

  const requests = [
    { id: 'PX-1024', priority: 'urgent', pickup: 'Downtown ATM', delivery: '123 College Ave', distance: 1.2, pages: 12, time: 15 },
    { id: 'PX-1025', priority: 'standard', pickup: 'East Side Hub', delivery: '455 Innovation Blvd', distance: 3.8, pages: 48, time: 25 },
    { id: 'PX-1026', priority: 'batch', pickup: 'Campus Library', delivery: 'Science Hall Annex', distance: 0.5, pages: 120, time: 8 },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return theme.error;
      case 'standard': return theme.textSecondary;
      case 'batch': return theme.success;
      default: return theme.textSecondary;
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Incoming Requests</Text>
        <Text style={styles.subtitle}>Real-time delivery dispatch</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.requestsList}>
          {requests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <Text style={styles.requestId}>#{request.id}</Text>
                <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(request.priority)}20` }]}>
                  {request.priority === 'urgent' && (
                    <MaterialIcons name="bolt" size={14} color={getPriorityColor(request.priority)} />
                  )}
                  <Text style={[styles.priorityText, { color: getPriorityColor(request.priority) }]}>
                    {request.priority.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Route */}
              <View style={styles.routeContainer}>
                <View style={styles.routeIndicators}>
                  <MaterialIcons name="location-on" size={20} color={theme.primary} />
                  <View style={styles.routeLine} />
                  <MaterialIcons name="flag" size={20} color={theme.success} />
                </View>
                <View style={styles.routeDetails}>
                  <View style={styles.routePoint}>
                    <Text style={styles.routeLabel}>PICKUP</Text>
                    <Text style={styles.routeValue}>{request.pickup}</Text>
                  </View>
                  <View style={styles.routePoint}>
                    <Text style={styles.routeLabel}>DELIVERY</Text>
                    <Text style={styles.routeValue}>{request.delivery}</Text>
                  </View>
                </View>
              </View>

              {/* Metrics */}
              <View style={styles.metricsContainer}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>DISTANCE</Text>
                  <Text style={styles.metricValue}>{request.distance} km</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>PAGES</Text>
                  <Text style={styles.metricValue}>{request.pages}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>EST. TIME</Text>
                  <Text style={styles.metricValue}>{request.time} mins</Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <Pressable style={styles.acceptButton}>
                  <Text style={styles.acceptButtonText}>Accept Order</Text>
                </Pressable>
                <Pressable style={styles.rejectButton}>
                  <Text style={styles.rejectButtonText}>Reject</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  requestsList: {
    marginTop: 24,
    gap: 16,
  },
  requestCard: {
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow.small,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  requestId: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.textSecondary,
    letterSpacing: 1,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  routeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  routeIndicators: {
    alignItems: 'center',
    paddingTop: 4,
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.border,
    marginVertical: 8,
  },
  routeDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  routePoint: {
    gap: 4,
  },
  routeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.textSecondary,
    letterSpacing: 0.5,
  },
  routeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.border,
    marginBottom: 16,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: theme.success,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  rejectButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.textPrimary,
  },
});
