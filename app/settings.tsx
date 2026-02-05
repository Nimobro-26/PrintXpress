// Print Configuration Screen - Fully Interactive Settings
import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { usePrint } from '../contexts/PrintContext';

type ColorMode = 'bw' | 'color';
type PageSize = 'A4' | 'A3' | 'Letter' | 'Legal';
type PageRangeMode = 'all' | 'custom';

const PAGE_SIZE_OPTIONS = [
  { value: 'A4', label: 'A4 (Standard)', price: 1.0 },
  { value: 'A3', label: 'A3 (Large)', price: 1.5 },
  { value: 'Letter', label: 'Letter (8.5" x 11")', price: 1.0 },
  { value: 'Legal', label: 'Legal (8.5" x 14")', price: 1.2 },
];

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentJob, updatePrintSettings } = usePrint();
  
  const [colorMode, setColorMode] = useState<ColorMode>('bw');
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [pageSizeModalVisible, setPageSizeModalVisible] = useState(false);
  const [copies, setCopies] = useState(1);
  const [pageRangeMode, setPageRangeMode] = useState<PageRangeMode>('all');
  const [customPageRange, setCustomPageRange] = useState('');
  const [pageRangeError, setPageRangeError] = useState('');
  const [highQuality, setHighQuality] = useState(true);

  // Calculate pages to print based on range
  const calculatePagesToPrint = (): number => {
    if (!currentJob) return 0;
    
    if (pageRangeMode === 'all') {
      return currentJob.totalPages;
    }

    // Parse custom range (e.g., "1-5, 7, 9-12")
    if (!customPageRange.trim()) {
      setPageRangeError('Enter page range');
      return 0;
    }

    try {
      const ranges = customPageRange.split(',').map(r => r.trim());
      let totalPages = 0;
      
      for (const range of ranges) {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(n => parseInt(n.trim()));
          if (isNaN(start) || isNaN(end) || start < 1 || end > currentJob.totalPages || start > end) {
            setPageRangeError(`Invalid range: ${range}`);
            return 0;
          }
          totalPages += (end - start + 1);
        } else {
          const page = parseInt(range);
          if (isNaN(page) || page < 1 || page > currentJob.totalPages) {
            setPageRangeError(`Invalid page: ${range}`);
            return 0;
          }
          totalPages += 1;
        }
      }
      
      setPageRangeError('');
      return totalPages;
    } catch (error) {
      setPageRangeError('Invalid format');
      return 0;
    }
  };

  // Calculate price in real-time
  const calculatePrice = () => {
    if (!currentJob) return { total: 0, breakdown: { base: 0, size: 0, quality: 0, copies: 0 } };
    
    const pagesToPrint = calculatePagesToPrint();
    if (pagesToPrint === 0) return { total: 0, breakdown: { base: 0, size: 0, quality: 0, copies: 0 } };

    // Base price per page
    const basePrice = colorMode === 'bw' ? 0.10 : 0.30;
    
    // Page size multiplier
    const sizeOption = PAGE_SIZE_OPTIONS.find(opt => opt.value === pageSize);
    const sizeMultiplier = sizeOption?.price || 1.0;
    
    // Quality multiplier
    const qualityMultiplier = highQuality ? 1.2 : 1.0;
    
    // Calculate breakdown
    const baseTotal = basePrice * pagesToPrint;
    const sizeAdjustment = baseTotal * (sizeMultiplier - 1);
    const qualityAdjustment = baseTotal * (qualityMultiplier - 1);
    const copiesMultiplier = copies;
    
    const subtotal = baseTotal * sizeMultiplier * qualityMultiplier;
    const total = subtotal * copiesMultiplier;
    
    return {
      total,
      breakdown: {
        base: baseTotal,
        size: sizeAdjustment,
        quality: qualityAdjustment,
        copies: copiesMultiplier,
      },
      perPage: (subtotal / pagesToPrint),
      pages: pagesToPrint,
    };
  };

  const priceInfo = calculatePrice();

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

  const handleProceed = () => {
    if (pageRangeMode === 'custom' && pageRangeError) {
      return;
    }

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
          paddingBottom: insets.bottom + 140,
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
              <MaterialIcons 
                name="contrast" 
                size={20} 
                color={colorMode === 'bw' ? theme.primary : theme.textSecondary} 
              />
              <Text style={[
                styles.toggleButtonText,
                colorMode === 'bw' && styles.toggleButtonTextActive,
              ]}>
                B&W ($0.10/pg)
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleButton,
                colorMode === 'color' && styles.toggleButtonActive,
              ]}
              onPress={() => setColorMode('color')}
            >
              <MaterialIcons 
                name="palette" 
                size={20} 
                color={colorMode === 'color' ? theme.primary : theme.textSecondary} 
              />
              <Text style={[
                styles.toggleButtonText,
                colorMode === 'color' && styles.toggleButtonTextActive,
              ]}>
                Color ($0.30/pg)
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Page Size */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Page Size</Text>
          <Pressable 
            style={styles.selectContainer}
            onPress={() => setPageSizeModalVisible(true)}
          >
            <View style={styles.selectContent}>
              <MaterialIcons name="aspect-ratio" size={20} color={theme.textSecondary} />
              <Text style={styles.selectValue}>
                {PAGE_SIZE_OPTIONS.find(opt => opt.value === pageSize)?.label}
              </Text>
            </View>
            <MaterialIcons name="expand-more" size={24} color={theme.textTertiary} />
          </Pressable>
        </View>

        {/* Page Range */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Page Range</Text>
          
          <View style={styles.rangeToggleContainer}>
            <Pressable
              style={[
                styles.rangeToggleButton,
                pageRangeMode === 'all' && styles.rangeToggleButtonActive,
              ]}
              onPress={() => {
                setPageRangeMode('all');
                setPageRangeError('');
              }}
            >
              <Text style={[
                styles.rangeToggleText,
                pageRangeMode === 'all' && styles.rangeToggleTextActive,
              ]}>
                All Pages ({currentJob.totalPages})
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.rangeToggleButton,
                pageRangeMode === 'custom' && styles.rangeToggleButtonActive,
              ]}
              onPress={() => setPageRangeMode('custom')}
            >
              <Text style={[
                styles.rangeToggleText,
                pageRangeMode === 'custom' && styles.rangeToggleTextActive,
              ]}>
                Custom Range
              </Text>
            </Pressable>
          </View>

          {pageRangeMode === 'custom' && (
            <View style={styles.customRangeContainer}>
              <TextInput
                style={[
                  styles.customRangeInput,
                  pageRangeError && styles.customRangeInputError,
                ]}
                placeholder="e.g., 1-5, 7, 9-12"
                placeholderTextColor={theme.textTertiary}
                value={customPageRange}
                onChangeText={(text) => {
                  setCustomPageRange(text);
                  setPageRangeError('');
                }}
                keyboardType="default"
              />
              {pageRangeError ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{pageRangeError}</Text>
                </View>
              ) : (
                <Text style={styles.helperText}>
                  Format: 1-5, 7, 9-12 (Max: {currentJob.totalPages})
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Copies */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Number of Copies</Text>
          <View style={styles.counterContainer}>
            <Pressable
              style={[styles.counterButton, copies <= 1 && styles.counterButtonDisabled]}
              onPress={() => setCopies(Math.max(1, copies - 1))}
              disabled={copies <= 1}
            >
              <MaterialIcons 
                name="remove" 
                size={24} 
                color={copies <= 1 ? theme.textTertiary : theme.primary} 
              />
            </Pressable>
            <View style={styles.counterValueContainer}>
              <Text style={styles.counterValue}>{copies}</Text>
              <Text style={styles.counterLabel}>copies</Text>
            </View>
            <Pressable
              style={[styles.counterButton, copies >= 10 && styles.counterButtonDisabled]}
              onPress={() => setCopies(Math.min(10, copies + 1))}
              disabled={copies >= 10}
            >
              <MaterialIcons 
                name="add" 
                size={24} 
                color={copies >= 10 ? theme.textTertiary : theme.primary} 
              />
            </Pressable>
          </View>
        </View>

        {/* High Quality */}
        <Pressable
          style={styles.qualityCard}
          onPress={() => setHighQuality(!highQuality)}
        >
          <View style={styles.qualityContent}>
            <MaterialIcons name="high-quality" size={24} color={highQuality ? theme.primary : theme.textSecondary} />
            <View style={styles.qualityTextContainer}>
              <Text style={styles.qualityLabel}>High Quality Print</Text>
              <Text style={styles.qualityDescription}>Enhanced resolution (+20%)</Text>
            </View>
          </View>
          <View style={[styles.switch, highQuality && styles.switchActive]}>
            <View style={[styles.switchThumb, highQuality && styles.switchThumbActive]} />
          </View>
        </Pressable>

        {/* Price Breakdown */}
        {priceInfo.pages > 0 && (
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Price Calculation</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                {priceInfo.pages} pages × ${priceInfo.perPage.toFixed(2)}/page
              </Text>
              <Text style={styles.breakdownValue}>${(priceInfo.perPage * priceInfo.pages).toFixed(2)}</Text>
            </View>
            {copies > 1 && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>× {copies} copies</Text>
                <Text style={styles.breakdownValue}>×{copies}</Text>
              </View>
            )}
            {highQuality && (
              <View style={styles.breakdownHighlight}>
                <MaterialIcons name="auto-awesome" size={14} color="#F59E0B" />
                <Text style={styles.breakdownHighlightText}>High quality active</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceValue}>
              ${priceInfo.total.toFixed(2)}
            </Text>
            {priceInfo.pages > 0 && (
              <View style={styles.priceBadge}>
                <Text style={styles.priceBadgeText}>{priceInfo.pages} pages</Text>
              </View>
            )}
          </View>
        </View>
        <Pressable 
          style={[
            styles.proceedButton,
            (priceInfo.total === 0 || pageRangeError) && styles.proceedButtonDisabled,
          ]} 
          onPress={handleProceed}
          disabled={priceInfo.total === 0 || !!pageRangeError}
        >
          <Text style={styles.proceedButtonText}>Continue to Delivery</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
        </Pressable>
      </View>

      {/* Page Size Modal */}
      <Modal
        visible={pageSizeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPageSizeModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setPageSizeModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Page Size</Text>
              <Pressable onPress={() => setPageSizeModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.textPrimary} />
              </Pressable>
            </View>
            
            <View style={styles.modalOptions}>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.modalOption,
                    pageSize === option.value && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setPageSize(option.value as PageSize);
                    setPageSizeModalVisible(false);
                  }}
                >
                  <View style={styles.modalOptionContent}>
                    <Text style={[
                      styles.modalOptionText,
                      pageSize === option.value && styles.modalOptionTextSelected,
                    ]}>
                      {option.label}
                    </Text>
                    <View style={styles.modalOptionPriceBadge}>
                      <Text style={styles.modalOptionPriceText}>×{option.price.toFixed(1)}</Text>
                    </View>
                  </View>
                  {pageSize === option.value && (
                    <MaterialIcons name="check-circle" size={24} color={theme.primary} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.small,
  },
  toggleButtonActive: {
    backgroundColor: '#FFF',
    ...theme.shadow.small,
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  toggleButtonTextActive: {
    fontWeight: '700',
    color: theme.primary,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  rangeToggleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  rangeToggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 2,
    borderColor: theme.border,
    alignItems: 'center',
  },
  rangeToggleButtonActive: {
    borderColor: theme.primary,
    backgroundColor: '#E3F2FD',
  },
  rangeToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  rangeToggleTextActive: {
    color: theme.primary,
    fontWeight: '700',
  },
  customRangeContainer: {
    gap: 8,
  },
  customRangeInput: {
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 2,
    borderColor: theme.border,
    fontSize: 15,
    color: theme.textPrimary,
  },
  customRangeInputError: {
    borderColor: '#EF4444',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },
  helperText: {
    fontSize: 12,
    color: theme.textSecondary,
    paddingHorizontal: 4,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  counterButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.small,
    backgroundColor: theme.backgroundSecondary,
  },
  counterButtonDisabled: {
    opacity: 0.3,
  },
  counterValueContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  counterValue: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  counterLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
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
    marginBottom: 24,
  },
  qualityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  qualityTextContainer: {
    flex: 1,
  },
  qualityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  qualityDescription: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  switch: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.backgroundSecondary,
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: theme.primary,
  },
  switchThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF',
    ...theme.shadow.small,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  breakdownCard: {
    backgroundColor: '#F8FAFB',
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
    gap: 12,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  breakdownHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.small,
  },
  breakdownHighlightText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
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
    alignItems: 'center',
    gap: 12,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.primary,
  },
  priceBadge: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.full,
  },
  priceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
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
  proceedButtonDisabled: {
    opacity: 0.5,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  modalOptions: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 2,
    borderColor: theme.border,
  },
  modalOptionSelected: {
    borderColor: theme.primary,
    backgroundColor: '#E3F2FD',
  },
  modalOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  modalOptionTextSelected: {
    color: theme.primary,
    fontWeight: '700',
  },
  modalOptionPriceBadge: {
    backgroundColor: theme.backgroundSecondary,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.small,
  },
  modalOptionPriceText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
  },
});
