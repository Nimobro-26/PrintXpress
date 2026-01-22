// Print-Xpress Configuration

export const config = {
  // App Info
  appName: 'Print-Xpress',
  tagline: 'Smart printing at your fingertips',
  
  // Print Settings
  printPricing: {
    bwPerPage: 0.10, // $0.10 per page B&W
    colorPerPage: 0.25, // $0.25 per page Color
    highQualityMultiplier: 1.5, // 50% extra for high quality
  },
  
  // OTP Settings
  otpLength: 6,
  otpExpiryMinutes: 5,
  
  // File Upload
  maxFileSizeMB: 10,
  supportedFormats: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
  
  // Print Options
  paperSizes: [
    { id: 'a4', label: 'A4 (Standard)', width: 210, height: 297 },
    { id: 'a5', label: 'A5 (Small)', width: 148, height: 210 },
    { id: 'letter', label: 'Letter', width: 216, height: 279 },
    { id: 'legal', label: 'Legal', width: 216, height: 356 },
  ],
  
  colorModes: [
    { id: 'bw', label: 'B&W', price: 0.10 },
    { id: 'color', label: 'Color', price: 0.25 },
  ],
  
  // Payment Methods
  paymentMethods: [
    { id: 'upi', label: 'UPI (PhonePe, Google Pay)', icon: 'account-balance' },
    { id: 'card', label: 'Card Payment', icon: 'credit-card' },
  ],
  
  // ATM Locations (Mock Data)
  atmLocations: [
    { id: 'atm1', name: 'Downtown Station (A2)', distance: '0.4 miles', status: 'Open 24/7' },
    { id: 'atm2', name: 'Campus Center (B1)', distance: '1.2 miles', status: 'Open 7AM-11PM' },
    { id: 'atm3', name: 'Mall Plaza (C3)', distance: '2.8 miles', status: 'Open 24/7' },
  ],
};
