// Print-Xpress Authentication Context (Mock Implementation)
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types/printXpress';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOTP: (phoneNumber: string) => Promise<string>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<boolean>;
  selectRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const PrintXpressAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string>('');
  const [generatedOTP, setGeneratedOTP] = useState<string>('');

  const sendOTP = async (phoneNumber: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(otp);
      setPendingPhone(phoneNumber);
      
      console.log('🔐 OTP Generated:', otp);
      console.log('📱 Phone:', phoneNumber);
      
      return otp;
    } catch (error) {
      console.error('OTP send error:', error);
      throw new Error('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify OTP matches generated one
      const isValid = otp === generatedOTP;
      
      if (isValid) {
        console.log('✅ OTP verified successfully');
        return true;
      } else {
        console.log('❌ Invalid OTP. Expected:', generatedOTP, 'Got:', otp);
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const selectRole = (role: UserRole) => {
    // Create user with selected role
    const newUser: User = {
      id: 'mock_user_' + Date.now(),
      phoneNumber: pendingPhone,
      displayName: role === 'user' ? 'User' : role === 'pilot' ? 'Pilot Alex' : 'Admin Sarah',
      role,
      createdAt: new Date(),
    };
    
    setUser(newUser);
    setPendingPhone('');
  };

  const logout = () => {
    setUser(null);
    setPendingPhone('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        sendOTP,
        verifyOTP,
        selectRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const usePrintXpressAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('usePrintXpressAuth must be used within PrintXpressAuthProvider');
  }
  return context;
};
