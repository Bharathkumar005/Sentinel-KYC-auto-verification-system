import React, { useState } from 'react';
import Navbar from './components/Navbar';
import KYCForm from './components/KYCForm';
import LiveVerification from './components/LiveVerification';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';
import { KYCSubmission, KYCStatus, VerificationResult } from './types';
// CHANGED: Import from verificationService instead of geminiService
import { analyzeKYCSubmission } from './services/verificationService';
import { CheckCircle, AlertTriangle, XCircle, RefreshCcw } from 'lucide-react';

// Mock Initial Data for Dashboard
const MOCK_SUBMISSIONS: KYCSubmission[] = [
  { id: '1', userId: 'u1', fullName: 'Alice Johnson', email: 'alice@example.com', submittedAt: '2023-10-25', documentType: 'passport', status: KYCStatus.APPROVED, riskScore: 12 },
  { id: '2', userId: 'u2', fullName: 'Bob Smith', email: 'bob@example.com', submittedAt: '2023-10-26', documentType: 'aadhaar', status: KYCStatus.MANUAL_REVIEW, riskScore: 45 },
  { id: '3', userId: 'u3', fullName: 'Charlie Davis', email: 'charlie@fake.com', submittedAt: '2023-10-26', documentType: 'license', status: KYCStatus.REJECTED, riskScore: 88 },
];

const App: React.FC = () => {
  const [view, setView] = useState<'user' | 'admin'>('user');
  const [submissions, setSubmissions] = useState<KYCSubmission[]>(MOCK_SUBMISSIONS);
  
  // User View States
  const [userState, setUserState] = useState<'landing' | 'form' | 'processing' | 'result'>('landing');
  const [currentSubmission, setCurrentSubmission] = useState<Partial<KYCSubmission> | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleKYCSubmit = async (data: Partial<KYCSubmission>, docFile: File, selfieBase64: string) => {
    setCurrentSubmission(data);
    setUserState('processing');

    // Convert doc to base64
    const reader = new FileReader();
    reader.readAsDataURL(docFile);
    reader.onloadend = async () => {
      const docBase64 = reader.result as string;
      
      try {
        // Call Python Backend Service
        const result = await analyzeKYCSubmission(docBase64, selfieBase64);
        setVerificationResult(result);

        // Determine Final Status based on decision engine logic
        let finalStatus = KYCStatus.MANUAL_REVIEW;
        if (result.riskScore < 30 && result.documentValid && result.faceMatchScore > 80) {
            finalStatus = KYCStatus.APPROVED;
        } else if (result.riskScore > 75 || !result.documentValid) {
            finalStatus = KYCStatus.REJECTED;
        }

        // Create new submission record
        const newSubmission: KYCSubmission = {
            id: Date.now().toString(),
            userId: `user_${Date.now()}`,
            fullName: data.fullName || 'Unknown',
            email: data.email || 'unknown@example.com',
            submittedAt: new Date().toISOString(),
            documentType: data.documentType || 'id',
            status: finalStatus,
            riskScore: result.riskScore,
            verificationResult: result,
            documentImage: docBase64,
            selfieImage: selfieBase64
        };

        // Add to "Database"
        setSubmissions(prev => [newSubmission, ...prev]);

      } catch (error) {
        console.error("Processing failed", error);
        setUserState('result'); // Will show error state via null result or risk score 100
      }
    };
  };

  const resetUserFlow = () => {
    setUserState('landing');
    setCurrentSubmission(null);
    setVerificationResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar currentView={view} setView={setView} />
      
      <main className="py-10">
        {view === 'admin' ? (
          <AdminDashboard submissions={submissions} />
        ) : (
          <div className="max-w-4xl mx-auto px-4">
            {userState === 'landing' && (
              <LandingPage onStart={() => setUserState('form')} />
            )}

            {userState === 'form' && (
               <>
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900">Begin Verification</h2>
                    <p className="mt-2 text-slate-600">Please provide your details and documents below.</p>
                </div>
                <KYCForm onSubmit={handleKYCSubmit} />
               </>
            )}

            {userState === 'processing' && (
                <LiveVerification 
                    verificationResult={verificationResult} 
                    onComplete={() => setUserState('result')}
                />
            )}

            {userState === 'result' && verificationResult && (
                <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 animate-fadeIn">
                    <div className="flex flex-col items-center text-center">
                        {verificationResult.riskScore < 30 ? (
                             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                             </div>
                        ) : verificationResult.riskScore > 75 ? (
                             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <XCircle className="w-10 h-10 text-red-600" />
                             </div>
                        ) : (
                             <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle className="w-10 h-10 text-amber-600" />
                             </div>
                        )}
                        
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            {verificationResult.riskScore < 30 ? 'Verification Successful' : 
                             verificationResult.riskScore > 75 ? 'Verification Failed' : 'Under Manual Review'}
                        </h2>
                        <p className="text-slate-500 mb-8">
                            {verificationResult.reasoning || "Your documents have been processed."}
                        </p>

                        <div className="w-full bg-slate-50 rounded-lg p-6 mb-8 text-left">
                            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Analysis Details</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Document Validity</span>
                                    <span className={verificationResult.documentValid ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                        {verificationResult.documentValid ? "Valid" : "Invalid"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Face Match Score</span>
                                    <span className="font-medium text-slate-900">{verificationResult.faceMatchScore}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Tampering Check</span>
                                    <span className={!verificationResult.tamperDetected ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                        {verificationResult.tamperDetected ? "Tampering Detected" : "Passed"}
                                    </span>
                                </div>
                                
                                {verificationResult.extractedData && (Object.keys(verificationResult.extractedData).length > 0) && (
                                    <div className="mt-3 pt-3 border-t border-slate-200 border-dashed">
                                        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Extracted Information</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-xs text-slate-400 block">Name</span>
                                                <span className="font-medium">{verificationResult.extractedData.name || 'Not Found'}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-400 block">ID Number</span>
                                                <span className="font-medium">{verificationResult.extractedData.idNumber || 'Not Found'}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-400 block">DOB</span>
                                                <span className="font-medium">{verificationResult.extractedData.dob || 'Not Found'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between">
                                    <span className="text-slate-900 font-semibold">Risk Score</span>
                                    <span className={`font-bold ${
                                        verificationResult.riskScore < 30 ? 'text-green-600' :
                                        verificationResult.riskScore > 75 ? 'text-red-600' : 'text-amber-600'
                                    }`}>
                                        {verificationResult.riskScore}/100
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={resetUserFlow}
                            className="inline-flex items-center px-6 py-3 border border-slate-300 shadow-sm text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Start New Verification
                        </button>
                    </div>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;