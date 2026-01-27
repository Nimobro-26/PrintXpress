// Print Delivery Options Screen
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { usePrint } from '../contexts/PrintContext';

type PackagingType = 'standard' | 'premium';

export default function DeliveryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentDocument } = usePrint();
  
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingType>('standard');
  const [deliveryAddress, setDeliveryAddress] = useState({
    label: 'Home Address',
    address: '123 Sunshine Blvd, Los Angeles, CA 90001',
    distance: 2.5, // km
  });

  // Calculate charges
  const printingCost = currentDocument ? (currentDocument.pages || 12) * 0.10 : 4.50;
  const filesCount = 3;
  const deliveryFee = filesCount >= 5 ? 0 : deliveryAddress.distance * 0.80; // $0.80 per km
  const packagingCost = selectedPackaging === 'premium' ? 1.50 : 0;
  const totalAmount = printingCost + deliveryFee + packagingCost;

  const handleChangeAddress = () => {
    Alert.alert('Change Address', 'Address management coming soon');
  };

  const handleConfirm = () => {
    router.push('/payment');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Delivery Options</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoIcon}>
            <MaterialIcons name="local-shipping" size={28} color="#1565C0" />
          </View>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Free Delivery Promo</Text>
            <Text style={styles.promoText}>Print 5+ documents and get delivery for free!</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          
          <View style={styles.addressCard}>
            <View style={styles.addressIcon}>
              <MaterialIcons name="location-on" size={28} color={theme.primary} />
            </View>
            <View style={styles.addressContent}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressLabel}>{deliveryAddress.label}</Text>
                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceText}>{deliveryAddress.distance}km</Text>
                </View>
              </View>
              <Text style={styles.addressText}>{deliveryAddress.address}</Text>
            </View>
            <Pressable style={styles.changeButton} onPress={handleChangeAddress}>
              <Text style={styles.changeButtonText}>Change</Text>
            </Pressable>
          </View>
        </View>

        {/* Packaging Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Packaging Options</Text>

          {/* Standard Envelope */}
          <Pressable
            style={[
              styles.packagingCard,
              selectedPackaging === 'standard' && styles.packagingCardSelected,
            ]}
            onPress={() => setSelectedPackaging('standard')}
          >
            <View style={styles.radioButton}>
              {selectedPackaging === 'standard' ? (
                <View style={styles.radioButtonInner} />
              ) : null}
            </View>
            <View style={styles.packagingContent}>
              <Text style={styles.packagingTitle}>Sealed Envelope</Text>
              <Text style={styles.packagingDescription}>
                Standard protection for your prints
              </Text>
            </View>
            <Text style={styles.packagingPrice}>FREE</Text>
          </Pressable>

          {/* Premium Envelope */}
          <Pressable
            style={[
              styles.packagingCard,
              selectedPackaging === 'premium' && styles.packagingCardSelected,
            ]}
            onPress={() => setSelectedPackaging('premium')}
          >
            <View style={styles.radioButton}>
              {selectedPackaging === 'premium' ? (
                <View style={styles.radioButtonInner} />
              ) : null}
            </View>
            <View style={styles.packagingContent}>
              <Text style={styles.packagingTitle}>Tamper-Proof (Premium)</Text>
              <Text style={styles.packagingDescription}>
                Enhanced privacy for sensitive documents
              </Text>
            </View>
            <Text style={styles.packagingPricePaid}>$1.50</Text>
          </Pressable>

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <MaterialIcons name="shield" size={16} color={theme.textSecondary} />
            <Text style={styles.privacyText}>
              Privacy Note: All documents are handled with strict confidentiality.
            </Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Printing ({filesCount} files)</Text>
            <Text style={styles.summaryValue}>${printingCost.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <View style={styles.distanceTag}>
                <Text style={styles.distanceTagText}>{deliveryAddress.distance}km</Text>
              </View>
            </View>
            <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Packaging</Text>
            <Text style={styles.summaryValue}>${packagingCost.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryTotal}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <MaterialIcons name="lock" size={16} color={theme.textSecondary} />
          <Text style={styles.securityText}>
            Secure OTP will be required at delivery
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm Delivery & Proceed</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
        </Pressable>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: '#FFF',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.large,
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  promoIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 2,
  },
  promoText: {
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 12,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow.small,
  },
  addressIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  distanceBadge: {
    backgroundColor: theme.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  addressText: {
    fontSize: 13,
    color: theme.textSecondary,
    lineHeight: 18,
  },
  changeButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.medium,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
  },
  packagingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.border,
  },
  packagingCardSelected: {
    borderColor: theme.primary,
    backgroundColor: '#F8FAFB',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.primary,
  },
  packagingContent: {
    flex: 1,
  },
  packagingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  packagingDescription: {
    fontSize: 13,
    color: theme.textSecondary,
    lineHeight: 18,
  },
  packagingPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
  },
  packagingPricePaid: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.textSecondary,
    lineHeight: 16,
  },
  summaryCard: {
    backgroundColor: '#F8FAFB',
    borderRadius: theme.borderRadius.large,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  distanceTag: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  distanceTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4338CA',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 12,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1565C0',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  securityText: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingHorizontal: 24,
    paddingTop: 16,
    ...theme.shadow.large,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    paddingVertical: 16,
    borderRadius: theme.borderRadius.large,
    gap: 8,
    ...theme.shadow.medium,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
