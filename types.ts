export enum KYCStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  MANUAL_REVIEW = 'MANUAL_REVIEW'
}

export interface VerificationResult {
  documentValid: boolean;
  faceMatchScore: number; // 0-100
  tamperDetected: boolean;
  riskScore: number; // 0-100
  extractedData?: {
    name?: string;
    dob?: string;
    idNumber?: string;
  };
  reasoning?: string;
}

export interface KYCSubmission {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  submittedAt: string;
  documentType: string;
  status: KYCStatus;
  riskScore: number;
  verificationResult?: VerificationResult;
  // In a real app these would be URLs, here likely base64 for demo
  documentImage?: string; 
  selfieImage?: string;
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'waiting' | 'active' | 'completed' | 'error';
}