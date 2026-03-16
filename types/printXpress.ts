// Print-Xpress Type Definitions

export type UserRole = 'user' | 'pilot' | 'admin';

export interface User {
  id: string;
  phoneNumber: string;
  displayName: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface PrintJob {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'image';
  
  // Print settings
  colorMode: 'bw' | 'color';
  paperSize: 'a4' | 'a3' | 'letter' | 'legal';
  copies: number;
  pageRange?: string;
  highQuality: boolean;
  
  totalPages: number;
  totalCost: number;
  
  // Delivery info
  deliveryType?: 'atm' | 'delivery';
  deliveryAddress?: string;
  packagingType?: 'standard' | 'premium';
  
  // Status
  status: 'pending' | 'printing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
  
  // OTP
  otp?: string;
  otpExpiresAt?: Date;
  
  // ATM info
  atmId?: string;
  atmName?: string;
  
  // Pilot assignment
  pilotId?: string;
  
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface DeliveryRequest {
  id: string;
  orderId: string;
  pickupLocation: string;
  deliveryLocation: string;
  distance: number;
  estimatedTime: number;
  pages: number;
  priority: 'standard' | 'urgent';
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
}

export interface PrinterDevice {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  paperLevel: number;
  inkLevel: number;
}

export interface DeliveryPilot {
  id: string;
  name: string;
  phone: string;
  status: 'online' | 'offline' | 'busy';
  rating: number;
  totalDeliveries: number;
  earnings: number;
  avatar?: string;
}
