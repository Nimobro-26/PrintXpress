// Print-Xpress Splash Screen
import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { printXpressTheme } from '../constants/printXpressTheme';
import { usePrintXpressAuth } from '../contexts/PrintXpressAuthContext';

export default function PrintXpressSplashScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = usePrintXpressAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        // Route to appropriate dashboard based on role
        if (user.role === 'user') {
          router.replace('/printxpress-user-home');
        } else if (user.role === 'pilot') {
          router.replace('/printxpress-pilot-dashboard');
        } else if (user.role === 'admin') {
          router.replace('/printxpress-admin-dashboard');
        }
      } else {
        router.replace('/printxpress-login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

  return (
    <LinearGradient
      colors={[printXpressTheme.colors.primary, printXpressTheme.colors.primaryDark]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <MaterialIcons name="print" size={80} color="#fff" />
        </View>

        {/* App Name */}
        <Text style={styles.appName}>Print-Xpress</Text>
        
        {/* Tagline */}
        <Text style={styles.tagline}>Upload • Pay • Print</Text>
        
        {/* Feature Icons */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <MaterialIcons name="upload-file" size={32} color="rgba(255,255,255,0.7)" />
            <Text style={styles.featureText}>Upload</Text>
          </View>
          
          <View style={styles.featureDivider} />
          
          <View style={styles.featureItem}>
            <MaterialIcons name="payments" size={32} color="rgba(255,255,255,0.7)" />
            <Text style={styles.featureText}>Pay</Text>
          </View>
          
          <View style={styles.featureDivider} />
          
          <View style={styles.featureItem}>
            <MaterialIcons name="print" size={32} color="rgba(255,255,255,0.7)" />
            <Text style={styles.featureText}>Print</Text>
          </View>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { animationDelay: `${i * 0.2}s` },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Initializing self-service terminal...
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 32,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 48,
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  featureDivider: {
    width: 32,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  loadingContainer: {
    marginTop: 64,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: printXpressTheme.colors.secondaryLight,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 24,
    fontStyle: 'italic',
  },
});
