import React from 'react';
import { ShieldCheck, Zap, Lock, ScanFace } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-center animate-fadeIn">
      <div className="mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-2xl mb-8 shadow-sm">
          <ShieldCheck className="w-16 h-16 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Identity Verification <br />
          <span className="text-blue-600">On-Premise Python AI</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Secure, fast, and automated. Powered by local OpenCV, Tesseract, and Face Recognition models.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16 text-left">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Tesseract OCR</h3>
          <p className="text-slate-500">Local text extraction engine running on your backend to read documents securely.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <ScanFace className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Face Recognition Lib</h3>
          <p className="text-slate-500">Uses dlib-based facial encodings to match selfie biometrics with ID photos.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">OpenCV Forensics</h3>
          <p className="text-slate-500">Computer vision algorithms detect blur, glare, and potential digital tampering.</p>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={onStart}
          className="group relative px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
        >
          <span className="relative z-10 flex items-center">
            Start Local Verification
            <ShieldCheck className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
          </span>
        </button>
        <p className="text-sm text-slate-400">
          Requires Python Backend Running on Port 8000
        </p>
      </div>
    </div>
  );
};

export default LandingPage;