// Print-Xpress Login & OTP Verification Screen
import { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { printXpressTheme } from '../constants/printXpressTheme';
import { usePrintXpressAuth } from '../contexts/PrintXpressAuthContext';

export default function PrintXpressLoginScreen() {
  const router = useRouter();
  const { sendOTP, verifyOTP, isLoading } = usePrintXpressAuth();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const otpInputs = useRef<(TextInput | null)[]>([]);

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      await sendOTP('+91' + phoneNumber);
      setStep('otp');
      setTimeout(() => otpInputs.current[0]?.focus(), 300);
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      Alert.alert('Incomplete OTP', 'Please enter all 6 digits');
      return;
    }

    try {
      await verifyOTP('+91' + phoneNumber, otpValue);
      // Navigate to role selection
      router.push('/printxpress-role-selection');
    } catch (error) {
      Alert.alert('Invalid OTP', 'Please check the OTP and try again');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="print" size={40} color={printXpressTheme.colors.primary} />
          </View>
          <Text style={styles.appTitle}>Welcome back</Text>
          <Text style={styles.appSubtitle}>Smart printing at your fingertips</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {step === 'phone' ? (
            <View style={styles.stepContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="9876543210"
                  placeholderTextColor={printXpressTheme.colors.textTertiary}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  autoFocus
                />
              </View>

              <Pressable
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>Send OTP</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
              </Pressable>

              {/* Demo Hint */}
              <View style={styles.demoHint}>
                <MaterialIcons name="info-outline" size={16} color={printXpressTheme.colors.textSecondary} />
                <Text style={styles.demoText}>Demo: Any 10-digit number works</Text>
              </View>
            </View>
          ) : (
            <View style={styles.stepContainer}>
              <View style={styles.otpHeader}>
                <Text style={styles.otpInfo}>Enter the 6-digit code sent to</Text>
                <Text style={styles.otpPhone}>+91 {phoneNumber}</Text>
              </View>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (otpInputs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      digit && styles.otpInputFilled,
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(index, value)}
                    onKeyPress={({ nativeEvent: { key } }) => handleOtpKeyPress(index, key)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              <Pressable
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>Verify & Continue</Text>
              </Pressable>

              <Pressable
                style={styles.resendButton}
                onPress={() => setStep('phone')}
              >
                <Text style={styles.resendText}>Change number</Text>
              </Pressable>

              {/* Demo Hint */}
              <View style={styles.demoHint}>
                <MaterialIcons name="info-outline" size={16} color={printXpressTheme.colors.textSecondary} />
                <Text style={styles.demoText}>Demo: Any 6-digit code works</Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: printXpressTheme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: printXpressTheme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appTitle: {
    ...printXpressTheme.typography.headlineMedium,
    color: printXpressTheme.colors.textPrimary,
    marginBottom: 8,
  },
  appSubtitle: {
    ...printXpressTheme.typography.bodyMedium,
    color: printXpressTheme.colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepContainer: {
    gap: 24,
  },
  label: {
    ...printXpressTheme.typography.labelMedium,
    color: printXpressTheme.colors.textSecondary,
    marginLeft: 4,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: printXpressTheme.colors.surfaceContainerLow,
    borderRadius: printXpressTheme.borderRadius.large,
    borderWidth: 2,
    borderColor: printXpressTheme.colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  countryCode: {
    ...printXpressTheme.typography.bodyLarge,
    fontWeight: '600',
    color: printXpressTheme.colors.textPrimary,
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    ...printXpressTheme.typography.bodyLarge,
    color: printXpressTheme.colors.textPrimary,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: printXpressTheme.colors.primary,
    height: 56,
    borderRadius: printXpressTheme.borderRadius.large,
    gap: 8,
    ...printXpressTheme.shadow.medium,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    ...printXpressTheme.typography.titleMedium,
    color: '#fff',
    fontWeight: '700',
  },
  otpHeader: {
    alignItems: 'center',
    gap: 4,
  },
  otpInfo: {
    ...printXpressTheme.typography.bodyMedium,
    color: printXpressTheme.colors.textSecondary,
  },
  otpPhone: {
    ...printXpressTheme.typography.titleMedium,
    color: printXpressTheme.colors.textPrimary,
    fontWeight: '700',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 64,
    backgroundColor: printXpressTheme.colors.surfaceContainerLow,
    borderRadius: printXpressTheme.borderRadius.large,
    borderWidth: 2,
    borderColor: printXpressTheme.colors.border,
    textAlign: 'center',
    ...printXpressTheme.typography.headlineSmall,
    fontWeight: '700',
    color: printXpressTheme.colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: printXpressTheme.colors.primary,
    backgroundColor: printXpressTheme.colors.surfaceContainerLowest,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendText: {
    ...printXpressTheme.typography.labelLarge,
    color: printXpressTheme.colors.secondary,
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: printXpressTheme.colors.surfaceContainerLow,
    borderRadius: printXpressTheme.borderRadius.medium,
  },
  demoText: {
    ...printXpressTheme.typography.bodySmall,
    color: printXpressTheme.colors.textSecondary,
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
  },
  footerText: {
    ...printXpressTheme.typography.bodySmall,
    color: printXpressTheme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: printXpressTheme.colors.primary,
    fontWeight: '600',
  },
});
