// Print Context - Manage Print Jobs and Flow
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { PrintJob, PrintContextType } from '../types';
import { mockRecentJobs, generateOTP, calculatePrintCost } from '../services/mockData';

const PrintContext = createContext<PrintContextType | undefined>(undefined);

export const PrintProvider = ({ children }: { children: ReactNode }) => {
  const [currentJob, setCurrentJob] = useState<PrintJob | null>(null);
  const [recentJobs] = useState<PrintJob[]>(mockRecentJobs);
  const [loading, setLoading] = useState(false);

  const uploadDocument = async (file: any) => {
    setLoading(true);
    try {
      // Mock file upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newJob: PrintJob = {
        id: 'job_' + Date.now(),
        userId: 'user1',
        fileName: file.name || 'Document.pdf',
        fileSize: file.size || 2.4,
        fileUrl: file.uri || 'mock://document.pdf',
        fileType: file.type || 'pdf',
        
        // Default settings
        colorMode: 'bw',
        paperSize: 'a4',
        copies: 1,
        highQuality: false,
        
        totalPages: file.pages || 12,
        totalCost: 0,
        
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Calculate initial cost
      newJob.totalCost = calculatePrintCost(
        newJob.totalPages,
        newJob.colorMode,
        newJob.copies,
        newJob.highQuality
      );
      
      setCurrentJob(newJob);
      console.log('Document uploaded:', newJob);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePrintSettings = (settings: Partial<PrintJob>) => {
    if (!currentJob) return;
    
    const updatedJob = { ...currentJob, ...settings, updatedAt: new Date() };
    
    // Recalculate cost
    updatedJob.totalCost = calculatePrintCost(
      updatedJob.totalPages,
      updatedJob.colorMode,
      updatedJob.copies,
      updatedJob.highQuality
    );
    
    setCurrentJob(updatedJob);
  };

  const processPayment = async () => {
    if (!currentJob) throw new Error('No current job');
    
    setLoading(true);
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentJob({
        ...currentJob,
        status: 'paid',
        updatedAt: new Date(),
      });
      
      console.log('Payment processed:', currentJob.totalCost);
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateOTPForJob = async (): Promise<string> => {
    if (!currentJob) throw new Error('No current job');
    
    setLoading(true);
    try {
      // Generate OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      
      setCurrentJob({
        ...currentJob,
        otp,
        otpExpiresAt: expiresAt,
        atmId: 'atm1',
        atmName: 'Downtown Station (A2)',
        updatedAt: new Date(),
      });
      
      console.log('OTP generated:', otp, 'Expires:', expiresAt);
      return otp;
    } catch (error) {
      console.error('OTP generation error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completePrint = async () => {
    if (!currentJob) throw new Error('No current job');
    
    setLoading(true);
    try {
      // Mock print completion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setCurrentJob({
        ...currentJob,
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log('Print completed:', currentJob.id);
    } catch (error) {
      console.error('Print error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCurrentJob = () => {
    setCurrentJob(null);
  };

  return (
    <PrintContext.Provider
      value={{
        currentJob,
        recentJobs,
        loading,
        uploadDocument,
        updatePrintSettings,
        processPayment,
        generateOTP: generateOTPForJob,
        completePrint,
        clearCurrentJob,
      }}
    >
      {children}
    </PrintContext.Provider>
  );
};

export const usePrint = () => {
  const context = useContext(PrintContext);
  if (!context) {
    throw new Error('usePrint must be used within PrintProvider');
  }
  return context;
};
