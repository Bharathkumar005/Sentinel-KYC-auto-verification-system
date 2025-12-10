import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2, ShieldAlert, FileSearch, UserCheck, Activity } from 'lucide-react';
import { ProcessingStep, VerificationResult, KYCStatus } from '../types';

interface LiveVerificationProps {
  onComplete: () => void;
  verificationResult: VerificationResult | null;
}

const stepsInitial: ProcessingStep[] = [
  { id: 'ocr', label: 'Extracting Document Data (OCR)', status: 'waiting' },
  { id: 'tamper', label: 'Document Forensics & Tamper Check', status: 'waiting' },
  { id: 'biometric', label: 'Biometric Face Matching', status: 'waiting' },
  { id: 'risk', label: 'Calculating Risk Score', status: 'waiting' },
];

const LiveVerification: React.FC<LiveVerificationProps> = ({ onComplete, verificationResult }) => {
  const [steps, setSteps] = useState<ProcessingStep[]>(stepsInitial);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // This effect animates the steps visually, 
    // waiting for the actual result prop to be populated before finishing the last step
    if (!verificationResult && currentStepIndex === 0) {
      setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'active' } : s));
    }

    const timer = setInterval(() => {
      setSteps(prev => {
        const newSteps = [...prev];
        
        // If we have a result, we can fast-forward or complete steps
        if (verificationResult) {
            // Mark current as completed
            if (newSteps[currentStepIndex].status === 'active') {
               newSteps[currentStepIndex].status = 'completed';
               
               // Move to next if available
               if (currentStepIndex < newSteps.length - 1) {
                 setCurrentStepIndex(currentStepIndex + 1);
                 newSteps[currentStepIndex + 1].status = 'active';
               } else {
                 // All done
                 clearInterval(timer);
                 setTimeout(onComplete, 1000); // Slight delay before showing final result
               }
            }
        } else {
             // Simulate "working" state if result isn't back yet, but don't finish the last step
             // Just keeping the current step active or slowly progressing through first 2 mock steps
             if (currentStepIndex < 2 && newSteps[currentStepIndex].status === 'active') {
                // For demo, we just wait for result. 
                // In a real app, socket events would drive this.
             }
        }
        return newSteps;
      });
    }, 1500); // Pace of animation

    return () => clearInterval(timer);
  }, [currentStepIndex, verificationResult, onComplete]);

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 animate-pulse">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Processing Verification</h2>
          <p className="text-slate-500 mt-2">Our AI engine is analyzing your credentials in real-time.</p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center relative">
              <div className="flex-shrink-0 mr-4 z-10 bg-white">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                ) : step.status === 'active' ? (
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                ) : (
                  <Circle className="w-8 h-8 text-slate-300" />
                )}
              </div>
              
              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div className={`absolute left-4 top-8 w-0.5 h-10 ${
                  steps[index+1].status !== 'waiting' ? 'bg-blue-200' : 'bg-slate-100'
                }`} />
              )}

              <div className="flex-1">
                <h4 className={`text-base font-medium ${
                  step.status === 'active' ? 'text-blue-700' : 
                  step.status === 'completed' ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {step.label}
                </h4>
                {step.status === 'active' && (
                  <p className="text-xs text-blue-500 mt-1">Processing...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveVerification;