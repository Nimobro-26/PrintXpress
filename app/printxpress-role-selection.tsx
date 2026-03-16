// Print-Xpress Role Selection Screen
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { printXpressTheme } from '../constants/printXpressTheme';
import { usePrintXpressAuth } from '../contexts/PrintXpressAuthContext';
import { UserRole } from '../types/printXpress';

interface RoleCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  role: UserRole;
  color: string;
  onSelect: () => void;
}

function RoleCard({ icon, title, description, color, onSelect }: RoleCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.roleCard,
        pressed && styles.roleCardPressed,
      ]}
      onPress={onSelect}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <MaterialIcons name={icon} size={48} color={color} />
      </View>
      
      <View style={styles.roleContent}>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>

      <View style={[styles.continueButton, { backgroundColor: color }]}>
        <Text style={styles.continueButtonText}>Continue</Text>
        <MaterialIcons name="arrow-forward" size={20} color="#fff" />
      </View>
    </Pressable>
  );
}

export default function PrintXpressRoleSelectionScreen() {
  const router = useRouter();
  const { selectRole } = usePrintXpressAuth();

  const handleRoleSelect = (role: UserRole) => {
    selectRole(role);
    
    // Navigate to appropriate dashboard
    if (role === 'user') {
      router.replace('/printxpress-user-home');
    } else if (role === 'pilot') {
      router.replace('/printxpress-pilot-dashboard');
    } else if (role === 'admin') {
      router.replace('/printxpress-admin-dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Your Role</Text>
          <Text style={styles.subtitle}>
            Choose how you'd like to use Print-Xpress
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {/* User Role */}
          <RoleCard
            icon="print"
            title="User"
            description="Upload files and print instantly at Print-Xpress ATM or request delivery."
            role="user"
            color={printXpressTheme.colors.primary}
            onSelect={() => handleRoleSelect('user')}
          />

          {/* Print Pilot Role */}
          <RoleCard
            icon="electric-bike"
            title="Print Pilot"
            description="Accept print delivery requests, collect printed documents from printers, and deliver them securely."
            role="pilot"
            color={printXpressTheme.colors.secondary}
            onSelect={() => handleRoleSelect('pilot')}
          />

          {/* Admin Role */}
          <RoleCard
            icon="admin-panel-settings"
            title="Admin"
            description="Manage printers, monitor orders, and control the Print-Xpress system."
            role="admin"
            color="#7C3AED"
            onSelect={() => handleRoleSelect('admin')}
          />
        </View>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <MaterialIcons name="info-outline" size={16} color={printXpressTheme.colors.textTertiary} />
          <Text style={styles.infoText}>
            You can switch roles anytime from your profile settings
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: printXpressTheme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    ...printXpressTheme.typography.headlineMedium,
    color: printXpressTheme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...printXpressTheme.typography.bodyLarge,
    color: printXpressTheme.colors.textSecondary,
    textAlign: 'center',
  },
  rolesContainer: {
    gap: 20,
  },
  roleCard: {
    backgroundColor: printXpressTheme.colors.surfaceContainerLowest,
    borderRadius: printXpressTheme.borderRadius.xl,
    padding: 24,
    gap: 20,
    borderWidth: 2,
    borderColor: printXpressTheme.colors.border,
    ...printXpressTheme.shadow.medium,
  },
  roleCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: printXpressTheme.borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleContent: {
    gap: 8,
  },
  roleTitle: {
    ...printXpressTheme.typography.titleLarge,
    color: printXpressTheme.colors.textPrimary,
    fontWeight: '700',
  },
  roleDescription: {
    ...printXpressTheme.typography.bodyMedium,
    color: printXpressTheme.colors.textSecondary,
    lineHeight: 22,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: printXpressTheme.borderRadius.large,
    gap: 8,
  },
  continueButtonText: {
    ...printXpressTheme.typography.titleMedium,
    color: '#fff',
    fontWeight: '700',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  infoText: {
    ...printXpressTheme.typography.bodySmall,
    color: printXpressTheme.colors.textTertiary,
    textAlign: 'center',
    flex: 1,
  },
});
