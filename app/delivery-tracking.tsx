// Delivery Tracking Screen
import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert, Platform, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Image } from 'expo-image';
import { theme } from '../constants/theme';

type DeliveryStatus = 'confirmed' | 'picked_up' | 'out_for_delivery' | 'nearby' | 'delivered';

export default function DeliveryTrackingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
  const [currentStatus, setCurrentStatus] = useState<DeliveryStatus>('out_for_delivery');
  const [timeRemaining, setTimeRemaining] = useState(12 * 60); // 12 minutes in seconds
  const [deliveryPartnerLocation, setDeliveryPartnerLocation] = useState({
    latitude: 34.0522,
    longitude: -118.2437,
  });

  const userLocation = {
    latitude: 34.0489,
    longitude: -118.2520,
  };

  const deliveryPartner = {
    name: 'David Wilson',
    photo: 'https://i.pravatar.cc/150?img=12',
    rating: 4.8,
    phone: '+1 (555) 123-4567',
    vehicleType: 'Bike',
    vehicleNumber: 'CA 1234',
  };

  const statusSteps: { status: DeliveryStatus; label: string; icon: string }[] = [
    { status: 'confirmed', label: 'Order Confirmed', icon: 'check-circle' },
    { status: 'picked_up', label: 'Picked Up', icon: 'inventory' },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: 'local-shipping' },
    { status: 'delivered', label: 'Delivered', icon: 'done-all' },
  ];

  // Simulate live location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryPartnerLocation(prev => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.0005,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.0005,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCall = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Call', `Calling ${deliveryPartner.phone}`);
    } else {
      Linking.openURL(`tel:${deliveryPartner.phone}`);
    }
  };

  const handleMessage = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Message', 'Messaging feature coming soon');
    } else {
      Linking.openURL(`sms:${deliveryPartner.phone}`);
    }
  };

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.status === currentStatus);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Track Delivery</Text>
        <Pressable style={styles.refreshButton}>
          <MaterialIcons name="refresh" size={20} color={theme.primary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: (deliveryPartnerLocation.latitude + userLocation.latitude) / 2,
              longitude: (deliveryPartnerLocation.longitude + userLocation.longitude) / 2,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {/* Delivery Partner Marker */}
            <Marker coordinate={deliveryPartnerLocation}>
              <View style={styles.deliveryMarker}>
                <MaterialIcons name="directions-bike" size={20} color="#FFF" />
              </View>
            </Marker>

            {/* User Location Marker */}
            <Marker coordinate={userLocation}>
              <View style={styles.userMarker}>
                <MaterialIcons name="home" size={20} color="#FFF" />
              </View>
            </Marker>
          </MapView>

          {/* ETA Card Overlay */}
          <View style={styles.etaCard}>
            <View style={styles.etaContent}>
              <MaterialIcons name="schedule" size={24} color={theme.primary} />
              <View style={styles.etaText}>
                <Text style={styles.etaTime}>{formatTime(timeRemaining)}</Text>
                <Text style={styles.etaLabel}>Estimated Arrival</Text>
              </View>
            </View>
            <View style={styles.etaLive}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
        </View>

        {/* Status Timeline */}
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>Delivery Status</Text>
          
          <View style={styles.timeline}>
            {statusSteps.map((step, index) => {
              const isCompleted = index <= getCurrentStepIndex();
              const isCurrent = index === getCurrentStepIndex();
              
              return (
                <View key={step.status} style={styles.timelineItem}>
                  <View style={styles.timelineIconContainer}>
                    <View style={[
                      styles.timelineIcon,
                      isCompleted && styles.timelineIconCompleted,
                      isCurrent && styles.timelineIconCurrent,
                    ]}>
                      <MaterialIcons
                        name={step.icon as any}
                        size={20}
                        color={isCompleted ? '#FFF' : theme.textTertiary}
                      />
                    </View>
                    {index < statusSteps.length - 1 && (
                      <View style={[
                        styles.timelineLine,
                        isCompleted && styles.timelineLineCompleted,
                      ]} />
                    )}
                  </View>
                  <Text style={[
                    styles.timelineLabel,
                    isCompleted && styles.timelineLabelCompleted,
                    isCurrent && styles.timelineLabelCurrent,
                  ]}>
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Delivery Partner Card */}
        <View style={styles.partnerContainer}>
          <Text style={styles.sectionTitle}>Delivery Partner</Text>
          
          <View style={styles.partnerCard}>
            <View style={styles.partnerInfo}>
              <Image
                source={{ uri: deliveryPartner.photo }}
                style={styles.partnerPhoto}
                contentFit="cover"
              />
              <View style={styles.partnerDetails}>
                <Text style={styles.partnerName}>{deliveryPartner.name}</Text>
                <View style={styles.partnerRating}>
                  <MaterialIcons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.ratingText}>{deliveryPartner.rating}</Text>
                </View>
                <View style={styles.vehicleInfo}>
                  <MaterialIcons name="directions-bike" size={14} color={theme.textSecondary} />
                  <Text style={styles.vehicleText}>
                    {deliveryPartner.vehicleType} • {deliveryPartner.vehicleNumber}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.partnerActions}>
              <Pressable style={styles.actionButton} onPress={handleCall}>
                <MaterialIcons name="phone" size={20} color={theme.primary} />
                <Text style={styles.actionButtonText}>Call</Text>
              </Pressable>
              <View style={styles.actionDivider} />
              <Pressable style={styles.actionButton} onPress={handleMessage}>
                <MaterialIcons name="message" size={20} color={theme.primary} />
                <Text style={styles.actionButtonText}>Message</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Delivery Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <MaterialIcons name="location-on" size={20} color={theme.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Delivery Address</Text>
                <Text style={styles.detailValue}>123 Sunshine Blvd, Los Angeles, CA 90001</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <MaterialIcons name="inventory" size={20} color={theme.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Package</Text>
                <Text style={styles.detailValue}>Standard Sealed Envelope</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <MaterialIcons name="receipt" size={20} color={theme.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Order ID</Text>
                <Text style={styles.detailValue}>#PX2026012801</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.helpContainer}>
          <Pressable style={styles.helpButton}>
            <MaterialIcons name="help-outline" size={20} color={theme.primary} />
            <Text style={styles.helpText}>Need Help?</Text>
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
  refreshButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    height: 280,
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  deliveryMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    ...theme.shadow.large,
  },
  userMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    ...theme.shadow.medium,
  },
  etaCard: {
    position: 'absolute',
    top: 16,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    padding: 16,
    ...theme.shadow.large,
  },
  etaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  etaText: {
    gap: 2,
  },
  etaTime: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.primary,
  },
  etaLabel: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  etaLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  timelineContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 16,
  },
  timeline: {
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineIconContainer: {
    alignItems: 'center',
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.border,
  },
  timelineIconCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  timelineIconCurrent: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.border,
    marginVertical: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#10B981',
  },
  timelineLabel: {
    fontSize: 15,
    color: theme.textTertiary,
    paddingTop: 10,
    paddingBottom: 20,
  },
  timelineLabelCompleted: {
    color: theme.textPrimary,
    fontWeight: '600',
  },
  timelineLabelCurrent: {
    color: theme.primary,
    fontWeight: '700',
  },
  partnerContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  partnerCard: {
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  partnerInfo: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  partnerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  partnerDetails: {
    flex: 1,
    gap: 4,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  partnerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vehicleText: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  partnerActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.primary,
  },
  actionDivider: {
    width: 1,
    backgroundColor: theme.border,
  },
  detailsContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.large,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailContent: {
    flex: 1,
    gap: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  detailDivider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 12,
  },
  helpContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  helpText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.primary,
  },
});
