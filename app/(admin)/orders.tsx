// Admin Orders Management Screen
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function AdminOrdersScreen() {
  const insets = useSafeAreaInsets();

  const orders = [
    { id: 'PX-9921', customer: 'Marcus Thorne', status: 'pending', pages: 42, type: 'Delivery' },
    { id: 'PX-9918', customer: 'Sarah Jenkins', status: 'printing', pages: 12, type: 'ATM Pickup' },
    { id: 'PX-9905', customer: 'Elena Rodriguez', status: 'delivery', pages: 156, type: 'Delivery' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return theme.warning;
      case 'printing': return theme.primary;
      case 'delivery': return theme.success;
      default: return theme.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'PENDING';
      case 'printing': return 'PRINTING';
      case 'delivery': return 'OUT FOR DELIVERY';
      default: return status.toUpperCase();
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders Management</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <Pressable style={styles.filterActive}>
            <Text style={styles.filterTextActive}>All</Text>
          </Pressable>
          <Pressable style={styles.filter}>
            <Text style={styles.filterText}>Pending</Text>
          </Pressable>
          <Pressable style={styles.filter}>
            <Text style={styles.filterText}>Active</Text>
          </Pressable>
          <Pressable style={styles.filter}>
            <Text style={styles.filterText}>Completed</Text>
          </Pressable>
        </View>

        {/* Orders List */}
        <View style={styles.ordersList}>
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{order.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {getStatusLabel(order.status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.customerName}>{order.customer}</Text>
              <Text style={styles.orderType}>Type: {order.type}</Text>

              <View style={styles.orderMeta}>
                <View style={styles.metaItem}>
                  <MaterialIcons name="description" size={16} color={theme.primary} />
                  <Text style={styles.metaText}>{order.pages} Pages</Text>
                </View>
              </View>

              <View style={styles.orderActions}>
                <Pressable style={styles.primaryAction}>
                  <Text style={styles.primaryActionText}>View Details</Text>
                </Pressable>
                <Pressable style={styles.secondaryAction}>
                  <Text style={styles.secondaryActionText}>Reassign</Text>
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
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    marginBottom: 20,
  },
  filter: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.backgroundSecondary,
  },
  filterActive: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  filterTextActive: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  ordersList: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow.small,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.textSecondary,
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  orderType: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 12,
  },
  orderMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.medium,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: theme.primary,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: theme.backgroundSecondary,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.textPrimary,
  },
});
