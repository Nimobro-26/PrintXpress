// Auth Context - Mock Firebase Authentication for Demo
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string>('');

  const signIn = async (phoneNumber: string) => {
    setLoading(true);
    try {
      // Mock: Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPendingPhone(phoneNumber);
      console.log('Mock OTP sent to:', phoneNumber);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    setLoading(true);
    try {
      // Mock: Any 4-digit code works for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: 'user_' + Date.now(),
        phoneNumber: pendingPhone,
        displayName: 'Alex',
        createdAt: new Date(),
      };
      
      setUser(newUser);
      setPendingPhone('');
      console.log('Mock user authenticated:', newUser);
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      setPendingPhone('');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, verifyOTP, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
