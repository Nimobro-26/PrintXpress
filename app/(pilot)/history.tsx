// Print Pilot Delivery History
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function PilotHistoryScreen() {
  const insets = useSafeAreaInsets();

  const history = [
    { id: 'ORD-99422', date: 'Oct 25, 2023', destination: '882 Tech Plaza', status: 'completed', amount: '$4.80', pages: 42, time: '14:32' },
    { id: 'ORD-88219', date: 'Oct 24, 2023', destination: '102 Industrial Way', status: 'completed', amount: '$3.20', pages: 12, time: '09:15' },
    { id: 'ORD-77510', date: 'Oct 22, 2023', destination: '45 Maple Avenue', status: 'cancelled', amount: '$0.00', pages: 0, time: '--' },
  ];

  const handleViewReceipt = (orderId: string) => {
    alert(`Receipt for Order ${orderId}\n\nThis would open a detailed receipt view with pickup time, delivery time, customer signature, and payment details.`);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Delivery History</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Deliveries</Text>
          <Text style={styles.summaryValue}>1,284</Text>
          <View style={styles.changeBadge}>
            <MaterialIcons name="trending-up" size={12} color={theme.success} />
            <Text style={styles.changeText}>+12%</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.historyList}>
          {history.map((item) => (
            <Pressable
              key={item.id}
              style={styles.historyCard}
              onPress={() => handleViewReceipt(item.id)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <MaterialIcons 
                    name={item.status === 'completed' ? 'check-circle' : 'cancel'} 
                    size={32} 
                    color={item.status === 'completed' ? theme.success : theme.error} 
                  />
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.orderId}>#{item.id}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: item.status === 'completed' ? '#D1FAE5' : '#FEE2E2' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: item.status === 'completed' ? theme.success : theme.error }
                      ]}>
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </View>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Destination</Text>
                  <Text style={styles.detailValue}>{item.destination}</Text>
                </View>
                {item.status === 'completed' && (
                  <>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Pages</Text>
                      <Text style={styles.detailValue}>{item.pages}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Delivery Time</Text>
                      <Text style={styles.detailValue}>{item.time}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Earned</Text>
                      <Text style={[styles.detailValue, styles.earningValue]}>{item.amount}</Text>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.cardFooter}>
                <MaterialIcons name="receipt-long" size={16} color={theme.primary} />
                <Text style={styles.receiptText}>Tap to view receipt</Text>
              </View>
            </Pressable>
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
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
    borderColor: theme.border,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 8,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.success,
  },
  historyList: {
    marginTop: 24,
    gap: 16,
  },
  historyCard: {
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow.small,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  cardDetails: {
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  earningValue: {
    color: theme.success,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  receiptText: {
    fontSize: 12,
    color: theme.primary,
    fontWeight: '600',
  },
});
