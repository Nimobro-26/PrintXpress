// Upload Document Screen
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { usePrint } from '../contexts/PrintContext';

export default function UploadScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { uploadDocument, loading } = usePrint();

  const handleUpload = async (source: string) => {
    try {
      // Mock file selection
      const mockFile = {
        name: 'Assignment_Final_V2.pdf',
        size: 2.4,
        uri: 'mock://file.pdf',
        type: 'pdf',
        pages: 12,
      };

      await uploadDocument(mockFile);
      router.push('/settings');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const uploadOptions = [
    {
      id: 'phone',
      icon: 'smartphone',
      title: 'Phone Storage',
      description: 'Files, Downloads, Gallery',
      color: '#1976D2',
      bgColor: '#E3F2FD',
    },
    {
      id: 'camera',
      icon: 'document-scanner',
      title: 'Camera Scan',
      description: 'Scan physical documents',
      color: '#388E3C',
      bgColor: '#E8F5E9',
    },
    {
      id: 'cloud',
      icon: 'cloud-upload',
      title: 'Cloud Drive',
      description: 'Google Drive, Dropbox, iCloud',
      color: '#7B1FA2',
      bgColor: '#F3E5F5',
    },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Upload Document</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <MaterialIcons name="print" size={64} color={theme.primary} />
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Select Source</Text>
          <Text style={styles.instructionsText}>
            Choose how you want to upload your document for printing.
          </Text>
        </View>

        {/* Upload Options */}
        <View style={styles.optionsContainer}>
          {uploadOptions.map((option) => (
            <Pressable
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleUpload(option.id)}
              disabled={loading}
            >
              <View style={[styles.optionIcon, { backgroundColor: option.bgColor }]}>
                <MaterialIcons name={option.icon as any} size={32} color={option.color} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textTertiary} />
            </Pressable>
          ))}
        </View>

        {/* Supported Formats */}
        <View style={styles.formatsContainer}>
          <Text style={styles.formatsLabel}>Supported Formats</Text>
          <View style={styles.formatsList}>
            {['PDF', 'DOCX', 'JPG', 'PNG'].map((format) => (
              <View key={format} style={styles.formatChip}>
                <Text style={styles.formatText}>{format}</Text>
              </View>
            ))}
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  instructions: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow.small,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  formatsContainer: {
    marginTop: 'auto',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.backgroundSecondary,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: 'dashed',
  },
  formatsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12,
  },
  formatsList: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  formatChip: {
    alignItems: 'center',
  },
  formatText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.textTertiary,
  },
});
