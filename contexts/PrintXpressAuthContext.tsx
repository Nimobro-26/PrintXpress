// Print-Xpress Authentication Context (Mock Implementation)
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types/printXpress';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<void>;
  selectRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const PrintXpressAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string>('');

  const sendOTP = async (phoneNumber: string) => {
    setIsLoading(true);
    try {
      // Mock OTP send - in real app, use Firebase Phone Auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPendingPhone(phoneNumber);
      console.log('Mock OTP sent to:', phoneNumber);
      console.log('Demo OTP: 123456');
    } catch (error) {
      console.error('OTP send error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    setIsLoading(true);
    try {
      // Mock OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Accept any 6-digit OTP for demo
      if (otp.length === 6) {
        // Don't set user yet - wait for role selection
        console.log('OTP verified for:', phoneNumber);
      } else {
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
