// Print-Xpress Theme - Material Design 3 inspired
export const printXpressTheme = {
  colors: {
    // Primary (Deep Blue)
    primary: '#003178',
    primaryDark: '#0d47a1',
    primaryLight: '#2b5bb5',
    primaryContainer: '#0d47a1',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#a1bbff',
    
    // Secondary (Green)
    secondary: '#006d37',
    secondaryLight: '#10B981',
    secondaryContainer: '#6bfe9c',
    onSecondary: '#ffffff',
    onSecondaryContainer: '#00743a',
    
    // Background & Surface
    background: '#f9f9f9',
    surface: '#f9f9f9',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f3f3f3',
    surfaceContainer: '#eeeeee',
    surfaceContainerHigh: '#e8e8e8',
    surfaceContainerHighest: '#e2e2e2',
    
    // Text
    textPrimary: '#1a1c1c',
    textSecondary: '#434652',
    textTertiary: '#737783',
    
    // Error
    error: '#ba1a1a',
    errorContainer: '#ffdad6',
    onError: '#ffffff',
    
    // Success (added for validation feedback)
    success: '#006d37',
    successContainer: '#6bfe9c',
    
    // Borders & Outlines
    border: '#c3c6d4',
    outline: '#737783',
    outlineVariant: '#c3c6d4',
  },
  
  typography: {
    displayLarge: { fontSize: 57, fontWeight: '700' as const, lineHeight: 64 },
    displayMedium: { fontSize: 45, fontWeight: '700' as const, lineHeight: 52 },
    displaySmall: { fontSize: 36, fontWeight: '700' as const, lineHeight: 44 },
    headlineLarge: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
    headlineMedium: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
    headlineSmall: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
    titleLarge: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
    titleMedium: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
    titleSmall: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
    bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
    labelLarge: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
    labelMedium: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
    labelSmall: { fontSize: 11, fontWeight: '600' as const, lineHeight: 16 },
  },
  
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 24,
    full: 9999,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};
