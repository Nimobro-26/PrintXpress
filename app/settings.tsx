// Print Configuration Screen - Configure current print job
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { usePrint } from '../contexts/PrintContext';

type ColorMode = 'bw' | 'color';
type PageSize = 'A4' | 'A5' | 'Letter' | 'Legal';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentJob, updatePrintSettings } = usePrint();
  
  const [colorMode, setColorMode] = useState<ColorMode>('bw');
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [copies, setCopies] = useState(1);
  const [pageRange, setPageRange] = useState('');
  const [highQuality, setHighQuality] = useState(true);

  if (!currentJob) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.emptyState}>
          <MaterialIcons name="description" size={64} color={theme.textTertiary} />
          <Text style={styles.emptyText}>No document selected</Text>
          <Pressable style={styles.emptyButton} onPress={() => router.back()}>
            <Text style={styles.emptyButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate price
  const basePrice = colorMode === 'bw' ? 0.10 : 0.30;
  const qualityMultiplier = highQuality ? 1.2 : 1.0;
  const pagesToPrint = pageRange ? 5 : currentJob.totalPages; // Simplified calculation
  const totalPrice = (basePrice * pagesToPrint * copies * qualityMultiplier).toFixed(2);

  const handleProceed = () => {
    // Update print settings in context
    updatePrintSettings({
      colorMode: colorMode === 'bw' ? 'bw' : 'color',
      paperSize: pageSize.toLowerCase() as any,
      copies,
      highQuality,
    });
    router.push('/delivery');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Print Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Info */}
        <View style={styles.documentCard}>
          <View style={styles.documentIcon}>
            <MaterialIcons 
              name={currentJob.fileType === 'pdf' ? 'picture-as-pdf' : 'description'} 
              size={24} 
              color={theme.primary} 
            />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentName} numberOfLines={1}>
              {currentJob.fileName}
            </Text>
            <Text style={styles.documentDetails}>
              {currentJob.totalPages} pages • {currentJob.fileSize.toFixed(1)} MB
            </Text>
          </View>
        </View>

        {/* Color Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Print Color</Text>
          <View style={styles.toggleContainer}>
            <Pressable
              style={[
                styles.toggleButton,
                colorMode === 'bw' && styles.toggleButtonActive,
              ]}
              onPress={() => setColorMode('bw')}
            >
              <Text style={[
                styles.toggleButtonText,
                colorMode === 'bw' && styles.toggleButtonTextActive,
              ]}>
                B&W
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleButton,
                colorMode === 'color' && styles.toggleButtonActive,
              ]}
              onPress={() => setColorMode('color')}
            >
              <Text style={[
                styles.toggleButtonText,
                colorMode === 'color' && styles.toggleButtonTextActive,
              ]}>
                Color
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Page Size */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Page Size</Text>
          <View style={styles.selectContainer}>
            <Text style={styles.selectValue}>{pageSize} (Standard)</Text>
            <MaterialIcons name="expand-more" size={24} color={theme.textTertiary} />
          </View>
        </View>

        {/* Copies and Page Range */}
        <View style={styles.rowSection}>
          {/* Copies */}
          <View style={styles.halfSection}>
            <Text style={styles.sectionLabel}>Copies</Text>
            <View style={styles.counterContainer}>
              <Pressable
                style={styles.counterButton}
                onPress={() => setCopies(Math.max(1, copies - 1))}
              >
                <MaterialIcons name="remove" size={20} color={theme.primary} />
              </Pressable>
              <Text style={styles.counterValue}>{copies}</Text>
              <Pressable
                style={styles.counterButton}
                onPress={() => setCopies(Math.min(10, copies + 1))}
              >
                <MaterialIcons name="add" size={20} color={theme.primary} />
              </Pressable>
            </View>
          </View>

          {/* Page Range */}
          <View style={styles.halfSection}>
            <Text style={styles.sectionLabel}>Page Range</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputPlaceholder}>
                {pageRange || 'All'}
              </Text>
            </View>
          </View>
        </View>

        {/* High Quality */}
        <Pressable
          style={styles.qualityCard}
          onPress={() => setHighQuality(!highQuality)}
        >
          <View style={styles.qualityContent}>
            <MaterialIcons name="high-quality" size={24} color={theme.textSecondary} />
            <Text style={styles.qualityLabel}>High Quality Print</Text>
          </View>
          <View style={[styles.switch, highQuality && styles.switchActive]}>
            <View style={[styles.switchThumb, highQuality && styles.switchThumbActive]} />
          </View>
        </Pressable>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Estimated Price</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceValue}>${totalPrice}</Text>
            <Text style={styles.priceUnit}>(${basePrice}/page)</Text>
          </View>
        </View>
        <Pressable style={styles.proceedButton} onPress={handleProceed}>
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  emptyButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.medium,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: theme.borderRadius.large,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow.small,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  documentDetails: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundSecondary,
    borderRadius: theme.borderRadius.medium,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.small,
  },
  toggleButtonActive: {
    backgroundColor: '#FFF',
    ...theme.shadow.small,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  toggleButtonTextActive: {
    fontWeight: '600',
    color: theme.primary,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  rowSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  halfSection: {
    flex: 1,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  counterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.small,
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  inputContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.border,
  },
  inputPlaceholder: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  qualityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.border,
  },
  qualityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qualityLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.backgroundSecondary,
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: theme.primary,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    ...theme.shadow.small,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
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
  priceContainer: {
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 13,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  priceUnit: {
    fontSize: 13,
    color: theme.textTertiary,
  },
  proceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.large,
    gap: 8,
    ...theme.shadow.medium,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
