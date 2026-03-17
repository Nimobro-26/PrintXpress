// Print-Xpress Login & OTP Verification Screen
import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Animated } from 'react-native';
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
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [sentOTP, setSentOTP] = useState('');
  
  const otpInputs = useRef<(TextInput | null)[]>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const successAnimation = useRef(new Animated.Value(0)).current;

  // Phone number validation
  const isPhoneValid = phoneNumber.length === 10 && /^\d{10}$/.test(phoneNumber);
  
  // OTP complete check
  const isOtpComplete = otp.every(digit => digit !== '');

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle phone number input
  const handlePhoneChange = (text: string) => {
    // Remove all non-numeric characters
    const numericOnly = text.replace(/[^0-9]/g, '');
    
    // Limit to 10 digits
    const limited = numericOnly.slice(0, 10);
    setPhoneNumber(limited);
    
    // Real-time validation
    if (limited.length > 0 && limited.length < 10) {
      setPhoneError('Enter valid 10-digit number');
    } else {
      setPhoneError('');
    }
  };

  const handleSendOTP = async () => {
    if (!isPhoneValid) {
      setPhoneError('Please enter a valid 10-digit number');
      return;
    }

    try {
      const generatedOTP = await sendOTP('+91' + phoneNumber);
      setSentOTP(generatedOTP);
      setStep('otp');
      setResendTimer(30);
      setOtpError('');
      setTimeout(() => otpInputs.current[0]?.focus(), 300);
    } catch (error) {
      setPhoneError('Failed to send OTP. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    try {
      setOtp(['', '', '', '', '', '']);
      const generatedOTP = await sendOTP('+91' + phoneNumber);
      setSentOTP(generatedOTP);
      setResendTimer(30);
      setOtpError('');
      setTimeout(() => otpInputs.current[0]?.focus(), 300);
    } catch (error) {
      setOtpError('Failed to resend OTP');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (text: string) => {
    // Extract digits from pasted text
    const digits = text.replace(/[^0-9]/g, '').slice(0, 6);
    
    if (digits.length === 6) {
      const newOtp = digits.split('');
      setOtp(newOtp);
      setOtpError('');
      // Focus last input
      otpInputs.current[5]?.focus();
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
      setOtpError('Please enter all 6 digits');
      return;
    }

    try {
      const isValid = await verifyOTP('+91' + phoneNumber, otpValue);
      
      if (isValid) {
        // Success animation
        Animated.sequence([
          Animated.timing(successAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          router.push('/printxpress-role-selection');
        });
      }
    } catch (error) {
      // Error shake animation
      setOtpError('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start(() => {
        setTimeout(() => otpInputs.current[0]?.focus(), 100);
      });
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
              <View style={[
                styles.phoneInputContainer,
                phoneError && styles.inputError,
                isPhoneValid && styles.inputSuccess,
              ]}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="9876543210"
                  placeholderTextColor={printXpressTheme.colors.textTertiary}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  autoFocus
                />
                {isPhoneValid && (
                  <MaterialIcons name="check-circle" size={20} color={printXpressTheme.colors.success} />
                )}
              </View>
              {phoneError ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={16} color={printXpressTheme.colors.error} />
                  <Text style={styles.errorText}>{phoneError}</Text>
                </View>
              ) : null}

              <Pressable
                style={[
                  styles.primaryButton,
                  (!isPhoneValid || isLoading) && styles.buttonDisabled,
                ]}
                onPress={handleSendOTP}
                disabled={!isPhoneValid || isLoading}
              >
                {isLoading ? (
                  <Text style={styles.primaryButtonText}>Sending...</Text>
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Send OTP</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </Pressable>

              {/* Demo Hint */}
              <View style={styles.demoHint}>
                <MaterialIcons name="info-outline" size={16} color={printXpressTheme.colors.textSecondary} />
                <Text style={styles.demoText}>Demo: OTP will be shown in console</Text>
              </View>
            </View>
          ) : (
            <View style={styles.stepContainer}>
              <View style={styles.otpHeader}>
                <Text style={styles.otpInfo}>Enter the 6-digit code sent to</Text>
                <Text style={styles.otpPhone}>+91 {phoneNumber}</Text>
              </View>

              <Animated.View style={[
                styles.otpContainer,
                { transform: [{ translateX: shakeAnimation }] },
              ]}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (otpInputs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      digit && styles.otpInputFilled,
                      otpError && styles.otpInputError,
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(index, value)}
                    onKeyPress={({ nativeEvent: { key } }) => handleOtpKeyPress(index, key)}
                    onPaste={(e) => {
                      if (index === 0) {
                        const text = e.nativeEvent.clipboardData?.getData('text') || '';
                        handleOtpPaste(text);
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </Animated.View>
              {otpError ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={16} color={printXpressTheme.colors.error} />
                  <Text style={styles.errorText}>{otpError}</Text>
                </View>
              ) : null}

              <Pressable
                style={[
                  styles.primaryButton,
                  (!isOtpComplete || isLoading) && styles.buttonDisabled,
                ]}
                onPress={handleVerifyOTP}
                disabled={!isOtpComplete || isLoading}
              >
                {isLoading ? (
                  <Text style={styles.primaryButtonText}>Verifying...</Text>
                ) : (
                  <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                )}
              </Pressable>

              <View style={styles.otpActions}>
                <Pressable
                  style={[styles.resendButton, resendTimer > 0 && styles.resendButtonDisabled]}
                  onPress={handleResendOTP}
                  disabled={resendTimer > 0}
                >
                  {resendTimer > 0 ? (
                    <Text style={styles.resendTextDisabled}>Resend in {resendTimer}s</Text>
                  ) : (
                    <Text style={styles.resendText}>Resend OTP</Text>
                  )}
                </Pressable>
                
                <Pressable
                  style={styles.changeNumberButton}
                  onPress={() => {
                    setStep('phone');
                    setOtp(['', '', '', '', '', '']);
                    setOtpError('');
                    setResendTimer(0);
                  }}
                >
                  <Text style={styles.changeNumberText}>Change number</Text>
                </Pressable>
              </View>

              {/* Demo Hint */}
              <View style={styles.demoHint}>
                <MaterialIcons name="info-outline" size={16} color={printXpressTheme.colors.textSecondary} />
                <Text style={styles.demoText}>Check console for OTP: {sentOTP}</Text>
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
  inputError: {
    borderColor: printXpressTheme.colors.error,
    backgroundColor: printXpressTheme.colors.errorContainer + '10',
  },
  inputSuccess: {
    borderColor: printXpressTheme.colors.success,
    backgroundColor: printXpressTheme.colors.successContainer + '10',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -12,
  },
  errorText: {
    ...printXpressTheme.typography.bodySmall,
    color: printXpressTheme.colors.error,
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
  otpInputError: {
    borderColor: printXpressTheme.colors.error,
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  resendButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    ...printXpressTheme.typography.labelLarge,
    color: printXpressTheme.colors.secondary,
    fontWeight: '600',
  },
  resendTextDisabled: {
    ...printXpressTheme.typography.labelLarge,
    color: printXpressTheme.colors.textTertiary,
  },
  changeNumberButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  changeNumberText: {
    ...printXpressTheme.typography.labelLarge,
    color: printXpressTheme.colors.textSecondary,
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
